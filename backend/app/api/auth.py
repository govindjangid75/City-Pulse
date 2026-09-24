"""
CityPulse Civic Authentication Router.
Provides user registration (Sign Up), authentication (Sign In), profile query, and demo profiles.
"""
import uuid
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from ..database import get_db_connection, hash_password, verify_password, get_supabase_client

router = APIRouter(prefix="/auth", tags=["Authentication"])

class SignUpRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=120)
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=6)
    role: str = Field(default="citizen")
    primary_zone: str = Field(default="zone-1")

class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=120)
    password: str = Field(..., min_length=1)

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    primary_zone: str
    created_at: str

class AuthResponse(BaseModel):
    token: str
    user: UserResponse
    message: str

def generate_session_token(user_id: str) -> str:
    """Generate a lightweight token for session persistence."""
    return f"cptkn_{user_id}_{uuid.uuid4().hex[:16]}"

@router.post("/signup", response_model=AuthResponse)
def signup(payload: SignUpRequest):
    """Register a new citizen, municipal analyst, or first responder (Supabase + Local)."""
    email_clean = payload.email.lower().strip()
    valid_roles = ["citizen", "analyst", "responder"]
    role = payload.role.lower() if payload.role.lower() in valid_roles else "citizen"
    
    # Try Supabase Auth first if configured
    sb = get_supabase_client()
    sb_token = None
    sb_user_id = None
    if sb:
        try:
            sb_res = sb.auth.sign_up({
                "email": email_clean,
                "password": payload.password,
                "options": {
                    "data": {
                        "full_name": payload.full_name.strip(),
                        "role": role,
                        "primary_zone": payload.primary_zone
                    }
                }
            })
            if sb_res.user:
                sb_user_id = str(sb_res.user.id)
                if sb_res.session:
                    sb_token = sb_res.session.access_token
        except Exception as e:
            err_str = str(e).lower()
            if "already registered" in err_str or "already exists" in err_str:
                raise HTTPException(status_code=400, detail="An account with this email already exists in Supabase.")
            print(f"[Supabase] Signup fallback note: {e}")

    # Synchronize with local SQLite database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE LOWER(email) = ?", (email_clean,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    user_id = sb_user_id or f"usr_{uuid.uuid4().hex[:12]}"
    created_at = datetime.now(timezone.utc).isoformat()
    hashed_pw = hash_password(payload.password)
    
    cursor.execute("""
    INSERT INTO users (id, email, full_name, hashed_password, role, primary_zone, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, email_clean, payload.full_name.strip(), hashed_pw, role, payload.primary_zone, created_at))
    conn.commit()
    conn.close()
    
    user_data = UserResponse(
        id=user_id,
        email=email_clean,
        full_name=payload.full_name.strip(),
        role=role,
        primary_zone=payload.primary_zone,
        created_at=created_at
    )
    
    token = sb_token or generate_session_token(user_id)
    return AuthResponse(token=token, user=user_data, message="Civic account registered successfully.")

@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest):
    """Authenticate with email and password (Supabase Auth with SQLite fallback)."""
    email_clean = payload.email.lower().strip()

    # Try Supabase Auth first if configured
    sb = get_supabase_client()
    if sb:
        try:
            sb_res = sb.auth.sign_in_with_password({
                "email": email_clean,
                "password": payload.password
            })
            if sb_res.user and sb_res.session:
                meta = sb_res.user.user_metadata or {}
                user_data = UserResponse(
                    id=str(sb_res.user.id),
                    email=sb_res.user.email,
                    full_name=meta.get("full_name", email_clean.split("@")[0]),
                    role=meta.get("role", "citizen"),
                    primary_zone=meta.get("primary_zone", "zone-1"),
                    created_at=str(sb_res.user.created_at or datetime.now(timezone.utc).isoformat())
                )
                return AuthResponse(token=sb_res.session.access_token, user=user_data, message="Welcome back to CityPulse (Supabase).")
        except Exception as e:
            print(f"[Supabase] Login fallback to local DB: {e}")

    # Fallback to local SQLite database verification
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, email, full_name, hashed_password, role, primary_zone, created_at
    FROM users WHERE LOWER(email) = ?
    """, (email_clean,))
    user_row = cursor.fetchone()
    conn.close()
    
    if not user_row or not verify_password(payload.password, user_row["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    user_data = UserResponse(
        id=user_row["id"],
        email=user_row["email"],
        full_name=user_row["full_name"],
        role=user_row["role"],
        primary_zone=user_row["primary_zone"],
        created_at=user_row["created_at"]
    )
    
    token = generate_session_token(user_row["id"])
    return AuthResponse(token=token, user=user_data, message="Welcome back to CityPulse.")

@router.get("/me", response_model=UserResponse)
def get_current_user(authorization: Optional[str] = Header(None)):
    """Fetch profile of current authenticated user from Supabase or session token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token required.")
    
    token = authorization.split("Bearer ", 1)[1].strip()

    # If Supabase JWT token
    sb = get_supabase_client()
    if sb and not token.startswith("cptkn_"):
        try:
            u_res = sb.auth.get_user(token)
            if u_res and u_res.user:
                meta = u_res.user.user_metadata or {}
                return UserResponse(
                    id=str(u_res.user.id),
                    email=u_res.user.email,
                    full_name=meta.get("full_name", u_res.user.email.split("@")[0]),
                    role=meta.get("role", "citizen"),
                    primary_zone=meta.get("primary_zone", "zone-1"),
                    created_at=str(u_res.user.created_at)
                )
        except Exception as e:
            print(f"[Supabase] get_user notice: {e}")

    # Local token format: cptkn_{user_id}_{random}
    if not token.startswith("cptkn_"):
        raise HTTPException(status_code=401, detail="Invalid session token.")
    
    parts = token.split("_")
    if len(parts) < 3:
        raise HTTPException(status_code=401, detail="Malformed session token.")
        
    user_id = f"usr_{parts[1]}" if not parts[1].startswith("usr_") else parts[1]
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, email, full_name, role, primary_zone, created_at 
    FROM users WHERE id = ? OR id = ?
    """, (user_id, f"usr_{parts[1]}"))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="User session not found.")
        
    return UserResponse(
        id=row["id"],
        email=row["email"],
        full_name=row["full_name"],
        role=row["role"],
        primary_zone=row["primary_zone"],
        created_at=row["created_at"]
    )

@router.get("/demo-users")
def get_demo_users():
    """Returns available pre-seeded demo personas for instant one-click login in the UI."""
    return [
        {
            "email": "citizen@citypulse.org",
            "password": "citizen123",
            "full_name": "Maya Lin",
            "role": "citizen",
            "title": "Local Resident",
            "badge": "👤 Citizen",
            "zone": "zone-1",
            "zone_name": "North District",
            "description": "Monitors neighborhood safety, weather alerts, and 311 complaints."
        },
        {
            "email": "analyst@citypulse.gov",
            "password": "analyst123",
            "full_name": "David Vance",
            "role": "analyst",
            "title": "Municipal Urban Planner",
            "badge": "🏛️ City Analyst",
            "zone": "zone-3",
            "zone_name": "Metro Core & Station",
            "description": "Analyzes multi-feed cross-correlations, delays, and historical trends."
        },
        {
            "email": "ops@citypulse.gov",
            "password": "dispatch123",
            "full_name": "Capt. Sarah Chen",
            "role": "responder",
            "title": "Emergency Operations Dispatch",
            "badge": "🚨 First Responder",
            "zone": "zone-2",
            "zone_name": "East Corridor",
            "description": "Monitors active flash floods, high-severity spikes, and rapid-response alerts."
        }
    ]

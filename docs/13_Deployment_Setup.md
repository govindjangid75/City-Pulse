# Deployment Setup
## CityPulse: Local Development, Docker Containerization, and Cloud Deployment

---

## 1. Local Development Quickstart

### 1.1 Prerequisites
- Python 3.10 or higher
- Node.js 18+ and npm
- Git

### 1.2 Backend Setup
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Seed sample data into SQLite
python scripts/seed.py --from-dir ../sample_data

# 5. Start the FastAPI ASGI server with hot reload
uvicorn app.main:app --reload --port 8000
```
Backend API will be running at: `http://localhost:8000`  
Interactive OpenAPI documentation at: `http://localhost:8000/docs`

### 1.3 Frontend Setup
```bash
# 1. Navigate to frontend directory in a second terminal
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start Vite dev server
npm run dev
```
Frontend web application will be accessible at: `http://localhost:5173`

---

## 2. Docker Containerization Setup

### 2.1 Backend `Dockerfile`
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
COPY sample_data/ /app/sample_data/
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2.2 Frontend `Dockerfile`
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2.3 Docker Compose (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - DATABASE_URL=sqlite:///./citypulse.db

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
```

---

## 3. Production Cloud Deployment Options

### Option A: Render / Fly.io (Backend) + Vercel / Netlify (Frontend)
- **Frontend on Vercel:** Deploy `frontend/` directory with standard Vite preset. Configure environment variable `VITE_API_URL` pointing to backend domain.
- **Backend on Render/Fly.io:** Deploy as a Python web service with start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

### Option B: Single VM via Nginx Reverse Proxy (AWS EC2 / DigitalOcean)
- Nginx proxies `/api` and `/ws` to Uvicorn running on `127.0.0.1:8000`.
- Static frontend bundle served directly from `/var/www/citypulse/dist`.
- Let's Encrypt SSL/TLS certificates configured via Certbot.

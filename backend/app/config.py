"""
Configuration settings for CityPulse.
Loads environment variables and sets defaults for zones, rolling windows, and data feeds.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "CityPulse"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./citypulse.db"
    
    # Predefined city zones for hackathon scope
    ACTIVE_ZONES: List[str] = ["zone-1", "zone-2", "zone-3", "zone-4"]
    
    # Correlation engine settings
    ROLLING_WINDOW_MINUTES: int = 30
    CORRELATION_THRESHOLD_COUNT: int = 3
    
    # Ingestion poller schedules (in seconds)
    POLL_WEATHER_SECONDS: int = 3600
    POLL_TRANSIT_SECONDS: int = 180
    POLL_311_SECONDS: int = 60
    
    # LLM Settings (optional enhancement)
    USE_LLM_SUMMARY: bool = False
    LLM_API_KEY: str = ""
    LLM_PROVIDER: str = "gemini"
    
    # Supabase Cloud Configuration
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # Live Telemetry APIs (TomTom & Open-Meteo)
    TOMTOM_API_KEY: str = ""
    CITY_LATITUDE: float = 28.5447
    CITY_LONGITUDE: float = 77.3331
    CITY_NAME: str = "Delhi NCR (Noida)"

    # Security & CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "*"]

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

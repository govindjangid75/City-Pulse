"""
Configuration settings for CityPulse.
Loads environment variables and sets defaults for zones, rolling windows, and data feeds.
"""
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "CityPulse"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./citypulse.db"
    
    # Predefined city zones for hackathon scope
    ACTIVE_ZONES: List[str] = ["zone-1", "zone-2", "zone-3", "zone-4"]
    
    # Correlation engine settings
    ROLLING_WINDOW_MINUTES: int = 30
    CORRELATION_THRESHOLD_COUNT: int = 3
    
    # LLM Settings (optional enhancement)
    USE_LLM_SUMMARY: bool = False
    LLM_API_KEY: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

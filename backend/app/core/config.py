from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "GlobeTrotter"
    env: str = "dev"

    frontend_origin: str = "http://localhost:3000"

    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 60 * 24 * 7

    database_url: str

    auto_create_tables: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()

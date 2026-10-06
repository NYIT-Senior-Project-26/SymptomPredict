from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "development"
    cors_origins: str = "http://localhost:8081"

    anthropic_api_key: str = ""
    claude_model: str = "claude-opus-5-5"

    database_url: str = ""
    supabase_url: str = ""
    supabase_service_role_key: str = ""

    google_places_api_key: str = ""
    zocdoc_client_id: str = ""
    zocdoc_client_secret: str = ""
    goodrx_api_key: str = ""
    goodrx_secret_key: str = ""
    openfda_api_key: str = ""

    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_api_key_sid: str = ""
    twilio_api_key_secret: str = ""
    agora_app_id: str = ""
    agora_app_certificate: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Anthropic
    anthropic_api_key: str = ""

    # Supabase (required for backend startup)
    supabase_url: str = ""
    supabase_key: str = ""

    # OpenAI — used for embeddings
    openai_api_key: str = ""

    # Pinecone
    pinecone_api_key: str = ""
    pinecone_index_name: str = ""
    pinecone_index_host: str = ""

    # Embedding model override
    embedding_model: str = "text-embedding-3-small"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    settings = Settings()

    missing = [
        name
        for name, val in [("SUPABASE_URL", settings.supabase_url), ("SUPABASE_KEY", settings.supabase_key)]
        if not val.strip()
    ]
    if missing:
        raise RuntimeError(f"Missing required environment variables in .env: {', '.join(missing)}")

    return settings

from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_key: str = ""
    anthropic_api_key: str = ""

    # OpenAI — used for embeddings
    openai_api_key: str = ""

    # Pinecone
    pinecone_api_key: str = ""
    pinecone_index_name: str = ""
    pinecone_index_host: str = ""  # optional; preferred over index name lookup if set

    # Embedding model override (optional)
    embedding_model: str = "text-embedding-3-small"

    class Config:
        env_file = ".env"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

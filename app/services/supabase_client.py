from __future__ import annotations

from functools import lru_cache
from typing import Any

from supabase import create_client

from .config import get_settings


@lru_cache(maxsize=1)
def get_supabase_client() -> Any:
    """
    Lazily creates a Supabase client using values from .env.

    Keeps the app importable even when credentials are not present yet.
    """

    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_key)


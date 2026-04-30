from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.services.supabase_client import get_supabase_client


def main() -> None:
    """
    Minimal Supabase connectivity check.
    It only performs a lightweight read query against employees.
    """

    client = get_supabase_client()
    result = client.table("employees").select("id", count="exact").limit(1).execute()
    payload = {"ok": True, "employees_count": result.count}
    print(json.dumps(payload))


if __name__ == "__main__":
    main()


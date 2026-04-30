#!/usr/bin/env bash
set -euo pipefail

# Applies the MVP relational schema using psql.
# Requires SUPABASE_DB_URL to be set, for example:
# postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCHEMA_FILE="${ROOT_DIR}/app/db/migrations/001_initial_schema.sql"

if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
  echo "ERROR: SUPABASE_DB_URL is not set."
  echo "Example:"
  echo "  export SUPABASE_DB_URL='postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres'"
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "ERROR: psql not found. Install PostgreSQL client tools first."
  exit 1
fi

echo "Applying schema: ${SCHEMA_FILE}"
psql "${SUPABASE_DB_URL}" -v ON_ERROR_STOP=1 -f "${SCHEMA_FILE}"
echo "Schema applied successfully."


# WorkBenchHR
Building an AI-powered platform for HR specialists at small businesses

## Database foundation (Supabase)

The executable MVP schema lives in:

- `app/db/migrations/001_initial_schema.sql`

This schema is aligned with the existing Pydantic entities:

- `Employee` -> `employees`
- `OnboardingTask` -> `onboarding_tasks`
- `TrainingRecord` -> `training_records`
- `Trigger` -> `triggers`
- `GeneratedDocument` -> `generated_documents`

### Option A: Apply in Supabase SQL Editor

1. Open Supabase project -> **SQL Editor**.
2. Open `app/db/migrations/001_initial_schema.sql`.
3. Copy-paste the full file and run it.

### Option B: Apply via psql script

```bash
export SUPABASE_DB_URL='postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres'
bash scripts/apply_schema.sh
```

### Verify connectivity

Set `.env` with:

- `SUPABASE_URL`
- `SUPABASE_KEY`

Then run:

```bash
python scripts/check_supabase_connection.py
```

Expected output:

```json
{"ok": true, "employees_count": 0}
```

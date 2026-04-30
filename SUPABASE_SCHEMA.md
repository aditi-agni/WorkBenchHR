# Suggested Supabase / Postgres Schema (MVP)

The executable schema for WorkBenchHR MVP now lives in:

- `app/db/migrations/001_initial_schema.sql`

This file is the source of truth and is aligned with current Pydantic models:

- `Employee` -> `employees`
- `OnboardingTask` -> `onboarding_tasks`
- `TrainingRecord` -> `training_records`
- `Trigger` -> `triggers`
- `GeneratedDocument` -> `generated_documents`

Enum mapping:

- `OnboardingTaskStatus` -> `onboarding_task_status`
- `GeneratedDocumentStatus` -> `generated_document_status`
- `TriggerType` -> `trigger_type`

Use README instructions to apply the SQL via Supabase SQL Editor or `scripts/apply_schema.sh`.


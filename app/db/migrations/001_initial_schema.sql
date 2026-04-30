-- WorkBenchHR MVP initial relational schema
-- Source of truth for Supabase SQL setup.
--
-- Enum mapping (Python -> Postgres):
-- - OnboardingTaskStatus -> onboarding_task_status
-- - GeneratedDocumentStatus -> generated_document_status
-- - TriggerType -> trigger_type

begin;

-- UUID helper for gen_random_uuid()
create extension if not exists pgcrypto;

-- Keep updated_at fresh on row updates
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Enums (created exactly once)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'onboarding_task_status') then
    create type onboarding_task_status as enum ('todo', 'in_progress', 'done');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'generated_document_status') then
    create type generated_document_status as enum ('queued', 'generated', 'failed');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'trigger_type') then
    create type trigger_type as enum (
      'onboarding_task_completed',
      'onboarding_task_due',
      'training_completed',
      'training_expired',
      'manual'
    );
  end if;
end
$$;

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  full_name varchar(200) not null,
  email varchar(320),
  role_title varchar(200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists employees_organization_id_idx
  on public.employees (organization_id);

drop trigger if exists employees_set_updated_at on public.employees;
create trigger employees_set_updated_at
before update on public.employees
for each row execute function public.set_updated_at();

create table if not exists public.onboarding_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  employee_id uuid not null references public.employees(id) on delete cascade,
  title varchar(250) not null,
  description text,
  due_date date,
  status onboarding_task_status not null default 'todo',
  assigned_to varchar(200),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onboarding_tasks_org_employee_idx
  on public.onboarding_tasks (organization_id, employee_id);

drop trigger if exists onboarding_tasks_set_updated_at on public.onboarding_tasks;
create trigger onboarding_tasks_set_updated_at
before update on public.onboarding_tasks
for each row execute function public.set_updated_at();

create table if not exists public.training_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  employee_id uuid not null references public.employees(id) on delete cascade,
  training_name varchar(250) not null,
  provider varchar(250),
  completed_at timestamptz,
  expires_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists training_records_org_employee_idx
  on public.training_records (organization_id, employee_id);

drop trigger if exists training_records_set_updated_at on public.training_records;
create trigger training_records_set_updated_at
before update on public.training_records
for each row execute function public.set_updated_at();

create table if not exists public.triggers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  name varchar(200) not null,
  description text,
  trigger_type trigger_type not null default 'manual',
  payload jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists triggers_org_idx
  on public.triggers (organization_id);

drop trigger if exists triggers_set_updated_at on public.triggers;
create trigger triggers_set_updated_at
before update on public.triggers
for each row execute function public.set_updated_at();

create table if not exists public.generated_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  employee_id uuid not null references public.employees(id) on delete cascade,
  trigger_id uuid references public.triggers(id) on delete set null,
  document_type varchar(200) not null,
  status generated_document_status not null default 'queued',
  content text,
  metadata jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists generated_documents_org_employee_idx
  on public.generated_documents (organization_id, employee_id);

create index if not exists generated_documents_org_trigger_idx
  on public.generated_documents (organization_id, trigger_id);

drop trigger if exists generated_documents_set_updated_at on public.generated_documents;
create trigger generated_documents_set_updated_at
before update on public.generated_documents
for each row execute function public.set_updated_at();

commit;


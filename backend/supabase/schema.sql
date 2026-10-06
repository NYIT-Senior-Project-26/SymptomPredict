-- Run in Supabase dashboard -> SQL Editor
create table if not exists symptom_checks (
    id uuid primary key default gen_random_uuid(),
    user_id text,
    symptoms jsonb not null,
    notes text,
    result jsonb not null,
    created_at timestamptz not null default now()
);

create index if not exists symptom_checks_user_id_idx on symptom_checks (user_id);

-- Only the backend (service role) writes here; enable RLS so the anon key can't.
alter table symptom_checks enable row level security;

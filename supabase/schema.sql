-- Run this in the Supabase SQL editor when you're ready to move off the
-- in-memory mock store in lib/db.ts.

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  input jsonb not null,
  estimate numeric not null,
  created_at timestamptz default now()
);

create index if not exists predictions_user_id_idx on predictions(user_id);

-- Row Level Security: each user can only see their own predictions.
alter table predictions enable row level security;

create policy "Users can view own predictions"
  on predictions for select
  using (auth.uid()::text = user_id::text);

create policy "Users can insert own predictions"
  on predictions for insert
  with check (auth.uid()::text = user_id::text);

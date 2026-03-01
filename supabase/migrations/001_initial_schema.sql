-- Pianinni database schema

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  language text not null default 'ru' check (language in ('ru', 'en')),
  created_at timestamptz not null default now()
);

create table if not exists public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  clef_mode text not null check (clef_mode in ('treble', 'bass', 'mixed')),
  total_lessons integer not null default 0,
  total_correct integer not null default 0,
  total_wrong integer not null default 0,
  last_played_at timestamptz,
  unique (user_id, clef_mode)
);

create table if not exists public.lesson_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  clef_mode text not null check (clef_mode in ('treble', 'bass', 'mixed')),
  score integer not null,
  total integer not null default 8,
  notes_played jsonb not null default '[]'::jsonb,
  played_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_progress_user on public.progress(user_id);
create index if not exists idx_lesson_history_user on public.lesson_history(user_id);
create index if not exists idx_lesson_history_played on public.lesson_history(played_at desc);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.lesson_history enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own progress"
  on public.progress for select using (auth.uid() = user_id);

create policy "Users can upsert own progress"
  on public.progress for insert with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.progress for update using (auth.uid() = user_id);

create policy "Users can view own lesson history"
  on public.lesson_history for select using (auth.uid() = user_id);

create policy "Users can insert own lesson history"
  on public.lesson_history for insert with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

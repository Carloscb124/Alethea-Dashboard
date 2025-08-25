-- Create table for collected news
create table if not exists public.news_items (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  title text,
  summary text,
  source text,
  category text,
  image_url text,
  content_markdown text,
  content_html text,
  read_time integer,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.news_items enable row level security;

-- Drop policy if exists and recreate
drop policy if exists "Public can read news_items" on public.news_items;
create policy "Public can read news_items" on public.news_items 
  for select using (true);

-- Updated-at trigger function
create or replace function public.set_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop and recreate trigger
drop trigger if exists set_news_items_updated_at on public.news_items;
create trigger set_news_items_updated_at
  before update on public.news_items
  for each row execute function public.set_timestamp_updated_at();

-- Helpful indexes
create index if not exists idx_news_items_published_at on public.news_items (published_at desc);
create index if not exists idx_news_items_source on public.news_items (source);
-- Create the bookmarks table
create table if not exists bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  user_id uuid references auth.users not null default auth.uid()
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create Policy: Users can view their own bookmarks
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using ( auth.uid() = user_id );

-- Create Policy: Users can insert their own bookmarks
create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check ( auth.uid() = user_id );

-- Create Policy: Users can delete their own bookmarks
create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using ( auth.uid() = user_id );

-- CRITICAL: Set REPLICA IDENTITY to FULL for DELETE events to include user_id
-- This ensures that DELETE events in realtime subscriptions include all columns
-- in payload.old, allowing the user_id filter to work correctly
alter table bookmarks replica identity full;

-- Set up Realtime
alter publication supabase_realtime add table bookmarks;

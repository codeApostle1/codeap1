-- General testimonials/reviews for the homepage
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  approved boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.reviews enable row level security;

-- Anyone can view approved reviews
create policy "Anyone can view approved reviews"
  on public.reviews for select
  using (approved = true);

-- Anyone can submit a review (it starts unapproved)
create policy "Anyone can submit a review"
  on public.reviews for insert
  with check (approved = false);

-- Admin can update reviews (approve/reject)
create policy "Admin can update reviews"
  on public.reviews for update
  using (auth.uid() is not null);

-- Admin can delete reviews
create policy "Admin can delete reviews"
  on public.reviews for delete
  using (auth.uid() is not null);

-- Per-project comments
create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  message text not null,
  approved boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.project_comments enable row level security;

-- Anyone can view approved comments
create policy "Anyone can view approved comments"
  on public.project_comments for select
  using (approved = true);

-- Anyone can submit a comment (starts unapproved)
create policy "Anyone can submit a comment"
  on public.project_comments for insert
  with check (approved = false);

-- Admin can update comments (approve/reject)
create policy "Admin can update comments"
  on public.project_comments for update
  using (auth.uid() is not null);

-- Admin can delete comments
create policy "Admin can delete comments"
  on public.project_comments for delete
  using (auth.uid() is not null);

-- Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT,
  image_focus_x INTEGER DEFAULT 50,
  image_focus_y INTEGER DEFAULT 50,
  published_at DATE,
  show_published_date BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view projects (public portfolio)
CREATE POLICY "Anyone can view projects" ON public.projects
  FOR SELECT USING (true);

-- Only the admin (owner) can insert projects
CREATE POLICY "Admin can insert projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only the admin (owner) can update their projects
CREATE POLICY "Admin can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Only the admin (owner) can delete their projects
CREATE POLICY "Admin can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

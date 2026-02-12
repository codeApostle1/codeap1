-- 1. Tables Creation
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

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  comment TEXT DEFAULT '',
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES public.project_comments(id) ON DELETE CASCADE,
  is_admin_reply BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Migrations (Rename columns IF they exist with old names)
DO $$ 
BEGIN 
  -- Reviews table migrations
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='message') THEN
    ALTER TABLE public.reviews RENAME COLUMN message TO comment;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='approved') THEN
    ALTER TABLE public.reviews RENAME COLUMN approved TO is_approved;
  END IF;
  
  -- Project Comments table migrations (just in case)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='project_comments' AND column_name='message') THEN
    ALTER TABLE public.project_comments RENAME COLUMN message TO comment;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='project_comments' AND column_name='approved') THEN
    ALTER TABLE public.project_comments RENAME COLUMN approved TO is_approved;
  END IF;
END $$;


-- Projects image metadata migrations
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_focus_x INTEGER DEFAULT 50;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_focus_y INTEGER DEFAULT 50;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published_at DATE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS show_published_date BOOLEAN DEFAULT true;

-- 3. Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Idempotent)
-- Projects
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can delete own projects" ON public.projects;

CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin can insert projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Reviews
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.reviews;
DROP POLICY IF EXISTS "Admin can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin can delete reviews" ON public.reviews;

CREATE POLICY "Anyone can view approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Anyone can submit a review" ON public.reviews FOR INSERT WITH CHECK (is_approved = false);
CREATE POLICY "Admin can update reviews" ON public.reviews FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can delete reviews" ON public.reviews FOR DELETE USING (auth.uid() IS NOT NULL);

-- Project Comments
DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.project_comments;
DROP POLICY IF EXISTS "Anyone can submit a comment" ON public.project_comments;
DROP POLICY IF EXISTS "Admin can update comments" ON public.project_comments;
DROP POLICY IF EXISTS "Admin can delete comments" ON public.project_comments;
DROP POLICY IF EXISTS "Admin can view all comments" ON public.project_comments;

CREATE POLICY "Anyone can view approved comments" ON public.project_comments FOR SELECT USING (is_approved = true OR is_admin_reply = true);
CREATE POLICY "Anyone can submit a comment" ON public.project_comments FOR INSERT WITH CHECK (is_approved = false AND is_admin_reply = false);
CREATE POLICY "Admin can update comments" ON public.project_comments FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can delete comments" ON public.project_comments FOR DELETE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can view all comments" ON public.project_comments FOR SELECT USING (auth.uid() IS NOT NULL);

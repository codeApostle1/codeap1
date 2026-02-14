-- Add missing columns to projects table if they don't exist
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_focus_x INTEGER DEFAULT 50;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_focus_y INTEGER DEFAULT 50;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published_at DATE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS show_published_date BOOLEAN DEFAULT true;

-- Notify PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

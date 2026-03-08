-- Add user_id to project_comments to allow users to delete their own comments
ALTER TABLE public.project_comments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update RLS for project_comments to allow users to delete their own comments
DROP POLICY IF EXISTS "Users can delete own comments" ON public.project_comments;
CREATE POLICY "Users can delete own comments" ON public.project_comments FOR DELETE USING (auth.uid() = user_id);

-- Notify PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

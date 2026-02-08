import { createClient } from "@/lib/supabase/server"
import { ProjectsView } from "@/components/projects-view"

export const metadata = {
  title: "Projects | Portfolio",
  description: "Browse all my projects and see them in action.",
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: comments } = await supabase
    .from("project_comments")
    .select("*")
    .order("created_at", { ascending: true })

  return <ProjectsView projects={projects ?? []} comments={comments ?? []} />
}

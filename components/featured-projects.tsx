import Link from "next/link"
import { ArrowRight, ExternalLink, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

interface Project {
  id: string
  title: string
  description: string
  url: string
  created_at: string
  image_url?: string | null
  image_focus_x?: number | null
  image_focus_y?: number | null
  published_at?: string | null
  show_published_date?: boolean | null
}

export async function FeaturedProjects() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4)

  const { data: comments } = await supabase.from("project_comments").select("id, project_id")

  const projectsList: Project[] = projects ?? []
  const commentsList = comments ?? []

  return (
    <section id="projects" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="mb-2 font-mono text-sm text-primary">{"// featured work"}</p>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Recent Projects
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {projectsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-20">
            <p className="text-muted-foreground">No projects yet.</p>
            <p className="mt-1 text-sm text-muted-foreground/60">Projects added via admin will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {projectsList.map((project, i) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-xl border border-border/70 bg-card/60 transition-all hover:border-primary/30 hover:bg-card"
              >
                {project.image_url && (
                  <div className="pointer-events-none absolute inset-0">
                    <img
                      src={project.image_url}
                      alt=""
                      className="h-full w-full object-cover opacity-35 transition-opacity duration-300 group-hover:opacity-45"
                      style={{
                        objectPosition: `${project.image_focus_x ?? 50}% ${project.image_focus_y ?? 50}%`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
                  </div>
                )}

                <div className="absolute right-4 top-4 font-mono text-6xl font-bold leading-none text-foreground/[0.06]">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="relative p-6">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-primary"
                      aria-label={`Visit ${project.title}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

                  {project.show_published_date && project.published_at && (
                    <p className="mb-3 text-xs font-medium text-foreground/80">
                      Published on {new Date(project.published_at).toLocaleDateString()}
                    </p>
                  )}

                  <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{commentsList.filter((c) => c.project_id === project.id).length} comments</span>
                  </div>

                  <Link
                    href={`/projects?id=${project.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    View Project
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

interface Project {
  id: string
  title: string
  description: string
  url: string
  created_at: string
}

export async function FeaturedProjects() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4)

  const projectsList: Project[] = projects ?? []

  return (
    <section id="projects" className="px-6 py-24 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="mb-2 font-mono text-sm text-primary">
              {"// featured work"}
            </p>
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
            <p className="mt-1 text-sm text-muted-foreground/60">
              Projects added via admin will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {projectsList.map((project, i) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card"
              >
                {/* Project number accent */}
                <div className="absolute right-4 top-4 font-mono text-6xl font-bold leading-none text-foreground/[0.03]">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="relative p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      {project.title}
                    </h3>
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

                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

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

"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  ExternalLink,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { CommentsSection } from "@/components/comments-section"

interface Comment {
  id: string
  project_id: string
  name: string
  comment: string
  created_at: string
  parent_id: string | null
  is_admin_reply: boolean
}

interface Project {
  id: string
  title: string
  description: string
  url: string
  created_at: string
}

export function ProjectsView({
  projects,
  comments,
}: {
  projects: Project[]
  comments: Comment[]
}) {
  const searchParams = useSearchParams()
  const preselectedId = searchParams.get("id")

  const initialProject = useMemo(() => {
    if (preselectedId) {
      const found = projects.find((project) => project.id === preselectedId)
      if (found) return found
    }

    return projects[0] ?? null
  }, [preselectedId, projects])

  const [selectedProject, setSelectedProject] = useState<Project | null>(initialProject)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const selectProject = (project: Project) => {
    setSelectedProject(project)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between border-b border-border/70 bg-background/85 px-3 py-2.5 backdrop-blur-xl sm:px-4 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="hidden h-5 w-px bg-border sm:block" />
          <h1 className="hidden font-mono text-sm font-medium text-foreground sm:block">
            {"<"}
            <span className="text-primary">projects</span>
            {"/>"}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {selectedProject && (
            <>
              <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-xs sm:text-sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open
                </Button>
              </a>
              <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="sm:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </a>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 z-20 bg-black/40 md:hidden"
            aria-label="Close project list"
          />
        )}

        <aside
          className={cn(
            "absolute inset-y-0 left-0 z-30 w-[85vw] max-w-xs border-r border-border/70 bg-card/95 shadow-xl backdrop-blur transition-transform duration-300 md:static md:w-72 md:max-w-none md:bg-card/35 md:shadow-none",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-border/60 px-4 py-3">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                All Projects ({projects.length})
              </p>
            </div>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-1 p-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => selectProject(project)}
                    className={cn(
                      "group flex w-full flex-col items-start rounded-lg px-3 py-2.5 text-left transition-colors",
                      selectedProject?.id === project.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <span className="text-sm font-medium leading-tight">{project.title}</span>
                    <span className="mt-0.5 line-clamp-2 text-xs opacity-60">{project.description}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden md:min-w-0">
          {selectedProject ? (
            <div className="flex h-full flex-col">
              <div className="flex flex-wrap items-center gap-2 border-b border-border/60 bg-card/25 px-3 py-2 sm:px-4">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10">
                  <FolderOpen className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{selectedProject.title}</p>
                <span className="max-w-full truncate rounded-md bg-secondary/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground sm:text-xs">
                  {selectedProject.url}
                </span>
              </div>

              <ScrollArea className="flex-1">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-3 sm:gap-6 sm:p-6">
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/70 bg-background shadow-2xl">
                    <iframe
                      src={selectedProject.url}
                      title={selectedProject.title}
                      className="h-full w-full border-0"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-xl font-bold text-foreground sm:text-3xl">{selectedProject.title}</h2>
                      <Button asChild className="w-full sm:w-auto">
                        <a href={selectedProject.url} target="_blank" rel="noopener noreferrer">
                          Visit Live Site
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-lg">
                      {selectedProject.description}
                    </p>
                  </div>

                  <CommentsSection
                    projectId={selectedProject.id}
                    initialComments={comments.filter((comment) => comment.project_id === selectedProject.id)}
                  />
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-card/50">
                <FolderOpen className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">No projects yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Add your first project from the admin dashboard.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

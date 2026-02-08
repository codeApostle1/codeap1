"use client"

import { useState, useEffect } from "react"
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

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (preselectedId && projects.length > 0) {
      const found = projects.find((p) => p.id === preselectedId)
      if (found) setSelectedProject(found)
    }
  }, [preselectedId, projects])

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
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
        <div className="flex items-center gap-2">
          {selectedProject && (
            <>
              <a
                href={selectedProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Open in new tab</span>
              </a>
              <a
                href={selectedProject.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </a>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "shrink-0 border-r border-border/50 bg-card/30 transition-all duration-300",
            sidebarOpen ? "w-72" : "w-0"
          )}
        >
          {sidebarOpen && (
            <div className="flex h-full flex-col">
              <div className="border-b border-border/30 px-4 py-3">
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  All Projects ({projects.length})
                </p>
              </div>
              <ScrollArea className="flex-1">
                <div className="flex flex-col gap-1 p-2">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={cn(
                        "group flex w-full flex-col items-start rounded-lg px-3 py-2.5 text-left transition-colors",
                        selectedProject?.id === project.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <span className="text-sm font-medium leading-tight">
                        {project.title}
                      </span>
                      <span className="mt-0.5 line-clamp-1 text-xs opacity-60">
                        {project.description}
                      </span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </aside>

        {/* Main iframe area */}
        <main className="flex-1 overflow-hidden">
          {selectedProject ? (
            <div className="flex h-full flex-col">
              {/* Project info bar */}
              <div className="flex items-center gap-3 border-b border-border/30 bg-card/20 px-4 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10">
                  <FolderOpen className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {selectedProject.title}
                  </p>
                </div>
                <span className="shrink-0 truncate rounded-md bg-secondary/50 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  {selectedProject.url}
                </span>
              </div>

              {/* Main Content (Iframe + Comments) */}
              <ScrollArea className="flex-1">
                <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
                  {/* Iframe Preview */}
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-background shadow-2xl">
                    <iframe
                      src={selectedProject.url}
                      title={selectedProject.title}
                      className="h-full w-full border-0"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  </div>

                  {/* Description & Links */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold text-foreground">
                        {selectedProject.title}
                      </h2>
                      <Button asChild>
                        <a
                          href={selectedProject.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Live Site
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Comments Section */}
                  <CommentsSection
                    projectId={selectedProject.id}
                    initialComments={comments.filter(
                      (c) => c.project_id === selectedProject.id
                    )}
                  />
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-card/50">
                <FolderOpen className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  Select a project
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose a project from the sidebar to preview it here.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

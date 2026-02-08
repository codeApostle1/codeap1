"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  LogOut,
  FolderOpen,
  Home,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addProject, deleteProject, updateProject } from "@/app/admin/actions"
import { createClient } from "@/lib/supabase/client"

interface Project {
  id: string
  title: string
  description: string
  url: string
  created_at: string
}

export function AdminDashboard({
  projects,
  userEmail,
}: {
  projects: Project[]
  userEmail: string
}) {
  const router = useRouter()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    const result = await addProject(formData)
    if (result.error) {
      setError(result.error)
    } else {
      setShowAddForm(false)
    }
    setIsSubmitting(false)
    router.refresh()
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingProject) return
    setIsSubmitting(true)
    setError(null)
    const result = await updateProject(editingProject.id, formData)
    if (result.error) {
      setError(result.error)
    } else {
      setEditingProject(null)
    }
    setIsSubmitting(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    const result = await deleteProject(id)
    if (result.error) {
      setError(result.error)
    }
    router.refresh()
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-lg font-bold text-foreground"
            >
              {"<"}
              <span className="text-primary">admin</span>
              {"/>"}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {userEmail}
            </span>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <Home className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Portfolio</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Title + Add button */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the projects displayed on your portfolio.
            </p>
          </div>
          <Button onClick={() => { setShowAddForm(true); setEditingProject(null) }}>
            <Plus className="mr-1 h-4 w-4" />
            Add Project
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Add / Edit form */}
        {(showAddForm || editingProject) && (
          <div className="mb-8 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {editingProject ? "Edit Project" : "New Project"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingProject(null)
                  setError(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form action={editingProject ? handleUpdate : handleAdd}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="My Awesome Project"
                    required
                    defaultValue={editingProject?.title ?? ""}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="A brief description of the project..."
                    required
                    rows={3}
                    defaultValue={editingProject?.description ?? ""}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="url">Project URL</Label>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    placeholder="https://my-project.vercel.app"
                    required
                    defaultValue={editingProject?.url ?? ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    The live URL where the project is running. It will be
                    displayed in an iframe on the portfolio.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Saving..."
                      : editingProject
                        ? "Update Project"
                        : "Add Project"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingProject(null)
                      setError(null)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Projects list */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-20">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 bg-card/50">
              <FolderOpen className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-foreground">No projects yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click &quot;Add Project&quot; to get started.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-colors hover:border-border"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FolderOpen className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {project.description}
                  </p>
                </div>

                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden shrink-0 text-muted-foreground transition-colors hover:text-primary sm:block"
                  aria-label={`Visit ${project.title}`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setEditingProject(project)
                      setShowAddForm(false)
                      setError(null)
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit {project.title}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete {project.title}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

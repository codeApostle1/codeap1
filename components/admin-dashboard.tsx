"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Plus,
  Trash2,
  Pencil,
  LogOut,
  Home,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  addProject,
  deleteProject,
  updateProject,
  deleteComment,
  replyToComment,
  approveComment,
} from "@/app/admin/actions"

import { createClient } from "@/lib/supabase/client"

/* =======================
   TYPES
======================= */

interface Project {
  id: string
  title: string
  description: string
  url: string
  created_at: string
}

interface Comment {
  id: string
  project_id: string
  name: string
  comment: string
  created_at: string
  parent_id: string | null
  is_admin_reply: boolean
  is_approved: boolean
}

/* =======================
   COMPONENT
======================= */

export function AdminDashboard({
  projects,
  comments,
  userEmail,
}: {
  projects: Project[]
  comments: Comment[]
  userEmail: string
}) {
  const router = useRouter()

  /* ---------- UI STATE ---------- */
  const [activeTab, setActiveTab] = useState<"projects" | "comments">("projects")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  /* ---------- ACTION HANDLERS ---------- */

  const handleAdd = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)

    const result = await addProject(formData)

    if (result?.error) {
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

    if (result?.error) {
      setError(result.error)
    } else {
      setEditingProject(null)
    }

    setIsSubmitting(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    const result = await deleteProject(id)
    if (result?.error) setError(result.error)
    router.refresh()
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="min-h-screen bg-background">
      {/* ================= HEADER ================= */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-mono text-lg font-bold">
            {"<"}
            <span className="text-primary">admin</span>
            {"/>"}
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {userEmail}
            </span>

            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <Home className="mr-1 h-4 w-4" />
                Portfolio
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-border/50">
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "projects"
                ? "border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            Projects
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "comments"
                ? "border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            Comments
          </button>
        </div>

        {/* ================= PROJECTS TAB ================= */}
        {activeTab === "projects" && (
          <>
            <div className="mb-8 flex justify-between">
              <div>
                <h1 className="text-2xl font-bold">Projects</h1>
                <p className="text-sm text-muted-foreground">
                  Manage portfolio projects
                </p>
              </div>

              <Button
                onClick={() => {
                  setShowAddForm(true)
                  setEditingProject(null)
                }}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Project
              </Button>
            </div>

            {error && (
              <div className="mb-6 rounded bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* ADD / EDIT FORM */}
            {(showAddForm || editingProject) && (
              <form
                action={editingProject ? handleUpdate : handleAdd}
                className="mb-8 rounded-xl border p-6"
              >
                <div className="grid gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input name="title" defaultValue={editingProject?.title} />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      name="description"
                      defaultValue={editingProject?.description}
                    />
                  </div>

                  <div>
                    <Label>URL</Label>
                    <Input
                      name="url"
                      type="url"
                      defaultValue={editingProject?.url}
                    />
                  </div>

                  <Button disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            )}

            {/* PROJECT LIST */}
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between rounded border p-4"
                >
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingProject(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= COMMENTS TAB ================= */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Comments</h1>
              <p className="text-sm text-muted-foreground">
                Manage and reply to project comments
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="py-10 text-center text-muted-foreground">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`rounded-xl border p-5 ${
                      !comment.is_approved ? "border-primary/30 bg-primary/5" : "bg-card/50"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{comment.name}</span>
                        {comment.is_admin_reply && (
                          <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                            ADMIN
                          </span>
                        )}
                        {!comment.is_approved && !comment.is_admin_reply && (
                          <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-bold text-yellow-500">
                            PENDING
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          on {projects.find((p) => p.id === comment.project_id)?.title || "Unknown Project"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="mb-4 text-sm text-muted-foreground">{comment.comment}</p>

                    <div className="flex items-center gap-2">
                      {!comment.is_approved && !comment.is_admin_reply && (
                        <Button
                          size="sm"
                          onClick={async () => {
                            const res = await approveComment(comment.id)
                            if (res.error) setError(res.error)
                            router.refresh()
                          }}
                        >
                          Approve
                        </Button>
                      )}

                      {!comment.is_admin_reply && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        >
                          Reply
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={async () => {
                          const res = await deleteComment(comment.id)
                          if (res.error) setError(res.error)
                          router.refresh()
                        }}
                      >
                        Delete
                      </Button>
                    </div>

                    {replyingTo === comment.id && (
                      <form
                        className="mt-4 space-y-3"
                        onSubmit={async (e) => {
                          e.preventDefault()
                          const fd = new FormData(e.currentTarget)
                          const content = fd.get("reply") as string
                          if (!content) return

                          setIsSubmitting(true)
                          const res = await replyToComment(comment.id, comment.project_id, content)
                          if (res.error) {
                            setError(res.error)
                          } else {
                            setReplyingTo(null)
                          }
                          setIsSubmitting(false)
                          router.refresh()
                        }}
                      >
                        <Textarea
                          name="reply"
                          placeholder="Write your admin reply..."
                          required
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Reply"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            type="button"
                            onClick={() => setReplyingTo(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

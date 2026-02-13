"use client"

import { useEffect, useMemo, useState } from "react"
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
  approveComment,
  deleteComment,
  deleteProject,
  replyToComment,
  updateProject,
} from "@/app/admin/actions"
import { createClient } from "@/lib/supabase/client"

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

  const [activeTab, setActiveTab] = useState<"projects" | "comments">("projects")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFocusX, setImageFocusX] = useState(50)
  const [imageFocusY, setImageFocusY] = useState(50)
  const [publishedAt, setPublishedAt] = useState("")
  const [showPublishedDate, setShowPublishedDate] = useState(true)

 df  useEffect(() => {
    const focusX = Math.round(editingProject?.image_focus_x ?? 50)
    const focusY = Math.round(editingProject?.image_focus_y ?? 50)
    setImageFocusX(focusX)
    setImageFocusY(focusY)
    setImagePreview(editingProject?.image_url ?? null)
    setPublishedAt(editingProject?.published_at ?? "")
    setShowPublishedDate(editingProject?.show_published_date ?? true)
  }, [editingProject])

  const activeImageUrl = useMemo(
    () => imagePreview ?? editingProject?.image_url ?? null,
    [imagePreview, editingProject?.image_url]
  )

  const handleImageSelect = (file?: File | null) => {
    if (!file) {
      setImagePreview(editingProject?.image_url ?? null)
      return
    }

    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  const resetFormState = () => {
    setShowAddForm(false)
    setEditingProject(null)
    setImagePreview(null)
    setImageFocusX(50)
    setImageFocusY(50)
    setPublishedAt("")
    setShowPublishedDate(true)
    setError(null)
  }

  const handleAdd = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)

    const result = await addProject(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      resetFormState()
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
      resetFormState()
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-mono text-lg font-bold">
            {"<"}
            <span className="text-primary">admin</span>
            {"/>"}
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">{userEmail}</span>

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

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex gap-4 border-b border-border/50">
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "projects" ? "border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Projects
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "comments" ? "border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Comments
          </button>
        </div>

        {activeTab === "projects" && (
          <>
            <div className="mb-8 flex justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Projects</h1>
                <p className="text-sm text-muted-foreground">Manage portfolio projects</p>
              </div>

              <Button
                onClick={() => {
                  setShowAddForm(true)
                  setEditingProject(null)
                  setImagePreview(null)
                  setPublishedAt("")
                  setShowPublishedDate(true)
                }}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Project
              </Button>
            </div>

            {error && <div className="mb-6 rounded bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            {(showAddForm || editingProject) && (
              <form action={editingProject ? handleUpdate : handleAdd} className="mb-8 rounded-xl border p-6">
                <input type="hidden" name="image_focus_x" value={imageFocusX} />
                <input type="hidden" name="image_focus_y" value={imageFocusY} />
                <input type="hidden" name="existing_image_url" value={editingProject?.image_url ?? ""} />

                <div className="grid gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input name="title" defaultValue={editingProject?.title} />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea name="description" defaultValue={editingProject?.description} />
                  </div>

                  <div>
                    <Label>URL</Label>
                    <Input name="url" type="url" defaultValue={editingProject?.url} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Published Date</Label>
                      <Input
                        name="published_at"
                        type="date"
                        value={publishedAt}
                        onChange={(event) => setPublishedAt(event.target.value)}
                      />
                    </div>
                    <label className="mt-7 flex items-center gap-2 text-sm text-foreground">
                      <input
                        name="show_published_date"
                        type="checkbox"
                        checked={showPublishedDate}
                        onChange={(event) => setShowPublishedDate(event.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      Show published date on homepage cards
                    </label>
                  </div>

                  <div>
                    <Label>Project Image (optional)</Label>
                    <Input
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageSelect(event.target.files?.[0] ?? null)}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Upload a cover image and adjust crop focus.</p>
                  </div>

                  {activeImageUrl && (
                    <div className="rounded-xl border border-border/70 bg-card/50 p-4">
                      <div className="mb-3 aspect-[16/9] overflow-hidden rounded-lg border border-border/70">
                        <img
                          src={activeImageUrl}
                          alt="Project preview"
                          className="h-full w-full object-cover"
                          style={{ objectPosition: `${imageFocusX}% ${imageFocusY}%` }}
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label>Crop focus X ({imageFocusX}%)</Label>
                          <Input
                            type="range"
                            min={0}
                            max={100}
                            value={imageFocusX}
                            onChange={(event) => setImageFocusX(Number(event.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Crop focus Y ({imageFocusY}%)</Label>
                          <Input
                            type="range"
                            min={0}
                            max={100}
                            value={imageFocusY}
                            onChange={(event) => setImageFocusY(Number(event.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <Button disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
                    <Button type="button" variant="ghost" onClick={resetFormState}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between rounded border p-4">
                  <div className="min-w-0 flex items-center gap-3">
                    {project.image_url && (
                      <div className="h-12 w-16 overflow-hidden rounded border border-border/60">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="h-full w-full object-cover"
                          style={{
                            objectPosition: `${project.image_focus_x ?? 50}% ${project.image_focus_y ?? 50}%`,
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{project.description}</p>
                      {project.published_at && (
                        <p className="text-[11px] text-muted-foreground">
                          Published: {project.published_at}
                          {project.show_published_date ? " (visible)" : " (hidden)"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingProject(project)
                        setShowAddForm(false)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button size="icon" variant="ghost" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "comments" && (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Comments</h1>
              <p className="text-sm text-muted-foreground">Manage and reply to project comments</p>
            </div>

            {error && <div className="mb-6 rounded bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

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
                        <Textarea name="reply" placeholder="Write your admin reply..." required className="text-sm" />
                        <div className="flex gap-2">
                          <Button size="sm" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Reply"}
                          </Button>
                          <Button size="sm" variant="ghost" type="button" onClick={() => setReplyingTo(null)}>
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

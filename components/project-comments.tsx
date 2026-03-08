"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Send, User, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addComment, deleteClientComment } from "@/app/actions/comments"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Comment {
  id: string
  name: string
  comment: string
  created_at: string
  user_id: string | null
  parent_id: string | null
  is_admin_reply: boolean
}

export function ProjectComments({ projectId }: { projectId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isAnonymousMode, setIsAnonymousMode] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [authName, setAuthName] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthing, setIsAuthing] = useState(false)

  // Fetch user session on mount
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      // Admin users have email, commenter dummy users have generic email trick
      if (user && user.user_metadata?.name) {
        setCurrentUser({ id: user.id, name: user.user_metadata.name })
      } else if (user && user.email) {
        // Fallback for admins or specific users
        setCurrentUser({ id: user.id, name: user.email.split("@")[0] })
      }
    })
  }, [])

  const fetchComments = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from("project_comments")
      .select("id, name, comment, created_at, user_id, parent_id, is_admin_reply")
      .eq("project_id", projectId)
      .or("is_approved.eq.true,is_admin_reply.eq.true")
      .order("created_at", { ascending: true })

    setComments(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchComments()
  }, [projectId])

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [submitted])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthing(true)
    setError(null)
    const supabase = createClient()
    const safeName = authName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()

    if (!safeName) {
      setError("Name must contain letters or numbers.")
      setIsAuthing(false)
      return
    }

    const email = `${safeName}@commenter.project`

    try {
      if (authMode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password: authPassword,
          options: { data: { name: authName } },
        })
        if (signUpError) throw signUpError
        if (data.user) {
          setCurrentUser({ id: data.user.id, name: authName })
          setShowAuthDialog(false)
          setShowForm(true)
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: authPassword,
        })
        if (signInError) throw signInError
        if (data.user) {
          setCurrentUser({ id: data.user.id, name: data.user.user_metadata?.name || authName })
          setShowAuthDialog(false)
          setShowForm(true)
        }
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Authentication failed.")
    } finally {
      setIsAuthing(false)
    }
  }

  const handleAddClick = () => {
    if (currentUser || isAnonymousMode) {
      setShowForm(true)
    } else {
      setShowAuthDialog(true)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    formData.append("project_id", projectId)

    // Automatically use logged in name if not anonymous
    if (currentUser && !isAnonymousMode) {
      formData.set("name", currentUser.name)
    }

    const result = await addComment(formData)
    if (result.error) {
      setError(result.error)
    } else {
      setSubmitted(true)
      setShowForm(false)
      // fetch again to show if approved instantly, or keep user informed it's pending
      fetchComments()
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return
    const result = await deleteClientComment(id)
    if (result.error) {
      alert("Error deleting comment: " + result.error)
    } else {
      setComments(comments.filter((c) => c.id !== id && c.parent_id !== id))
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  // structure comments into tree
  const parentComments = comments.filter((c) => !c.parent_id)
  const replies = comments.filter((c) => c.parent_id)

  return (
    <div className="border-t border-border/30 bg-card/20 px-4 py-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageSquare className="h-4 w-4 text-primary" />
            Comments ({comments.length})
          </h3>
          {!showForm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddClick}
              className="h-7 gap-1.5 text-xs"
            >
              <Send className="h-3 w-3" />
              Add Comment
            </Button>
          )}
        </div>

        {submitted && (
          <div className="mb-3 rounded-lg bg-primary/10 px-4 py-2 text-xs text-primary">
            Thanks! Your comment will appear after approval.
          </div>
        )}
        {error && !showAuthDialog && (
          <div className="mb-3 rounded-lg bg-destructive/10 px-4 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Comment form */}
        {showForm && (
          <div className="mb-4 rounded-lg border border-border/40 bg-card/50 p-4 shadow-sm">
            <form action={handleSubmit} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">
                  Posting as: {currentUser && !isAnonymousMode ? currentUser.name : "Anonymous"}
                </span>
                {currentUser && !isAnonymousMode && (
                  <Button type="button" variant="ghost" className="h-6 text-[10px]" onClick={async () => {
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    setCurrentUser(null)
                    setIsAnonymousMode(false)
                  }}>Sign Out</Button>
                )}
              </div>

              {(!currentUser || isAnonymousMode) && (
                <Input
                  name="name"
                  placeholder="Your name"
                  required
                  maxLength={100}
                  className="h-8 text-sm"
                />
              )}
              <Textarea
                name="comment"
                placeholder="Leave a comment on this project..."
                required
                maxLength={1000}
                rows={3}
                className="text-sm"
              />
              <div className="flex items-center gap-2 mt-1">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-7 gap-1.5 text-xs w-full sm:w-auto"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs w-full sm:w-auto"
                  onClick={() => {
                    setShowForm(false)
                    setError(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Comments list */}
        {loading ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            Loading comments...
          </p>
        ) : parentComments.length > 0 ? (
          <div className="flex flex-col gap-4 mt-4">
            {parentComments.map((c) => (
              <div key={c.id} className="flex flex-col gap-2">
                <div className="flex gap-3 rounded-lg border border-border/30 bg-background/50 p-3 shadow-sm">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold text-foreground">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(c.created_at)}
                        </span>
                      </div>
                      {currentUser && currentUser.id === c.user_id && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(c.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {c.comment}
                    </p>
                  </div>
                </div>

                {/* Render Replies */}
                {replies.filter(r => r.parent_id === c.id).map(reply => (
                  <div key={reply.id} className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 ml-6 sm:ml-10">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <User className="h-3 w-3" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-primary">
                            {reply.name} (Admin)
                          </span>
                          <span className="text-[10px] text-primary/70">
                            {formatDate(reply.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-foreground">
                        {reply.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No comments yet. Be the first!
          </p>
        )}
      </div>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Sign in to Comment</DialogTitle>
            <DialogDescription>
              Create a quick profile to delete comments later, or post anonymously.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && showAuthDialog && (
              <div className="rounded-lg bg-destructive/10 px-4 py-2 text-xs text-destructive">
                {error}
              </div>
            )}
            <form onSubmit={handleAuth} className="flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. John"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Secret password"
                />
              </div>
              <Button type="submit" disabled={isAuthing} className="w-full mt-2">
                {isAuthing ? "Processing..." : (authMode === 'login' ? 'Login' : 'Sign Up')}
              </Button>
            </form>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 border-t pt-4">
              <button onClick={() => setAuthMode(old => old === 'login' ? 'signup' : 'login')} className="hover:text-primary transition-colors hover:underline">
                {authMode === 'login' ? "Need an account? Sign up" : "Already have an account? Login"}
              </button>
              <button onClick={() => {
                setIsAnonymousMode(true)
                setShowAuthDialog(false)
                setShowForm(true)
              }} className="hover:text-primary transition-colors hover:underline">
                Post Anonymously
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

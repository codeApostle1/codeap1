"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitProjectComment } from "@/app/actions/reviews"
import { createClient } from "@/lib/supabase/client"

interface Comment {
  id: string
  name: string
  comment: string
  created_at: string
}

export function ProjectComments({ projectId }: { projectId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchComments() {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from("project_comments")
        .select("id, name, comment, created_at")
        .eq("project_id", projectId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })

      setComments(data ?? [])
      setLoading(false)
    }
    fetchComments()
  }, [projectId])

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [submitted])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    formData.append("project_id", projectId)
    const result = await submitProjectComment(formData)
    if (result.error) {
      setError(result.error)
    } else {
      setSubmitted(true)
      setShowForm(false)
    }
    setIsSubmitting(false)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

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
              onClick={() => setShowForm(true)}
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
        {error && (
          <div className="mb-3 rounded-lg bg-destructive/10 px-4 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Comment form */}
        {showForm && (
          <div className="mb-4 rounded-lg border border-border/40 bg-card/50 p-4">
            <form action={handleSubmit} className="flex flex-col gap-3">
              <Input
                name="name"
                placeholder="Your name"
                required
                maxLength={100}
                className="h-8 text-sm"
              />
              <Textarea
                name="comment"
                placeholder="Leave a comment on this project..."
                required
                maxLength={1000}
                rows={3}
                className="text-sm"
              />
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-7 gap-1.5 text-xs"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
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
        ) : comments.length > 0 ? (
          <div className="flex flex-col gap-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="flex gap-3 rounded-lg border border-border/30 bg-background/50 p-3"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-medium text-foreground">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {c.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No comments yet. Be the first!
          </p>
        )}
      </div>
    </div>
  )
}

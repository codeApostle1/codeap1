"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Send, User, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitReview } from "@/app/actions/reviews"

interface Review {
  id: string
  name: string
  comment: string
  created_at: string
}

export function TestimonialsSection({ reviews }: { reviews: Review[] }) {
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [submitted])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    const result = await submitReview(formData)
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
    <section id="testimonials" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-2 font-mono text-sm text-primary">
            {"// what people say"}
          </p>
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Testimonials
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Feedback from people who have worked with me or used my projects.
          </p>
        </div>

        {/* Approved reviews grid */}
        {reviews.length > 0 ? (
          <div className="mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="relative flex flex-col rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
              >
                <Quote className="mb-3 h-5 w-5 text-primary/40" />
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-border/30 pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {review.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/20 py-12">
            <MessageSquare className="mb-3 h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No reviews yet. Be the first to leave one!
            </p>
          </div>
        )}

        {/* Submit review */}
        <div className="flex flex-col items-center">
          {submitted && (
            <div className="mb-4 rounded-lg bg-primary/10 px-6 py-3 text-center text-sm text-primary">
              Thank you for your review! It will appear here once approved.
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-6 py-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}

          {!showForm ? (
            <Button
              variant="outline"
              onClick={() => setShowForm(true)}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Leave a Review
            </Button>
          ) : (
            <div className="w-full max-w-lg rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Leave a Review
              </h3>
              <form action={handleSubmit} className="flex flex-col gap-4">
                <Input
                  name="name"
                  placeholder="Your name"
                  required
                  maxLength={100}
                />
                <Textarea
                  name="comment"
                  placeholder="Share your thoughts about my work..."
                  required
                  maxLength={1000}
                  rows={4}
                />
                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    <Send className="h-3.5 w-3.5" />
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowForm(false)
                      setError(null)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your review will be visible after approval.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

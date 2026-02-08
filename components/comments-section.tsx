"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Send, User, ChevronDown, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addComment } from "@/app/actions/comments"
import { cn } from "@/lib/utils"

interface Comment {
    id: string
    project_id: string
    name: string
    comment: string
    created_at: string
    parent_id: string | null
    is_admin_reply: boolean
}

interface CommentsSectionProps {
    projectId: string
    initialComments: Comment[]
}

export function CommentsSection({ projectId, initialComments }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [replyTo, setReplyTo] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Sort comments: top-level first, then replies under them
    const topLevelComments = comments.filter((c) => !c.parent_id)
    const getReplies = (parentId: string) => comments.filter((c) => c.parent_id === parentId)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        setSuccess(false)

        const formData = new FormData(e.currentTarget)
        formData.append("project_id", projectId)
        if (replyTo) {
            formData.append("parent_id", replyTo)
        }

        const result = await addComment(formData)

        if (result.error) {
            setError(result.error)
        } else {
            setSuccess(true)
            setReplyTo(null)
                ; (e.target as HTMLFormElement).reset()
            // Note: In a real app, we might wait for revalidation or optimistic update
            // For now, we show the success message and rely on revalidation on page refresh
            // or we could refetch if we had a client-side fetcher
        }
        setIsSubmitting(false)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="mt-8 space-y-8 border-t border-border/50 pt-8">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Comments ({comments.length})
                </h3>
            </div>

            {/* Main Comment Form */}
            {!replyTo && (
                <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border/50 bg-card/50 p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            name="name"
                            placeholder="Your Name"
                            required
                            className="bg-background/50"
                            maxLength={100}
                        />
                    </div>
                    <Textarea
                        name="comment"
                        placeholder="What's on your mind?..."
                        required
                        className="min-h-[100px] bg-background/50"
                        maxLength={1000}
                    />
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            Comments are moderated before appearing.
                        </p>
                        <Button type="submit" disabled={isSubmitting} size="sm" className="gap-2">
                            {isSubmitting ? "Posting..." : "Post Comment"}
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    {success && (
                        <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
                            <CheckCircle2 className="h-4 w-4" />
                            Your comment has been submitted for approval.
                        </div>
                    )}
                    {error && (
                        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}
                </form>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {topLevelComments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <MessageSquare className="mb-4 h-12 w-12 opacity-20" />
                        <p>No comments yet. Be the first to start the conversation!</p>
                    </div>
                ) : (
                    topLevelComments.map((comment) => (
                        <div key={comment.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <CommentItem
                                comment={comment}
                                replies={getReplies(comment.id)}
                                onReply={(id) => setReplyTo(id)}
                                isReplyFormActive={replyTo === comment.id}
                                formatDate={formatDate}
                                handleSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                success={success}
                                error={error}
                                onCancelReply={() => setReplyTo(null)}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

function CommentItem({
    comment,
    replies,
    onReply,
    isReplyFormActive,
    formatDate,
    handleSubmit,
    isSubmitting,
    success,
    error,
    onCancelReply,
}: {
    comment: Comment
    replies: Comment[]
    onReply: (id: string) => void
    isReplyFormActive: boolean
    formatDate: (date: string) => string
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isSubmitting: boolean
    success: boolean
    error: string | null
    onCancelReply: () => void
}) {
    return (
        <div className="space-y-4">
            <div
                className={cn(
                    "relative flex gap-4 rounded-xl border p-5 transition-colors",
                    comment.is_admin_reply
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/50 bg-card/30 hover:bg-card/50"
                )}
            >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-secondary-foreground shadow-sm">
                    <User className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{comment.name}</span>
                            {comment.is_admin_reply && (
                                <span className="rounded-full bg-primary/20 px-2.25 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary ring-1 ring-inset ring-primary/30">
                                    Admin
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{comment.comment}</p>
                    <div className="pt-2">
                        <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs font-semibold text-primary hover:no-underline"
                            onClick={() => onReply(comment.id)}
                        >
                            Reply
                        </Button>
                    </div>
                </div>
            </div>

            {/* Reply Form */}
            {isReplyFormActive && (
                <form
                    onSubmit={handleSubmit}
                    className="ml-14 space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4 animate-in zoom-in-95 duration-200"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-primary uppercase tracking-wider flex items-center gap-1.5">
                            <ChevronDown className="h-3 w-3" />
                            Reply to {comment.name}
                        </span>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={onCancelReply}>
                            Cancel
                        </Button>
                    </div>
                    <Input
                        name="name"
                        placeholder="Your Name"
                        required
                        className="h-8 bg-background/50 text-xs"
                        maxLength={100}
                    />
                    <Textarea
                        name="comment"
                        placeholder="Write your reply..."
                        required
                        className="min-h-[80px] bg-background/50 text-sm"
                        maxLength={1000}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting} size="sm" className="h-8 gap-2 text-xs">
                            {isSubmitting ? "Posting..." : "Post Reply"}
                            <Send className="h-3 w-3" />
                        </Button>
                    </div>
                    {success && (
                        <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-2 text-[10px] text-primary">
                            <CheckCircle2 className="h-3 w-3" />
                            Reply submitted for approval.
                        </div>
                    )}
                    {error && (
                        <div className="rounded-lg bg-destructive/10 p-2 text-[10px] text-destructive">
                            {error}
                        </div>
                    )}
                </form>
            )}

            {/* Nested Replies */}
            {replies.length > 0 && (
                <div className="ml-14 space-y-4 border-l-2 border-border/20 pl-4">
                    {replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            replies={[]} // Assume single level nesting for now as per schema or common UI
                            onReply={onReply}
                            isReplyFormActive={replyTo === reply.id} // This would need adjustment for deeper nesting
                            formatDate={formatDate}
                            handleSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            success={success}
                            error={error}
                            onCancelReply={onCancelReply}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addComment(formData: FormData): Promise<{ error?: string; success?: boolean }> {
    const supabase = await createClient()

    const name = (formData.get("name") as string)?.trim()
    const comment = (formData.get("comment") as string)?.trim()
    const projectId = formData.get("project_id") as string
    const parentId = (formData.get("parent_id") as string) || null

    if (!name || !comment || !projectId) {
        return { error: "Name, comment, and project are required" }
    }

    if (name.length > 100) {
        return { error: "Name is too long" }
    }

    if (comment.length > 1000) {
        return { error: "Comment must be under 1000 characters" }
    }

    const { error } = await supabase.from("project_comments").insert({
        name,
        comment,
        project_id: projectId,
        parent_id: parentId,
        is_approved: false,
    })

    if (error) {
        console.error("Error adding comment:", error)
        return { error: error.message }
    }

    revalidatePath("/projects")
    return { success: true }
}

export async function getComments(project_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("project_comments")
        .select("*")
        .eq("project_id", project_id)
        .eq("is_approved", true)
        .order("created_at", { ascending: true })

    if (error) {
        console.error("Error fetching comments:", error)
        return []
    }

    return data
}
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitReview(formData: FormData) {
  const supabase = await createClient()

  const name = (formData.get("name") as string)?.trim()
  const comment = (formData.get("comment") as string)?.trim()

  if (!name || !comment) {
    return { error: "Name and comment are required" }
  }

  if (name.length > 100) {
    return { error: "Name is too long" }
  }

  if (comment.length > 1000) {
    return { error: "Comment must be under 1000 characters" }
  }

  const { error } = await supabase.from("reviews").insert({
    name,
    comment,
    is_approved: false,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function submitProjectComment(formData: FormData) {
  const supabase = await createClient()

  const name = (formData.get("name") as string)?.trim()
  const comment = (formData.get("comment") as string)?.trim()
  const projectId = formData.get("project_id") as string

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
    is_approved: false,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function approveReview(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: true })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteReview(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("reviews").delete().eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function approveComment(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("project_comments")
    .update({ is_approved: true })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/projects")
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteComment(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("project_comments").delete().eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/projects")
  revalidatePath("/admin")
  return { success: true }
}

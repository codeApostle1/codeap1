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

// Consolidated into app/actions/comments.ts

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

// Consolidated into app/admin/actions.ts

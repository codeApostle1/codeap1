"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

function isAdminEmail(email?: string | null) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  if (!email) return false
  if (adminEmails.length === 0) return true
  return adminEmails.includes(email.toLowerCase())
}

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { supabase: null, error: "Not authenticated" as const }
  }

  if (!isAdminEmail(user.email)) {
    return { supabase: null, error: "Not authorized" as const }
  }

  return { supabase, user, error: null }
}

export async function addProject(formData: FormData) {
  const { supabase, user, error: authError } = await requireAdmin()
  if (authError || !supabase || !user) return { error: authError }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const url = formData.get("url") as string

  if (!title || !description || !url) {
    return { error: "All fields are required" }
  }

  const { error } = await supabase.from("projects").insert({
    title,
    description,
    url,
    user_id: user.id,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/projects")
  return { success: true }
}

export async function deleteProject(id: string) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/projects")
  return { success: true }
}

export async function updateProject(id: string, formData: FormData) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const url = formData.get("url") as string

  if (!title || !description || !url) {
    return { error: "All fields are required" }
  }

  const { error } = await supabase
    .from("projects")
    .update({ title, description, url })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/projects")
  return { success: true }
}

export async function approveComment(id: string) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const { error } = await supabase
    .from("project_comments")
    .update({ is_approved: true })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin")
  revalidatePath("/projects")
  return { success: true }
}

export async function deleteComment(id: string) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const { error } = await supabase.from("project_comments").delete().eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin")
  revalidatePath("/projects")
  return { success: true }
}

export async function replyToComment(parentId: string, projectId: string, content: string) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const { error } = await supabase.from("project_comments").insert({
    project_id: projectId,
    parent_id: parentId,
    comment: content,
    name: "Admin",
    is_admin_reply: true,
    is_approved: true,
  })

  if (error) return { error: error.message }

  revalidatePath("/admin")
  revalidatePath("/projects")
  return { success: true }
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

function isAdminEmail(email?: string | null) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  // <<<<<<< codex/review-folder-structure-and-ui-compliance-qzk9s9
  //   if (!email) return false
  //   if (adminEmails.length === 0) return true
  // =======
  if (!email || adminEmails.length === 0) return false

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
  const image = formData.get("image") as File | null
  const imageFocusX = parseFocus(formData.get("image_focus_x"), 50)
  const imageFocusY = parseFocus(formData.get("image_focus_y"), 50)
  const publishedAt = parsePublishedDate(formData.get("published_at"))
  const showPublishedDate = parseShowDate(formData.get("show_published_date"))

  if (!title || !description || !url) {
    return { error: "All fields are required" }
  }

  try {
    const { imageUrl, error: imageError } = await uploadProjectImage(supabase, image)
    if (imageError) return { error: imageError }

    const { error } = await supabase.from("projects").insert({
      title,
      description,
      url,
      user_id: user.id,
      image_url: imageUrl,
      image_focus_x: imageFocusX,
      image_focus_y: imageFocusY,
      published_at: publishedAt,
      show_published_date: showPublishedDate,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    return { error: normalizeError(error) }
  }
}

export async function deleteProject(id: string) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  try {
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    return { error: normalizeError(error) }
  }
}

export async function updateProject(id: string, formData: FormData) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const url = formData.get("url") as string
  const existingImageUrl = (formData.get("existing_image_url") as string) || null
  const image = formData.get("image") as File | null
  const imageFocusX = parseFocus(formData.get("image_focus_x"), 50)
  const imageFocusY = parseFocus(formData.get("image_focus_y"), 50)
  const publishedAt = parsePublishedDate(formData.get("published_at"))
  const showPublishedDate = parseShowDate(formData.get("show_published_date"))

  if (!title || !description || !url) {
    return { error: "All fields are required" }
  }

  try {
    const { imageUrl, error: imageError } = await uploadProjectImage(supabase, image)
    if (imageError) return { error: imageError }

    const finalImageUrl = imageUrl ?? existingImageUrl

    const { error } = await supabase
      .from("projects")
      .update({
        title,
        description,
        url,
        image_url: finalImageUrl,
        image_focus_x: imageFocusX,
        image_focus_y: imageFocusY,
        published_at: publishedAt,
        show_published_date: showPublishedDate,
      })
      .eq("id", id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    return { error: normalizeError(error) }
  }
}

export async function approveComment(id: string) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  try {
    const { error } = await supabase
      .from("project_comments")
      .update({ is_approved: true })
      .eq("id", id)

    if (error) return { error: error.message }

    revalidatePath("/admin")
    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    return { error: normalizeError(error) }
  }
}

export async function deleteComment(id: string) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  try {
    const { error } = await supabase.from("project_comments").delete().eq("id", id)

    if (error) return { error: error.message }

    revalidatePath("/admin")
    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    return { error: normalizeError(error) }
  }
}

export async function replyToComment(parentId: string, projectId: string, content: string) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError || !supabase) return { error: authError }

  try {
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
  } catch (error) {
    return { error: normalizeError(error) }
  }
}

function parseFocus(value: any, defaultValue: number): number {
  const parsed = parseInt(String(value))
  return isNaN(parsed) ? defaultValue : parsed
}

function parsePublishedDate(value: any): string | null {
  if (!value) return null
  const date = new Date(String(value))
  return isNaN(date.getTime()) ? null : date.toISOString()
}

function parseShowDate(value: any): boolean {
  return value === "true" || value === true || value === "on"
}

function normalizeError(error: any): string {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return "An unexpected error occurred"
}

async function uploadProjectImage(
  supabase: any,
  image: File | null
): Promise<{ imageUrl: string | null; error: string | null }> {
  if (!image || !(image instanceof File) || image.size === 0) {
    return { imageUrl: null, error: null }
  }

  try {
    const fileExt = image.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `project-images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, image)

    if (uploadError) {
      return { imageUrl: null, error: uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from("portfolio")
      .getPublicUrl(filePath)

    return { imageUrl: publicUrl, error: null }
  } catch (error) {
    return { imageUrl: null, error: normalizeError(error) }
  }
}

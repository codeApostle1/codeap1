"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

function isAdminEmail(email?: string | null) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  const allowedEmails = adminEmails.length > 0 ? adminEmails : ["joelmtn7@gmail.com"]

  if (!email) return false
  return allowedEmails.includes(email.toLowerCase())
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

async function uploadProjectImage(supabase: Awaited<ReturnType<typeof createClient>>, imageFile: File | null) {
  if (!imageFile || imageFile.size === 0) {
    return { imageUrl: null as string | null, error: null as string | null }
  }

  const ext = imageFile.name.split(".").pop()?.toLowerCase() || "jpg"
  const randomPart = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const path = `projects/${Date.now()}-${randomPart}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(path, imageFile, { upsert: false, cacheControl: "3600" })

  if (uploadError) {
    return { imageUrl: null, error: uploadError.message }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("project-images").getPublicUrl(path)

  return { imageUrl: publicUrl, error: null }
}

function parseFocus(value: FormDataEntryValue | null, fallback = 50) {
  const parsed = Number(value ?? fallback)
  if (Number.isNaN(parsed)) return fallback
  return Math.max(0, Math.min(100, parsed))
}

function parseShowDate(value: FormDataEntryValue | null) {
  return value === "on" || value === "true"
}

function parsePublishedDate(value: FormDataEntryValue | null) {
  if (!value) return null
  const parsed = String(value).trim()
  return parsed.length > 0 ? parsed : null
}

function parseImageFile(value: FormDataEntryValue | null) {
  if (!value || typeof value === "string") return null
  if (!(value instanceof File)) return null
  if (value.size === 0) return null
  return value
}

function normalizeError(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return "Unexpected server error. Please try again."
}

export async function addProject(formData: FormData) {
  try {
    const { supabase, user, error: authError } = await requireAdmin()
    if (authError || !supabase || !user) return { error: authError }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const url = formData.get("url") as string
  const image = parseImageFile(formData.get("image"))
  const imageFocusX = parseFocus(formData.get("image_focus_x"), 50)
  const imageFocusY = parseFocus(formData.get("image_focus_y"), 50)
  const publishedAt = parsePublishedDate(formData.get("published_at"))
  const showPublishedDate = parseShowDate(formData.get("show_published_date"))

  if (!title || !description || !url) {
    return { error: "All fields are required" }
  }

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
  try {
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
  } catch (error) {
    return { error: normalizeError(error) }
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const { supabase, error: authError } = await requireAdmin()
    if (authError || !supabase) return { error: authError }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const url = formData.get("url") as string
  const existingImageUrl = (formData.get("existing_image_url") as string) || null
  const image = parseImageFile(formData.get("image"))
  const imageFocusX = parseFocus(formData.get("image_focus_x"), 50)
  const imageFocusY = parseFocus(formData.get("image_focus_y"), 50)
  const publishedAt = parsePublishedDate(formData.get("published_at"))
  const showPublishedDate = parseShowDate(formData.get("show_published_date"))

  if (!title || !description || !url) {
    return { error: "All fields are required" }
  }

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
  try {
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
  } catch (error) {
    return { error: normalizeError(error) }
  }
}

export async function deleteComment(id: string) {
  try {
    const { supabase, error: authError } = await requireAdmin()
    if (authError || !supabase) return { error: authError }

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
  try {
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
  } catch (error) {
    return { error: normalizeError(error) }
  }
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addProject(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

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
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

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
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

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

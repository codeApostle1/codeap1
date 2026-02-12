import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export const metadata = {
  title: "Admin | Portfolio",
  description: "Manage your portfolio projects.",
}


const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

const defaultAdminEmails = ["joelmtn7@gmail.com"]

function isAdminEmail(email?: string | null) {
  const allowedEmails = adminEmails.length > 0 ? adminEmails : defaultAdminEmails

  if (!email) return false
  return allowedEmails.includes(email.toLowerCase())
}

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (!isAdminEmail(user.email)) {
    redirect("/auth/login")
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: comments } = await supabase
    .from("project_comments")
    .select("*")
    .order("created_at", { ascending: true })

  return (
    <AdminDashboard
      projects={projects ?? []}
      comments={comments ?? []}
      userEmail={user.email ?? ""}
    />
  )
}

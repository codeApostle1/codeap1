import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export const metadata = {
  title: "Admin | Portfolio",
  description: "Manage your portfolio projects.",
}


const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

function isAdminEmail(email?: string | null) {
  if (!email) return false
// <<<<<<< codex/review-folder-structure-and-ui-compliance-qzk9s9
//   if (adminEmails.length === 0) return true
// =======
  if (adminEmails.length === 0) return false
// >>>>>>> main
  return adminEmails.includes(email.toLowerCase())
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
// <<<<<<< codex/review-folder-structure-and-ui-compliance-qzk9s9
//     redirect("/auth/login")
// =======
    notFound()
// >>>>>>> main
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
    <div>Helloooo im an admin</div>
    // <AdminDashboard
    //   projects={projects ?? []}
    //   comments={comments ?? []}
    //   userEmail={user.email ?? ""}
    // />
  )
}

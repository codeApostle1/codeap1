import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export const metadata = {
  title: "Admin | Portfolio",
  description: "Manage your portfolio projects.",
}

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  return <AdminDashboard projects={projects ?? []} userEmail={user.email ?? ""} />
}

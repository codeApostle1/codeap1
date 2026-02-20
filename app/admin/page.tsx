import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase.from("orders").select("id,status");

  const total = orders?.length ?? 0;
  const pending = orders?.filter((order) => order.status === "Pending").length ?? 0;
  const completed = orders?.filter((order) => order.status === "Completed").length ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="section-title">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface-card"><p className="text-sm text-stone-500">Total Orders</p><p className="text-2xl font-bold">{total}</p></div>
        <div className="surface-card"><p className="text-sm text-stone-500">Pending</p><p className="text-2xl font-bold">{pending}</p></div>
        <div className="surface-card"><p className="text-sm text-stone-500">Completed</p><p className="text-2xl font-bold">{completed}</p></div>
      </div>
      <div className="flex gap-3">
        <Link href="/admin/products" className="rounded-full bg-white px-4 py-2 shadow-sm">Manage Menu</Link>
        <Link href="/admin/orders" className="rounded-full bg-rose-700 px-4 py-2 text-white">Manage Orders</Link>
      </div>
    </div>
  );
}

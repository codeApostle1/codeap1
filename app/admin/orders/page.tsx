import { updateOrderStatus } from "@/app/admin/actions";
import { formatCurrency } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

const statuses = ["Pending", "Processing", "Completed", "Cancelled"];

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });

  if (!orders?.length) {
    return <div className="surface-card text-sm text-stone-500">No orders yet.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="section-title">Manage Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="surface-card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">{order.customer_name}</p>
            <p className="text-sm text-stone-600">{order.phone} • {order.delivery_type} • {formatCurrency(order.total_price)}</p>
            <p className="text-xs text-stone-500">{order.address || "No address"}</p>
          </div>
          <form action={async (formData) => { "use server"; await updateOrderStatus(order.id, String(formData.get("status"))); }} className="flex gap-2">
            <select name="status" defaultValue={order.status} className="rounded-xl border px-3 py-2 text-sm">
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
            <button className="rounded-full bg-rose-700 px-4 py-2 text-sm text-white">Update</button>
          </form>
        </div>
      ))}
    </div>
  );
}

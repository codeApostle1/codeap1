import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export default async function SuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();
  const { data: items } = await supabase.from("order_items").select("*").eq("order_id", id);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="surface-card text-center">
        <h1 className="text-2xl font-semibold text-rose-700">Order Confirmed 🎉</h1>
        <p className="mt-2 text-stone-600">Thank you for choosing Zara&apos;s Crunch. We&apos;ll contact you shortly.</p>
      </div>
      {order ? (
        <div className="surface-card space-y-2">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Customer:</strong> {order.customer_name}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> {formatCurrency(order.total_price)}</p>
          <p><strong>Items:</strong> {items?.length ?? 0}</p>
        </div>
      ) : null}
      <Link href="/menu" className="inline-flex rounded-full bg-rose-700 px-4 py-2 text-white">Order More</Link>
    </div>
  );
}

"use client";

import { FormEvent, useState, useTransition } from "react";
import { createOrder } from "@/app/actions/orders";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [deliveryType, setDeliveryType] = useState<"Delivery" | "Pickup">("Delivery");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createOrder({
        customerName: String(formData.get("customerName") || ""),
        phone: String(formData.get("phone") || ""),
        deliveryType,
        address: String(formData.get("address") || ""),
        total,
        items,
      });

      if (result?.error) setError(result.error);
    });
  };

  if (!items.length) {
    return <p className="surface-card text-center text-stone-600">Your cart is empty. Add items before checkout.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="section-title">Checkout</h1>
      <form onSubmit={handleSubmit} className="surface-card space-y-4">
        <div>
          <label className="text-sm font-medium">Customer Name</label>
          <input required name="customerName" className="mt-1 w-full rounded-xl border px-4 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <input required name="phone" className="mt-1 w-full rounded-xl border px-4 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Delivery Type</label>
          <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value as "Delivery" | "Pickup")} className="mt-1 w-full rounded-xl border px-4 py-2">
            <option value="Delivery">Delivery</option>
            <option value="Pickup">Pickup</option>
          </select>
        </div>
        {deliveryType === "Delivery" && (
          <div>
            <label className="text-sm font-medium">Address</label>
            <textarea required name="address" className="mt-1 w-full rounded-xl border px-4 py-2" />
          </div>
        )}
        <p className="font-semibold">Total: {formatCurrency(total)}</p>
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button disabled={isPending} className="w-full rounded-full bg-rose-700 px-4 py-3 font-semibold text-white disabled:bg-stone-300">
          {isPending ? "Submitting Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

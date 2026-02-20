"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (!items.length) {
    return (
      <div className="surface-card text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-stone-600">Add some delicious food from the menu.</p>
        <Link href="/menu" className="mt-4 inline-flex rounded-full bg-rose-700 px-4 py-2 text-white">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="section-title">Your Cart</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="surface-card flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-stone-600">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-full border px-3 py-1" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button className="rounded-full border px-3 py-1" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button className="rounded-full border border-rose-200 px-3 py-1 text-rose-700" onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="surface-card flex items-center justify-between">
        <p className="text-lg font-semibold">Total: {formatCurrency(total)}</p>
        <Link href="/checkout" className="rounded-full bg-rose-700 px-5 py-2 text-white">Proceed to Checkout</Link>
      </div>
    </div>
  );
}

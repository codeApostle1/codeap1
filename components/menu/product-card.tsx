"use client";

import Image from "next/image";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <article className="surface-card flex h-full flex-col gap-4">
      <div className="relative h-44 w-full overflow-hidden rounded-xl">
        <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-rose-700">{product.category}</p>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-stone-600">{product.description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <p className="text-base font-semibold">{formatCurrency(product.price)}</p>
        <button
          type="button"
          disabled={!product.is_available}
          onClick={() => addToCart(product)}
          className="rounded-full bg-rose-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {product.is_available ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}

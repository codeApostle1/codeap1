"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/menu/product-card";
import type { Product } from "@/lib/types";

const categories = ["Small Chops", "Shawarma", "Cakes", "Drinks"];

export function MenuCatalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return products;

    return products.filter((product) => {
      const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [products, query]);

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="section-title">Our Menu</h1>
        <p className="text-stone-600">Live prices and availability. Built to remove manual order confusion.</p>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search food, category, or description..."
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-rose-300 transition focus:ring"
        />
      </section>

      {categories.map((category) => {
        const items = filtered.filter((product) => product.category === category);
        return (
          <section key={category} className="space-y-4">
            <h2 className="text-xl font-semibold">{category}</h2>
            {items.length === 0 ? (
              <div className="surface-card text-sm text-stone-500">No matching items in this category.</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {filtered.length === 0 ? (
        <div className="surface-card text-sm text-stone-500">No menu items match your search. Try another keyword.</div>
      ) : null}
    </div>
  );
}

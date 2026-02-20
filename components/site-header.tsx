"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/providers/cart-provider";

const nav = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/cart", label: "Cart" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-amber-50/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link href="/" className="text-center text-xl font-bold text-rose-700 md:text-left">Zara&apos;s Crunch</Link>
        <nav className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-stone-700 md:justify-end">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 transition hover:bg-white ${pathname === item.href ? "bg-white shadow-sm" : ""}`}
            >
              {item.label}
              {item.href === "/cart" && itemCount > 0 ? ` (${itemCount})` : ""}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

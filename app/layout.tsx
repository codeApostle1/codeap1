import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Zara's Crunch",
  description: "Food ordering app for Zara's Crunch in Kaduna",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-amber-50 text-stone-900 antialiased">
        <CartProvider>
          <SiteHeader />
          <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}

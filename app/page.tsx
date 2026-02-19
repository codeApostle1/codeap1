import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/menu/product-card";
import { getProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 4);

  return (
    <div className="space-y-12">
      <section className="surface-card overflow-hidden bg-gradient-to-r from-amber-100 via-white to-rose-100">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <p className="inline-flex rounded-full bg-white px-3 py-1 text-sm font-medium text-rose-700 shadow-sm">Kaduna • Fast Ordering</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Fresh flavors from Zara&apos;s Crunch.</h1>
            <p className="max-w-md text-stone-700">Order small chops, shawarma, cakes, and drinks in minutes. Pickup or delivery available.</p>
            <Link href="/menu" className="inline-flex rounded-full bg-rose-700 px-6 py-3 font-semibold text-white transition hover:bg-rose-800">Order Now</Link>
          </div>
          <div className="relative h-72 w-full overflow-hidden rounded-2xl">
            <Image src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop" alt="Zara's Crunch food" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-title">Featured Items</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

import { ProductCard } from "@/components/menu/product-card";
import { getProducts } from "@/lib/products";

const categories = ["Small Chops", "Shawarma", "Cakes", "Drinks"];

export default async function MenuPage() {
  const products = await getProducts();

  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <h1 className="section-title">Our Menu</h1>
        <p className="text-stone-600">Live prices and availability. Built to remove manual order confusion.</p>
      </section>

      {categories.map((category) => {
        const items = products.filter((product) => product.category === category);
        return (
          <section key={category} className="space-y-4">
            <h2 className="text-xl font-semibold">{category}</h2>
            {items.length === 0 ? (
              <div className="surface-card text-sm text-stone-500">No items available in this category yet.</div>
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
    </div>
  );
}

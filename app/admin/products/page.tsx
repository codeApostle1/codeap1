import { createProduct, deleteProduct, toggleProductAvailability } from "@/app/admin/actions";
import { getProducts } from "@/lib/products";
import { formatCurrency } from "@/lib/format";

const categories = ["Small Chops", "Shawarma", "Cakes", "Drinks"];

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <h1 className="section-title">Manage Menu</h1>
      <form action={createProduct} className="surface-card grid gap-3 md:grid-cols-2">
        <input name="name" required placeholder="Product name" className="rounded-xl border px-4 py-2" />
        <input name="price" type="number" required placeholder="Price" className="rounded-xl border px-4 py-2" />
        <input name="image_url" required placeholder="Image URL" className="rounded-xl border px-4 py-2 md:col-span-2" />
        <textarea name="description" required placeholder="Description" className="rounded-xl border px-4 py-2 md:col-span-2" />
        <select name="category" className="rounded-xl border px-4 py-2">
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_available" defaultChecked /> Available</label>
        <button className="rounded-full bg-rose-700 px-4 py-2 text-white md:col-span-2">Add Product</button>
      </form>

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="surface-card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-stone-600">{formatCurrency(product.price)} • {product.category}</p>
            </div>
            <div className="flex gap-2">
              <form action={async () => { "use server"; await toggleProductAvailability(product.id, product.is_available); }}>
                <button className="rounded-full border px-3 py-1">{product.is_available ? "Mark Out of stock" : "Mark Available"}</button>
              </form>
              <form action={async () => { "use server"; await deleteProduct(product.id); }}>
                <button className="rounded-full border border-rose-200 px-3 py-1 text-rose-700">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

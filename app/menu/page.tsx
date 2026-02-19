import { MenuCatalog } from "@/components/menu/menu-catalog";
import { getProducts } from "@/lib/products";

export default async function MenuPage() {
  const products = await getProducts();

  return <MenuCatalog products={products} />;
}

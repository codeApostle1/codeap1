import { fallbackProducts } from "@/lib/fallback-products";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export async function getProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return fallbackProducts;
  }

  return data as Product[];
}

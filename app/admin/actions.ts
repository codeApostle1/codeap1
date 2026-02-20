"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price") || 0),
    image_url: String(formData.get("image_url") || ""),
    category: String(formData.get("category") || "Small Chops"),
    is_available: formData.get("is_available") === "on",
  });

  if (error) return { error: error.message };
  revalidatePath("/menu");
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/menu");
  revalidatePath("/admin/products");
}

export async function toggleProductAvailability(id: string, isAvailable: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ is_available: !isAvailable }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/menu");
  revalidatePath("/admin/products");
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) return { error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

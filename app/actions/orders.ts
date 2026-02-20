"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/types";

type CheckoutInput = {
  customerName: string;
  phone: string;
  deliveryType: "Delivery" | "Pickup";
  address?: string;
  total: number;
  items: CartItem[];
};

export async function createOrder(input: CheckoutInput) {
  if (!input.customerName || !input.phone || input.items.length === 0) {
    return { error: "Missing required fields" };
  }

  if (input.deliveryType === "Delivery" && !input.address) {
    return { error: "Address is required for delivery" };
  }

  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customerName,
      phone: input.phone,
      delivery_type: input.deliveryType,
      address: input.address || null,
      total_price: input.total,
      status: "Pending",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Unable to create order" };
  }

  const { error: itemError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
  );

  if (itemError) {
    return { error: itemError.message };
  }

  redirect(`/success/${order.id}`);
}

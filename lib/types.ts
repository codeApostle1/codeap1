export type Category = "Small Chops" | "Shawarma" | "Cakes" | "Drinks";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: Category;
  is_available: boolean;
  created_at?: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";

import type { Product } from "@/lib/types";

export const fallbackProducts: Product[] = [
  {
    id: "fc1",
    name: "Fried Samosa (10 pcs)",
    description: "Crunchy and golden samosa, great for events and iftar packs.",
    price: 3000,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop",
    category: "Small Chops",
    is_available: true,
  },
  {
    id: "fc2",
    name: "Pepper Chicken",
    description: "Spicy peppered chicken bowl.",
    price: 3500,
    image_url: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=1200&auto=format&fit=crop",
    category: "Small Chops",
    is_available: true,
  },
  {
    id: "sw1",
    name: "Shawarma (Extra Meat)",
    description: "No sausage, packed with extra meat.",
    price: 3000,
    image_url: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=1200&auto=format&fit=crop",
    category: "Shawarma",
    is_available: true,
  },
  {
    id: "ck1",
    name: "Red Velvet Cupcakes (50 pcs)",
    description: "Soft and rich cupcakes for celebrations.",
    price: 18000,
    image_url: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=1200&auto=format&fit=crop",
    category: "Cakes",
    is_available: true,
  },
  {
    id: "dr1",
    name: "Milkshake",
    description: "Creamy chilled bottle milkshake.",
    price: 2000,
    image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1200&auto=format&fit=crop",
    category: "Drinks",
    is_available: true,
  },
];

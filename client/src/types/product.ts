export type Category = "HOT" | "COLD" | "DESSERT";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category: Category;
  isAvailable: boolean;
}
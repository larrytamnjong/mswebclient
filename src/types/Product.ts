export interface Product {
  id?: number;
  favorite: number | null;
  favorite_name?: string;
  name: string;
  internal_reference: string;
  responsible: string | null;
  barcode: string | null;
  sales_price: number;
  cost: number;
  product_category: number | null;
  product_category_name?: string;
  product_type: number | null;
  product_type_name?: string;
  quantity_on_hand: number;
  forecasted_quantity: number;
  activity_exception_decoration: string | null;
}

export interface PriorityLevel {
  id?: number;
  name: string;
  description: string;
}

export interface FavoriteType {
  id?: number;
  name: string;
  description: string;
  color: string;
}

export interface ProductCategory {
  id?: number;
  name: string;
  parent: number | null;
  parent_name?: string;
  full_path: string;
}

export interface ProductType {
  id?: number;
  name: string;
  description: string;
}
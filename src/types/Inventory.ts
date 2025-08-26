export interface Location {
  id?: number;
  code: string;
  name: string;
  description: string;
}

export interface StockMoveType {
  id?: number;
  name: string;
  code: string;
}

export interface StockMove {
  id?: number;
  move_type: number | null;
  move_type_name?: string;
  move_type_code?: string;
  product: number | null;
  product_name?: string;
  quantity: number;
  from_location: number | null;
  from_location_name?: string;
  from_location_code?: string;
  to_location: number | null;
  to_location_name?: string;
  to_location_code?: string;
  timestamp: string;
  description: string;
}

export interface InventoryLevel {
  id?: number;
  product: number | null;
  product_name?: string;
  product_internal_reference?: string;
  location: number | null;
  location_name?: string;
  location_code?: string;
  quantity: number;
  last_updated: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Product {
  id?: number;
  code: string;
  product_type: string;
  stock: number;
  stock_minimum: number;
  active?: boolean;
}

export interface StockMovement {
  id?: number;
  product_id?: number;
  product_code?: string;
  quantity: number;
  observation?: string | null;
  movement_type?: "entry" | "exit";
  user_id?: number;
  user_name?: string;
  stock_before?: number;
  stock_after?: number;
  created_at?: string;
  product?: { code?: string };
  user?: { name?: string };
}

export interface DashboardData {
  total_stock?: number | null;
  entries_today?: number;
  exits_today?: number;
  out_of_stock?: number;
  low_stock_count?: number;
  low_stock_products?: Product[];
  [key: string]: unknown;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ProductFilters {
  type?: string;
  active?: boolean;
  search?: string;
}

export interface MovementFilters {
  product_code?: string;
  user_id?: number;
  movement_type?: string;
  start?: string;
  end?: string;
}

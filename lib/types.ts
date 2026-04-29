export type OrderStatus = 'new' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type DeliveryZone = 'gran_seville' | 'banlic' | 'other';
export type PaymentMethod = 'cash' | 'gcash';
export type ExpenseCategory = 'nutrients' | 'cups' | 'soil' | 'seeds' | 'tools' | 'packaging' | 'utilities' | 'other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  expense_date: string;
  notes: string | null;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes: string | null;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

export interface Order {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  delivery_zone: DeliveryZone;
  notes: string | null;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  variety: string | null;
  description: string | null;
  price_single: number;
  price_bundle_qty: number;
  price_bundle_total: number | null;
  available: boolean;
  coming_soon: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_orders: number;
  revenue_today: number;
  revenue_total: number;
  pending_orders: number;
  total_customers: number;
  orders_this_week: number;
}

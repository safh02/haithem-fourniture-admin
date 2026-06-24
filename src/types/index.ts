export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  id: number;
  name_fr: string;
  name_ar?: string;
  description_fr?: string;
  description_ar?: string;
  category_id: number;
  category_name?: string;
  price?: number;
  is_quote_only: boolean;
  status: 'draft' | 'published';
  images: { url: string; public_id: string }[];
  variants: any[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name_fr: string;
  name_ar?: string;
  slug: string;
}

export interface Order {
  id: number;
  customer_name: string;
  email?: string;
  phone?: string;
  address?: string;
  wilaya?: string;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  payment_method?: string;
  notes?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  variant?: any;
}

export interface Quote {
  id: number;
  customer_name: string;
  email?: string;
  phone?: string;
  product_id?: number;
  product_name?: string;
  message?: string;
  status: 'pending' | 'responded' | 'closed';
  admin_response?: string;
  created_at: string;
}

export interface B2BClient {
  id: number;
  company_name: string;
  contact_name?: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'active' | 'suspended';
  created_at: string;
  discounts?: B2BDiscount[];
}

export interface B2BDiscount {
  id: number;
  type: 'category' | 'product';
  reference_id: number;
  discount_percent: number;
}

export interface AnalyticsSummary {
  today: { orders: number; revenue: number };
  week: { orders: number; revenue: number };
  month: { orders: number; revenue: number };
  pending_quotes: number;
  new_b2b: number;
  total_revenue: number;
  recent_activity: any[];
}

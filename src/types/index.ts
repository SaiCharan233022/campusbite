export type Role = 'STUDENT' | 'ADMIN';

export type Category = 
  | 'BREAKFAST'
  | 'LUNCH'
  | 'DINNER'
  | 'SNACKS'
  | 'BEVERAGES'
  | 'DESSERTS';

export type OrderStatus = 
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'COLLECTED'
  | 'CANCELLED';

export type PaymentStatus = 
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED';

export interface User {
  id: string;
  collegeId: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  createdAt: string;
}

export interface Canteen {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  location?: string | null;
  isActive: boolean;
  openTime: string;
  closeTime: string;
  menuItems?: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  category: Category;
  isVeg: boolean;
  isAvailable: boolean;
  prepTime: number; // in minutes
  canteenId: string;
  canteen?: Canteen;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  menuItemId: string;
  menuItem: MenuItem;
}

export interface Order {
  id: string;
  tokenNumber: number;
  status: OrderStatus;
  totalAmount: number;
  paymentId?: string | null;
  paymentStatus: PaymentStatus;
  scheduledFor?: string | null;
  estimatedReady?: string | null;
  notes?: string | null;
  userId: string;
  user?: User;
  canteenId: string;
  canteen?: Canteen;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

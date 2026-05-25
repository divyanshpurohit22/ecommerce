export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Dumbbells' | 'Yoga' | 'Protein' | 'Cardio' | 'Accessories';
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  token: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  _id: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'ADMIN' | 'CUSTOMER' | 'STAFF';
  customerId?: string;
  staffId?: string;
  address?: string | null;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  orderIndex: number;
  _count?: {
    services: number;
  };
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category?: ServiceCategory;
  description: string;
  benefits?: string | null;
  durationMinutes: number;
  price: number;
  originalPrice?: number | null;
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  rating?: number;
  reviewCount?: number;
  staffMembers?: {
    staff: Staff;
  }[];
  reviews?: Review[];
}

export interface Staff {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  roleTitle: string;
  bio?: string | null;
  avatar?: string | null;
  isActive: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  services?: {
    service: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

export interface Appointment {
  id: string;
  bookingReference: string;
  customerId: string;
  staffId?: string | null;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string | null;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  paymentMethod: 'ONLINE' | 'SALON';
  service?: Service;
  staff?: Staff | null;
  customer?: {
    user: {
      name: string;
      email: string;
      phone?: string | null;
    };
  };
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category?: ProductCategory;
  description: string;
  price: number;
  discountPercent: number;
  stock: number;
  sku: string;
  rating: number;
  image?: string;
  isFeatured: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  subtotal: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'READY' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod: string;
  items: OrderItem[];
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  slug: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  badgeText?: string | null;
  image?: string;
  validUntil?: string | null;
  terms?: string | null;
  isActive: boolean;
  isFeatured: boolean;
}

export interface Review {
  id: string;
  customerId: string;
  serviceId: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  customer?: {
    user: {
      name: string;
    };
  };
  service?: {
    id: string;
    name: string;
  };
}

export interface SiteSettings {
  id: string;
  salonName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  openingHours: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
  bookingNotice: string;
  cancellationPolicyHours: number;
  currencySymbol: string;
  taxRatePercent: number;
}

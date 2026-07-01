export interface ProductVariant {
  name: string;
  extraPrice: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  badges?: string[];
  available: boolean;
  order: number;
  variants?: ProductVariant[];
  createdAt?: number;
  updatedAt?: number;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image?: string;
  active: boolean;
  order: number;
}

export interface BusinessHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface BusinessSettings {
  name: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  address: string;
  logo?: string;
  heroImage?: string;
  social: {
    instagram: string;
    facebook: string;
  };
  hours: {
    monday: BusinessHours;
    tuesday: BusinessHours;
    wednesday: BusinessHours;
    thursday: BusinessHours;
    friday: BusinessHours;
    saturday: BusinessHours;
    sunday: BusinessHours;
  };
  deliveryFee?: number;
  minOrderAmount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variantName?: string;
  variantExtraPrice?: number;
}

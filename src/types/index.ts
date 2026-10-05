export type FlavorCategory = 'signature' | 'seasonal' | 'vegan' | 'classics' | 'sundaes' | 'pints';

export interface Flavor {
  id: string;
  name: string;
  category: FlavorCategory;
  tagline: string;
  description: string;
  tastingNotes: string[];
  singlePrice: number;
  doublePrice: number;
  pintPrice: number;
  colorHex: string;
  accentHex: string;
  isVegan: boolean;
  isGlutenFree: boolean;
  isNutFree: boolean;
  isSeasonal?: boolean;
  isBestseller?: boolean;
  caloriesPerScoop: number;
  ingredients: string[];
  image: string;
}

export interface PremadeSundae {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  vessel: string;
  scoops: string[];
  sauces: string[];
  toppings: string[];
  isVegan?: boolean;
  isGlutenFree?: boolean;
  image: string;
}

export interface VesselOption {
  id: string;
  name: string;
  price: number;
  description: string;
  isVegan: boolean;
  isGlutenFree: boolean;
  iconName: string;
}

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
  category: 'sauce' | 'crunch' | 'fruit' | 'delight';
  isVegan: boolean;
  isGlutenFree: boolean;
  isNutFree: boolean;
}

export interface CustomScoopCreation {
  vesselId: string;
  scoopCount: 1 | 2 | 3;
  scoopFlavorIds: string[];
  sauceIds: string[];
  toppingIds: string[];
  whippedCream: boolean;
  cherry: boolean;
  specialInstructions?: string;
  calculatedPrice: number;
}

export interface CartItem {
  id: string;
  type: 'scoop' | 'custom_sundae' | 'premade_sundae' | 'pint' | 'sandwich' | 'flight';
  title: string;
  subtitle: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  details: {
    vessel?: string;
    scoops?: string[];
    toppings?: string[];
    size?: string;
    notes?: string;
  };
  image?: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: {
    weekday: string;
    weekend: string;
  };
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // for SVG visualization (0-100)
    mapY: number; // for SVG visualization (0-100)
  };
  crowdStatus: 'Calm & Easy' | 'Moderate Flow' | 'Lively Buzz';
  waitMinutes: number;
  features: string[];
  hasPatio: boolean;
  hasTastingFlight: boolean;
  hasCurbsidePickup: boolean;
  isFlagship?: boolean;
  image: string;
}

export interface OrderConfirmation {
  orderNumber: string;
  orderType: 'pickup' | 'delivery';
  storeId: string;
  storeName: string;
  storeAddress: string;
  scheduledTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  createdAt: string;
  status: 'confirmed' | 'scooping' | 'packed' | 'ready';
}

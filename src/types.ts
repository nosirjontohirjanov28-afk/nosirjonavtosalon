export type CarBrand = 'Chevrolet' | 'BMW' | 'Mercedes-Benz' | 'Toyota' | 'Nissan' | 'BYD';
export type CarCountry = 'Uzbekistan' | 'Germaniya' | 'Yaponiya' | 'Xitoy';
export type BodyType = 'Sedan' | 'Krossover' | 'Sportkar' | 'Kupe' | 'Miniven';

export interface CarColor {
  name: string;
  hex: string;
  classBg: string;
}

export interface CarSpecs {
  engine: string;
  powerHp: number;
  acceleration0to100: string;
  topSpeed: string;
  transmission: string;
  fuelType: string;
  fuelConsumption: string;
  driveTrain: string;
  year: number;
}

export interface CarOption {
  id: string;
  name: string;
  priceUsd: number;
  description: string;
}

export interface LicensePlate {
  id: string;
  region: string;
  number: string;
  series: string;
  fullPlate: string; // e.g. "01 777 AAA"
  category: 'vip' | 'chiroyli' | 'standart' | 'custom';
  priceUsd: number;
}

export type EngineSoundType = 
  | 'damas'
  | 'gentra' 
  | 'cobalt' 
  | 'tracker' 
  | 'lacetti' 
  | 'bmw_m5' 
  | 'amg_g63' 
  | 'supra_turbo' 
  | 'nissan_gtr' 
  | 'malibu' 
  | 'byd_hybrid';

export interface Car {
  id: string;
  name: string;
  shortModel: string; // e.g. "Damas", "Qora Gentra", "Cobalt", "Tracker", "M5", "G63", "Supra"
  brand: CarBrand;
  country: CarCountry;
  bodyType: BodyType;
  year: number;
  priceUsd: number;
  originalPriceUsd?: number;
  discountPercent?: number;
  image: string;
  gallery: string[];
  colors: CarColor[];
  specs: CarSpecs;
  features: string[];
  description: string;
  inStock: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  warranty: string;
  engineSoundType: EngineSoundType;
}

export interface CartItem {
  id: string;
  car: Car;
  selectedColor: CarColor;
  selectedOptions: CarOption[];
  selectedPlate?: LicensePlate;
  quantity: number;
}

export type PaymentMethod = 'payme' | 'click' | 'uzum' | 'card' | 'cash' | 'credit';

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  region: string;
  district: string;
  address: string;
  deliveryMethod: 'courier' | 'pickup';
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    cardNumber?: string;
    paidAmountUzs?: number;
    initialPaymentUzs?: number;
    monthlyPaymentUzs?: number;
    months?: number;
  };
  promoCode?: string;
  discountUsd: number;
  totalUsd: number;
  totalUzs: number;
  status: 'Qabul qilindi' | 'Tayyorlanmoqda' | 'Yetkazilmoqda' | 'Muvaffaqiyatli yetkazildi';
  paymentStatus: 'To\'langan' | 'Naqd to\'lanadi' | 'Kredit tasdiqlandi';
}

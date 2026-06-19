export interface Product {
  id: string;
  name: string;
  category: string;
  breed?: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  ageRange?: string;
  vaccinated: boolean;
  active: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  farmer: string;
  phone: string;
  county: string;
  breed: string;
  qty: number;
  totalKES: number;
  status: 'Pending' | 'Confirmed' | 'In Transit' | 'Delivered' | 'Cancelled';
  date: string;
  notes?: string;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  county: string;
  flocks: number;
  totalOrders: number;
  joinedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  published: boolean;
  createdAt: string;
  category: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroCoverImage: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  whatsappNumber: string;
  email: string;
  phone1: string;
  phone2: string;
  marketingDays: string;
  footerTagline: string;
  heroStats: { val: string; label: string }[];
  showWhatsappButton: boolean;
}

export interface DBTable {
  products: Product[];
  orders: Order[];
  farmers: Farmer[];
  blogPosts: BlogPost[];
  settings: SiteSettings;
}

export const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Kuroiler Chicks', category: 'Kienyeji', breed: 'Kuroiler', price: 120, stock: 500, image: '', description: 'Fast-growing dual-purpose breed. Excellent for both eggs and meat.', ageRange: '1 day – 1 month', vaccinated: true, active: true, createdAt: '2026-06-01' },
  { id: 'p2', name: 'Sasso Chicks', category: 'Kienyeji', breed: 'Sasso', price: 130, stock: 300, image: '', description: 'Hardy breed with rich flavour, high demand in the local market.', ageRange: '1 day – 1 month', vaccinated: true, active: true, createdAt: '2026-06-01' },
  { id: 'p3', name: 'Kenbro Chicks', category: 'Kienyeji', breed: 'Kenbro', price: 115, stock: 400, image: '', description: 'Adaptable dual-purpose breed, excellent feed conversion ratio.', ageRange: '1 day – 1 month', vaccinated: true, active: true, createdAt: '2026-06-01' },
  { id: 'p4', name: 'Broiler Chicks (Cobb 500)', category: 'Broilers', breed: 'Cobb 500', price: 100, stock: 800, image: '', description: 'Top commercial broiler. Ready for market in 6 weeks.', ageRange: '1 day old', vaccinated: true, active: true, createdAt: '2026-06-02' },
  { id: 'p5', name: 'Layer Chicks (ISA Brown)', category: 'Layers', breed: 'ISA Brown', price: 110, stock: 600, image: '', description: 'High-producing layer breed, up to 320 eggs per year.', ageRange: '1 day old', vaccinated: true, active: true, createdAt: '2026-06-02' },
  { id: 'p6', name: 'Rainbow Rooster', category: 'Kienyeji', breed: 'Rainbow Rooster', price: 125, stock: 200, image: '', description: 'Colourful, hardy, and popular in local markets.', ageRange: '1 day – 1 month', vaccinated: true, active: true, createdAt: '2026-06-03' },
];

export const DEFAULT_ORDERS: Order[] = [
  { id: 'ORD-001', farmer: 'James Mwangi', phone: '0712345678', county: 'Embu', breed: 'Kuroiler', qty: 100, totalKES: 12000, status: 'Delivered', date: '2026-06-01', notes: 'Delivered on time' },
  { id: 'ORD-002', farmer: 'Mary Wanjiru', phone: '0723456789', county: 'Nairobi', breed: 'Broilers', qty: 200, totalKES: 20000, status: 'In Transit', date: '2026-06-05', notes: '' },
  { id: 'ORD-003', farmer: 'Peter Kamau', phone: '0734567890', county: 'Nakuru', breed: 'Layers', qty: 150, totalKES: 16500, status: 'Pending', date: '2026-06-06', notes: '' },
  { id: 'ORD-004', farmer: 'Grace Achieng', phone: '0745678901', county: 'Eldoret', breed: 'Sasso', qty: 80, totalKES: 10400, status: 'Delivered', date: '2026-06-02', notes: '' },
  { id: 'ORD-005', farmer: 'David Njoroge', phone: '0756789012', county: 'Kirinyaga', breed: 'Kenbro', qty: 120, totalKES: 13800, status: 'Confirmed', date: '2026-06-07', notes: 'Needs morning delivery' },
];

export const DEFAULT_FARMERS: Farmer[] = [
  { id: 'f1', name: 'James Mwangi', phone: '0712345678', email: 'james@email.com', county: 'Embu', flocks: 3, totalOrders: 5, joinedAt: '2026-01-15' },
  { id: 'f2', name: 'Mary Wanjiru', phone: '0723456789', county: 'Nairobi', flocks: 2, totalOrders: 3, joinedAt: '2026-02-20' },
  { id: 'f3', name: 'Peter Kamau', phone: '0734567890', county: 'Nakuru', flocks: 1, totalOrders: 2, joinedAt: '2026-03-10' },
  { id: 'f4', name: 'Grace Achieng', phone: '0745678901', county: 'Eldoret', flocks: 4, totalOrders: 7, joinedAt: '2026-01-05' },
];

export const DEFAULT_BLOGS: BlogPost[] = [
  { id: 'b1', title: 'How to Start Broiler Farming in Kenya', slug: 'how-to-start-broiler-farming', content: 'Broiler farming is one of the most profitable agricultural ventures in Kenya...', author: 'Cucu Mutugi', published: true, createdAt: '2026-05-20', category: 'Farming Guide' },
  { id: 'b2', title: 'Best Breeds for Kenyan Farmers', slug: 'best-breeds-kenya', content: 'Choosing the right breed is the foundation of successful poultry farming...', author: 'Cucu Mutugi', published: true, createdAt: '2026-05-25', category: 'Breeds' },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: 'CUCU MUTUGI POULTRY',
  heroSubtitle: 'Growing Farmers, Building Prosperity 🌱',
  heroCoverImage: '/logo.png',
  primaryColor: '#1565C0',
  accentColor: '#00BCD4',
  logoUrl: '/logo.png',
  whatsappNumber: '254706972161',
  email: 'cucumutugipoultry@gmail.com',
  phone1: '0706972161',
  phone2: '0740662799',
  marketingDays: 'Wednesday and Thursday',
  footerTagline: 'Growing Farmers, Building Prosperity.',
  heroStats: [
    { val: '14+', label: 'Counties Served' },
    { val: '5+', label: 'Breeds Available' },
    { val: 'FREE', label: 'Delivery' },
  ],
  showWhatsappButton: true,
};

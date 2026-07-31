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

export interface StoryPollOption {
  text: string;
  votes: number;
}

export interface StoryPoll {
  question: string;
  options: StoryPollOption[];
  userVotedIndex?: number;
}

export interface Story {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  category: string;
  description?: string;
  actionText?: string;
  actionUrl?: string;
  poll?: StoryPoll;
  likes: number;
  views: number;
  createdAt: string;
  expiresAt: string;
  featured: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: string;
  views: number;
  likes: number;
  duration?: string;
  createdAt: string;
  featured?: boolean;
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
  stories: Story[];
  videos: Video[];
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

export const DEFAULT_STORIES: Story[] = [
  {
    id: 's1',
    title: '🐣 New Chicks — Ready for Dispatch!',
    mediaUrl: '/media/owner-with-chicks-2.jpg',
    mediaType: 'image',
    category: 'New Chicks',
    description: '5,000 ISA Brown Layer Chicks are ready for dispatch this week. Fully vaccinated!',
    actionText: 'Order Now',
    actionUrl: '/products',
    poll: {
      question: 'Are you stocking layers or broilers this month?',
      options: [
        { text: 'ISA Brown Layers 🥚', votes: 42 },
        { text: 'Cobb 500 Broilers 🍗', votes: 28 },
        { text: 'Kuroiler Kienyeji 🐔', votes: 35 }
      ]
    },
    likes: 124,
    views: 450,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
  },
  {
    id: 's2',
    title: '💉 Pre-Vaccinated Chicks — Team at Work',
    mediaUrl: '/media/team-delivery-1.jpg',
    mediaType: 'image',
    category: 'Vaccination',
    description: 'Every chick from Cucu Mutugi Poultry undergoes strict veterinary vaccination protocol.',
    actionText: 'Vaccination Schedule',
    actionUrl: '/resources',
    likes: 89,
    views: 310,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
  },
  {
    id: 's3',
    title: '🚚 Kitui Delivery — Chicks on the Road!',
    mediaUrl: '/media/team-delivery-2.jpg',
    mediaType: 'image',
    category: 'Egg Collection',
    description: 'High fertility hatchable eggs ready for incubation. Order yours today!',
    actionText: 'Contact Sales',
    actionUrl: '/contact',
    likes: 67,
    views: 285,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false,
  },
  {
    id: 's4',
    title: '🏡 Meet the Cucu Mutugi Team',
    mediaUrl: '/media/team-farm-2.jpg',
    mediaType: 'image',
    category: 'Farm Tour',
    description: 'Take a virtual walk inside our climate-controlled brooding units.',
    actionText: 'Watch Videos',
    actionUrl: '/videos',
    likes: 156,
    views: 520,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
  },
  {
    id: 's5',
    title: '🐥 Baby Chicks Lineup — 5 Breeds',
    mediaUrl: '/media/chicks-lineup.jpg',
    mediaType: 'image',
    category: 'Delivery',
    description: 'Free delivery dispatch leaves Embu HQ on Wednesday morning at 5:00 AM.',
    actionText: 'Book Delivery',
    actionUrl: '/products',
    likes: 98,
    views: 390,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
  }
];

export const DEFAULT_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'Cucu Mutugi — Chick Brooding at the Farm',
    description: 'A real look inside Cucu Mutugi Poultry brooding unit. Watch how we care for chicks from day one to ensure healthy, thriving flocks.',
    videoUrl: '/media/chick-video-2.mp4',
    thumbnailUrl: '/media/owner-with-chicks-1.jpg',
    category: 'Farm Tours',
    views: 1250,
    likes: 230,
    duration: '00:30',
    createdAt: '2026-06-10',
    featured: true,
  },
  {
    id: 'v2',
    title: 'Kitui Delivery — Chicks on the Road!',
    description: 'Watch our team delivering healthy pre-vaccinated chicks to farmers in Kitui County. Free countrywide delivery every Wednesday and Thursday.',
    videoUrl: '/media/kitui-delivery.mp4',
    thumbnailUrl: '/media/team-delivery-1.jpg',
    category: 'Customer Visits',
    views: 890,
    likes: 175,
    duration: '00:28',
    createdAt: '2026-06-12',
    featured: true,
  },
  {
    id: 'v3',
    title: 'Cucu Mutugi Poultry — Brand Introduction',
    description: 'Meet the team behind Cucu Mutugi Poultry. See why thousands of Kenyan farmers trust us for quality pre-vaccinated chicks and free delivery.',
    videoUrl: '/media/fly-logo.mp4',
    thumbnailUrl: '/media/owner-flag.jpg',
    category: 'Farm Tours',
    views: 2100,
    likes: 410,
    duration: '00:25',
    createdAt: '2026-06-15',
    featured: true,
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: 'CUCU MUTUGI POULTRY',
  heroSubtitle: 'Growing Farmers, Building Prosperity',
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


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

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  paymentMethod: 'M-Pesa' | 'Cash' | 'Bank Transfer' | 'Other';
  customerOrVendor?: string;
  notes?: string;
  reference?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'story' | 'order' | 'system' | 'finance';
  url?: string;
  read?: boolean;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  entity: 'transaction' | 'order' | 'story' | 'product' | 'chat' | 'settings';
  action: 'create' | 'update' | 'delete' | 'publish' | 'sync';
  summary: string;
  actor: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface CustomerActivity {
  id: string;
  type: 'search' | 'button_click' | 'email_captured' | 'page_view';
  query?: string;
  buttonName?: string;
  email?: string;
  page?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  county?: string;
  farmFocus?: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'farmer';
  status: 'pending_approval' | 'approved' | 'banned';
  createdAt: string;
  approvedAt?: string;
  password?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  isPrivate?: boolean;
}

export interface ChatAttachment {
  type: 'image' | 'document' | 'audio';
  url: string;
  filename?: string;
  sizeBytes?: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole?: 'admin' | 'moderator' | 'farmer';
  senderAvatar?: string;
  senderCounty?: string;
  content: string;
  attachments?: ChatAttachment[];
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  reactions?: Record<string, string[]>;
  createdAt: string;
  pinned?: boolean;
}

export interface DBTable {
  products: Product[];
  orders: Order[];
  farmers: Farmer[];
  blogPosts: BlogPost[];
  stories: Story[];
  videos: Video[];
  settings: SiteSettings;
  transactions?: Transaction[];
  auditTrail?: AuditEntry[];
  notifications?: AppNotification[];
  activities?: CustomerActivity[];
  chatUsers?: ChatUser[];
  chatMessages?: ChatMessage[];
  chatChannels?: ChatChannel[];
}

export const DEFAULT_CHAT_CHANNELS: ChatChannel[] = [
  { id: 'general-lounge', name: '🐔 General Farmers Lounge', description: 'Public discussion on poultry management, breeds, and farm experiences', icon: '🐔' },
  { id: 'chicks-brooding', name: '🐣 Chicks & Brooding Care', description: 'Day-old chick heating, temperature, glucose, and first-month care', icon: '🐣' },
  { id: 'vaccination-health', name: '💉 Vaccination & Disease Control', description: 'Gumboro, Newcastle, Fowl Pox schedules, vitamins, and bio-security', icon: '💉' },
  { id: 'feed-formulation', name: '🌾 Feed & Nutrition Tips', description: 'Chick mash, growers, layers mash formulas, and cost-saving tips', icon: '🌾' },
  { id: 'marketplace', name: '🛒 Farmer Marketplace', description: 'Buy & sell mature birds, kienyeji eggs, incubators, and equipment', icon: '🛒' },
  { id: 'admin-support', name: '🛡️ Cucu Mutugi Official Support', description: 'Direct orders, delivery updates, and expert advisory from admin', icon: '🛡️' },
];

export const DEFAULT_CHAT_USERS: ChatUser[] = [
  {
    id: 'admin-cucu',
    name: 'Cucu Mutugi Admin',
    email: 'cucumutugipoultry@gmail.com',
    phone: '0706972161',
    county: 'Embu HQ',
    farmFocus: 'Hatchery & Farmer Training',
    avatar: '/logo.png',
    role: 'admin',
    status: 'approved',
    createdAt: '2026-01-01T00:00:00Z',
    approvedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-mwangi',
    name: 'James Mwangi',
    email: 'james.mwangi@gmail.com',
    phone: '0712345678',
    county: 'Embu',
    farmFocus: '500 Kuroiler Layers',
    avatar: '',
    role: 'farmer',
    status: 'approved',
    createdAt: '2026-06-01T09:00:00Z',
    approvedAt: '2026-06-01T09:30:00Z',
  },
  {
    id: 'user-wanjiru',
    name: 'Mary Wanjiru',
    email: 'mary.wanjiru254@yahoo.com',
    phone: '0723456789',
    county: 'Nairobi',
    farmFocus: '1,000 Cobb 500 Broilers',
    avatar: '',
    role: 'farmer',
    status: 'approved',
    createdAt: '2026-06-02T10:15:00Z',
    approvedAt: '2026-06-02T10:30:00Z',
  },
  {
    id: 'user-kamau',
    name: 'Peter Kamau',
    email: 'peter.kamau@outlook.com',
    phone: '0734567890',
    county: 'Nakuru',
    farmFocus: '300 ISA Brown Layers',
    avatar: '',
    role: 'farmer',
    status: 'pending_approval',
    createdAt: '2026-06-10T11:00:00Z',
  }
];

export const DEFAULT_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    channelId: 'general-lounge',
    senderId: 'admin-cucu',
    senderName: 'Cucu Mutugi Admin',
    senderRole: 'admin',
    senderAvatar: '/logo.png',
    senderCounty: 'Embu HQ',
    content: 'Karibuni wakulima wote! Welcome to the Cucu Mutugi Poultry Farmers Lounge. Share your poultry milestones, ask questions, and network with fellow poultry farmers across Kenya! 🐔🌾',
    createdAt: '2026-06-10T08:00:00Z',
    pinned: true,
    reactions: { '👍': ['user-mwangi', 'user-wanjiru'], '❤️': ['user-mwangi'] },
  },
  {
    id: 'msg-2',
    channelId: 'general-lounge',
    senderId: 'user-mwangi',
    senderName: 'James Mwangi',
    senderRole: 'farmer',
    senderCounty: 'Embu',
    content: 'Habari za asubuhi! The 300 Kuroiler chicks I received on Wednesday arrived in great health. Mortality rate after 7 days is 0%! Proper temperature and glucose water during the first 6 hours makes a big difference.',
    createdAt: '2026-06-10T08:15:00Z',
    reactions: { '👏': ['admin-cucu', 'user-wanjiru'], '🔥': ['user-wanjiru'] },
  },
  {
    id: 'msg-3',
    channelId: 'chicks-brooding',
    senderId: 'user-wanjiru',
    senderName: 'Mary Wanjiru',
    senderRole: 'farmer',
    senderCounty: 'Nairobi',
    content: 'Quick question for the group: In chilly weather like Nairobi this week, what is your recommended charcoal jiko vs infrared bulb setup for 500 day-old broiler chicks?',
    createdAt: '2026-06-10T09:00:00Z',
  },
  {
    id: 'msg-4',
    channelId: 'chicks-brooding',
    senderId: 'admin-cucu',
    senderName: 'Cucu Mutugi Admin',
    senderRole: 'admin',
    senderAvatar: '/logo.png',
    senderCounty: 'Embu HQ',
    content: 'Great question Mary! For 500 chicks, we recommend maintaining 32°C–35°C at chick level during week 1. Two 250W infrared heat lamps plus a circular cardboard guard ring prevent huddling and drafts. Here is our official brooding temperature chart for reference:',
    attachments: [
      {
        type: 'image',
        url: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.38.20%20PM.jpeg',
        filename: 'brooding-guide-chart.jpg'
      }
    ],
    createdAt: '2026-06-10T09:05:00Z',
    reactions: { '❤️': ['user-wanjiru', 'user-mwangi'] }
  }
];

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', date: '2026-06-10', type: 'income', category: 'Chicks Sale', amount: 36000, paymentMethod: 'M-Pesa', customerOrVendor: 'James Mwangi', reference: 'MPX987123', notes: '300 Kuroiler chicks', createdAt: '2026-06-10T08:30:00Z' },
  { id: 'tx-2', date: '2026-06-10', type: 'expense', category: 'Feed Purchase', amount: 14500, paymentMethod: 'M-Pesa', customerOrVendor: 'Unga Feeds Embu', reference: 'RCP-5421', notes: '5 bags chick mash', createdAt: '2026-06-10T10:15:00Z' },
  { id: 'tx-3', date: '2026-06-09', type: 'income', category: 'Egg Sales', amount: 8400, paymentMethod: 'Cash', customerOrVendor: 'Wanjiku Hotel', reference: 'CSH-09', notes: '24 trays kienyeji eggs', createdAt: '2026-06-09T14:20:00Z' },
  { id: 'tx-4', date: '2026-06-09', type: 'expense', category: 'Vaccines & Meds', amount: 3200, paymentMethod: 'M-Pesa', customerOrVendor: 'Agrovet Supplies', reference: 'AGR-771', notes: 'Gumboro & Newcastle vaccines', createdAt: '2026-06-09T16:00:00Z' },
  { id: 'tx-5', date: '2026-06-08', type: 'income', category: 'Chicks Sale', amount: 22000, paymentMethod: 'Bank Transfer', customerOrVendor: 'Peter Kamau', reference: 'BNK-3341', notes: '200 ISA Brown layers', createdAt: '2026-06-08T11:00:00Z' },
];

export const DEFAULT_ACTIVITIES: CustomerActivity[] = [
  { id: 'act-1', type: 'search', query: 'ISA Brown day old chicks price', page: '/products', timestamp: '2026-06-10T09:12:00Z' },
  { id: 'act-2', type: 'button_click', buttonName: 'Order Kuroiler Chicks', page: '/products', timestamp: '2026-06-10T09:15:00Z' },
  { id: 'act-3', type: 'email_captured', email: 'farmer.mwangi@gmail.com', page: '/contact', metadata: { source: 'Brooding Guide Request' }, timestamp: '2026-06-10T10:05:00Z' },
  { id: 'act-4', type: 'button_click', buttonName: 'WhatsApp Inquiry Button', page: '/', timestamp: '2026-06-10T11:22:00Z' },
  { id: 'act-5', type: 'search', query: 'kienyeji chicken feeding guide', page: '/resources', timestamp: '2026-06-10T12:00:00Z' },
  { id: 'act-6', type: 'email_captured', email: 'grace.achieng254@yahoo.com', page: '/resources/feeding-programme', metadata: { source: 'Newsletter' }, timestamp: '2026-06-09T15:30:00Z' },
];

export const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Kuroiler Chicks', category: 'Kienyeji', breed: 'Kuroiler', price: 120, stock: 500, image: '', description: 'Fast-growing dual-purpose breed. Excellent for both eggs and meat. Day old: KES 120 | 1 week: KES 160 | 2 weeks: KES 200 | 3 weeks: KES 250 | 1 month: KES 300', ageRange: '1 day – 1 month', vaccinated: true, active: true, createdAt: '2026-06-01' },
  { id: 'p2', name: 'Sasso Chicks', category: 'Kienyeji', breed: 'Sasso', price: 120, stock: 300, image: '', description: 'Hardy breed with rich flavour, high demand in the local market. Day old: KES 120 | 1 week: KES 160 | 2 weeks: KES 200 | 3 weeks: KES 250 | 1 month: KES 300', ageRange: '1 day – 1 month', vaccinated: true, active: true, createdAt: '2026-06-01' },
  { id: 'p3', name: 'Kenbro Chicks', category: 'Kienyeji', breed: 'Kenbro', price: 120, stock: 400, image: '', description: 'Adaptable dual-purpose breed, excellent feed conversion ratio. Day old: KES 120 | 1 week: KES 160 | 2 weeks: KES 200 | 3 weeks: KES 250 | 1 month: KES 300', ageRange: '1 day – 1 month', vaccinated: true, active: true, createdAt: '2026-06-01' },
  { id: 'p4', name: 'Broiler Chicks (Cobb 500)', category: 'Broilers', breed: 'Cobb 500', price: 105, stock: 800, image: '', description: 'Top commercial broiler. Ready for market in 6 weeks. Day old chick: KES 105.', ageRange: '1 day old', vaccinated: true, active: true, createdAt: '2026-06-02' },
  { id: 'p5', name: 'Layer Chicks (ISA Brown)', category: 'Layers', breed: 'ISA Brown', price: 160, stock: 600, image: '', description: 'High-producing layer breed, up to 320 eggs per year. Day old chick: KES 160.', ageRange: '1 day old', vaccinated: true, active: true, createdAt: '2026-06-02' },
  { id: 'p6', name: 'Rainbow Rooster', category: 'Kienyeji', breed: 'Rainbow Rooster', price: 120, stock: 200, image: '', description: 'Colourful, hardy, and popular in local markets. Day old: KES 120 | 1 week: KES 160 | 2 weeks: KES 200 | 3 weeks: KES 250 | 1 month: KES 300', ageRange: '1 day – 1 month', vaccinated: true, active: true, createdAt: '2026-06-03' },
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
    title: 'New Chicks — Ready for Dispatch!',
    mediaUrl: '/media/owner-with-chicks-2.jpg',
    mediaType: 'image',
    category: 'New Chicks',
    description: 'ISA Brown Layer Chicks ready for dispatch this week. Fully vaccinated!',
    actionText: 'Order Now',
    actionUrl: '/products',
    poll: {
      question: 'Are you stocking layers or broilers this month?',
      options: [
        { text: 'ISA Brown Layers', votes: 12 },
        { text: 'Cobb 500 Broilers', votes: 8 },
        { text: 'Kuroiler Kienyeji', votes: 15 }
      ]
    },
    likes: 0,
    views: 0,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    featured: false,
  },
  {
    id: 's2',
    title: 'Pre-Vaccinated Chicks — Team at Work',
    mediaUrl: '/media/team-delivery-1.jpg',
    mediaType: 'image',
    category: 'Vaccination',
    description: 'Every chick from Cucu Mutugi Poultry undergoes strict veterinary vaccination protocol.',
    actionText: 'Vaccination Schedule',
    actionUrl: '/resources',
    likes: 0,
    views: 0,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    featured: false,
  }
];

export const DEFAULT_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'Chick Brooding & Care Walkthrough',
    description: 'Walkthrough of young chicks inside our brooding facility undergoing feeding and monitoring.',
    videoUrl: '/media/gallery/CHICK%202.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.38.20%20PM.jpeg',
    category: 'Farm Tours',
    views: 0,
    likes: 0,
    duration: '00:30',
    createdAt: '2026-08-02',
    featured: false,
  },
  {
    id: 'v2',
    title: 'Cucu Mutugi Fly Logo & Animated Brand Video',
    description: 'Official brand animation and introduction for Cucu Mutugi Poultry Farm.',
    videoUrl: '/media/gallery/FLY%20LOGO.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.38.27%20PM.jpeg',
    category: 'Daily Activities',
    views: 0,
    likes: 0,
    duration: '00:25',
    createdAt: '2026-08-02',
    featured: false,
  },
  {
    id: 'v3',
    title: 'Kitui County Delivery Dispatch',
    description: 'Safe delivery of healthy pre-vaccinated chicks to our valued poultry farmers in Kitui.',
    videoUrl: '/media/gallery/KITUI%20DELIVERY.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.44.53%20PM.jpeg',
    category: 'Customer Visits',
    views: 0,
    likes: 0,
    duration: '00:28',
    createdAt: '2026-08-02',
    featured: false,
  },
  {
    id: 'v4',
    title: 'Flock Health & Feeding Session',
    description: 'Daily feeding routine and active flock monitoring at Cucu Mutugi Poultry.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%203.06.13%20PM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.44.58%20PM.jpeg',
    category: 'Chicken Feeding',
    views: 0,
    likes: 0,
    duration: '00:35',
    createdAt: '2026-08-02',
  },
  {
    id: 'v5',
    title: 'Chick Brooder Temperature Setup',
    description: 'Setting optimal climate and brooding conditions for newborn chicks.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%203.06.59%20PM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.51.20%20PM%20(1).jpeg',
    category: 'Farm Tours',
    views: 0,
    likes: 0,
    duration: '00:40',
    createdAt: '2026-08-02',
  },
  {
    id: 'v6',
    title: 'Chicks Feeding in Feeder Trays',
    description: 'Observing healthy chick appetite and feeding activity on the farm floor.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%203.07.32%20PM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%209.12.05%20PM.jpeg',
    category: 'Chicken Feeding',
    views: 780,
    likes: 145,
    duration: '00:45',
    createdAt: '2026-08-02',
  },
  {
    id: 'v7',
    title: 'Flock Uniformity & Growth Check',
    description: 'Checking flock uniformity and weight progression during brooding stage.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%203.08.07%20PM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-01-27%20at%208.59.13%20PM.jpeg',
    category: 'Daily Activities',
    views: 860,
    likes: 160,
    duration: '00:32',
    createdAt: '2026-08-02',
  },
  {
    id: 'v8',
    title: 'Poultry House Inspection',
    description: 'Regular sanitation and structural inspection of poultry housing units.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%203.08.48%20PM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-06-04%20at%2021.14.30%20-%20Copy%20(2).jpeg',
    category: 'Construction',
    views: 650,
    likes: 120,
    duration: '00:50',
    createdAt: '2026-08-02',
  },
  {
    id: 'v9',
    title: 'Vaccination Protocol & Administration',
    description: 'Veterinary team administering essential vaccines before customer dispatch.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%203.12.36%20PM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-06-04%20at%2021.18.27%20-%20Copy.jpeg',
    category: 'Vaccination',
    views: 1450,
    likes: 310,
    duration: '01:10',
    createdAt: '2026-08-02',
    featured: true,
  },
  {
    id: 'v10',
    title: 'Chick Box Packaging & Ventilated Dispatch',
    description: 'Careful loading of ventilated chick transport boxes for customer transit.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%203.14.38%20PM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-06-04%20at%2021.18.28.jpeg',
    category: 'Customer Visits',
    views: 1320,
    likes: 270,
    duration: '01:05',
    createdAt: '2026-08-02',
  },
  {
    id: 'v11',
    title: 'Farmer Reception & Handover',
    description: 'Handing over pre-vaccinated healthy chicks to happy farmers upon arrival.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%203.27.47%20PM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-06-04%20at%2021.18.33%20-%20Copy%20-%20Copy.jpeg',
    category: 'Customer Visits',
    views: 1540,
    likes: 340,
    duration: '01:30',
    createdAt: '2026-08-02',
  },
  {
    id: 'v12',
    title: 'Automatic Drinker System Overview',
    description: 'Ensuring clean, uninterrupted water access through automated drinker lines.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%203.29.52%20PM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-06-05%20at%2008.46.40.jpeg',
    category: 'Equipment',
    views: 920,
    likes: 185,
    duration: '00:55',
    createdAt: '2026-08-02',
  },
  {
    id: 'v13',
    title: 'Improved Kienyeji Flock Showcase',
    description: 'Demonstration of active Kuroiler and Sasso dual-purpose breeds in motion.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%203.39.31%20PM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.09.42%20PM.jpeg',
    category: 'Daily Activities',
    views: 1180,
    likes: 240,
    duration: '01:15',
    createdAt: '2026-08-02',
  },
  {
    id: 'v14',
    title: 'Farm Staff Daily Operations',
    description: 'Behind the scenes with our dedicated poultry management team.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%203.42.39%20PM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.10.50%20PM.jpeg',
    category: 'Farm Tours',
    views: 890,
    likes: 175,
    duration: '00:45',
    createdAt: '2026-08-02',
  },
  {
    id: 'v15',
    title: 'Chicks Brooding Environment Full Video',
    description: 'In-depth footage showing optimal chick warmth and activity levels in our brooder.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%208.12.06%20AM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.11.12%20PM.jpeg',
    category: 'Farm Tours',
    views: 1780,
    likes: 390,
    duration: '02:10',
    createdAt: '2026-08-02',
  },
  {
    id: 'v16',
    title: 'Chick Box Counting & Quality Audit',
    description: 'Quality verification and box counting prior to delivery vehicle departure.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%208.14.38%20AM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.13.12%20PM.jpeg',
    category: 'Customer Visits',
    views: 1100,
    likes: 220,
    duration: '01:00',
    createdAt: '2026-08-02',
  },
  {
    id: 'v17',
    title: 'Chick Vitality & Movement Check',
    description: 'Ensuring high alertness and physical vitality in day-old chick batches.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%208.15.12%20AM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.13.35%20PM.jpeg',
    category: 'Daily Activities',
    views: 1420,
    likes: 290,
    duration: '01:25',
    createdAt: '2026-08-02',
  },
  {
    id: 'v18',
    title: 'Farm Ventilation & Air Flow Demo',
    description: 'Demonstrating fresh airflow management to prevent respiratory issues in poultry.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%208.15.38%20AM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.13.36%20PM.jpeg',
    category: 'Construction',
    views: 980,
    likes: 205,
    duration: '01:18',
    createdAt: '2026-08-02',
  },
  {
    id: 'v19',
    title: 'Delivery Vehicle Loading Procedure',
    description: 'Securing climate-controlled transport boxes in our delivery vans.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%208.17.20%20AM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.20.41%20PM.jpeg',
    category: 'Customer Visits',
    views: 1610,
    likes: 350,
    duration: '01:40',
    createdAt: '2026-08-02',
  },
  {
    id: 'v20',
    title: 'Chick Customer Unboxing Experience',
    description: 'Farmer receiving and unboxing vibrant healthy chicks on their farm.',
    videoUrl: '/media/gallery/WhatsApp%20Video%202026-08-02%20at%208.19.18%20AM.mp4',
    thumbnailUrl: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.26.19%20PM.jpeg',
    category: 'Customer Visits',
    views: 1950,
    likes: 420,
    duration: '02:00',
    createdAt: '2026-08-02',
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


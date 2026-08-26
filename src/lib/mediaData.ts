export interface MediaItem {
  id: string;
  title: string;
  category: 'Chick Care' | 'Deliveries' | 'Farm Tours' | 'Vaccination' | 'Breeds' | 'Branding & Events';
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  description: string;
  date?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export const GALLERY_ITEMS: MediaItem[] = [
  // VIDEOS
  {
    id: 'vid-1',
    title: 'Chick Brooding & Care Walkthrough',
    category: 'Chick Care',
    type: 'video',
    url: '/media/gallery/CHICK 2.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-01-20 at 8.38.20 PM.jpeg',
    description: 'Walkthrough of young chicks inside our brooding facility undergoing feeding and monitoring.',
    date: '2026-08-02'
  },
  {
    id: 'vid-2',
    title: 'Cucu Mutugi Fly Logo & Animated Brand Video',
    category: 'Branding & Events',
    type: 'video',
    url: '/media/gallery/FLY LOGO.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-01-20 at 8.38.27 PM.jpeg',
    description: 'Official brand animation and introduction for Cucu Mutugi Poultry Farm.',
    date: '2026-08-02'
  },
  {
    id: 'vid-3',
    title: 'Kitui County Delivery Dispatch',
    category: 'Deliveries',
    type: 'video',
    url: '/media/gallery/KITUI DELIVERY.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-01-20 at 8.44.53 PM.jpeg',
    description: 'Safe delivery of healthy pre-vaccinated chicks to our valued poultry farmers in Kitui.',
    date: '2026-08-02'
  },
  {
    id: 'vid-4',
    title: 'Flock Health & Feeding Session',
    category: 'Chick Care',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 3.06.13 PM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-01-20 at 8.44.58 PM.jpeg',
    description: 'Daily feeding routine and active flock monitoring at Cucu Mutugi Poultry.',
    date: '2026-08-02'
  },
  {
    id: 'vid-5',
    title: 'Chick Brooder Temperature Setup',
    category: 'Chick Care',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 3.06.59 PM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-01-20 at 8.51.20 PM (1).jpeg',
    description: 'Setting optimal climate and brooding conditions for newborn chicks.',
    date: '2026-08-02'
  },
  {
    id: 'vid-6',
    title: 'Chicks Feeding in Feeder Trays',
    category: 'Chick Care',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 3.07.32 PM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-01-20 at 9.12.05 PM.jpeg',
    description: 'Observing healthy chick appetite and feeding activity on the farm floor.',
    date: '2026-08-02'
  },
  {
    id: 'vid-7',
    title: 'Flock Uniformity & Growth Check',
    category: 'Chick Care',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 3.08.07 PM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-01-27 at 8.59.13 PM.jpeg',
    description: 'Checking flock uniformity and weight progression during brooding stage.',
    date: '2026-08-02'
  },
  {
    id: 'vid-8',
    title: 'Poultry House Inspection',
    category: 'Farm Tours',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 3.08.48 PM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-06-04 at 21.14.30 - Copy (2).jpeg',
    description: 'Regular sanitation and structural inspection of poultry housing units.',
    date: '2026-08-02'
  },
  {
    id: 'vid-9',
    title: 'Vaccination Protocol & Administration',
    category: 'Vaccination',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 3.12.36 PM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-06-04 at 21.18.27 - Copy.jpeg',
    description: 'Veterinary team administering essential vaccines before customer dispatch.',
    date: '2026-08-02'
  },
  {
    id: 'vid-10',
    title: 'Chick Box Packaging & Ventilated Dispatch',
    category: 'Deliveries',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 3.14.38 PM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-06-04 at 21.18.28.jpeg',
    description: 'Careful loading of ventilated chick transport boxes for customer transit.',
    date: '2026-08-02'
  },
  {
    id: 'vid-11',
    title: 'Farmer Reception & Handover',
    category: 'Deliveries',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 3.27.47 PM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-06-04 at 21.18.33 - Copy - Copy.jpeg',
    description: 'Handing over pre-vaccinated healthy chicks to happy farmers upon arrival.',
    date: '2026-08-02'
  },
  {
    id: 'vid-12',
    title: 'Automatic Drinker System Overview',
    category: 'Farm Tours',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 3.29.52 PM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-06-05 at 08.46.40.jpeg',
    description: 'Ensuring clean, uninterrupted water access through automated drinker lines.',
    date: '2026-08-02'
  },
  {
    id: 'vid-13',
    title: 'Improved Kienyeji Flock Showcase',
    category: 'Breeds',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 3.39.31 PM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-08-02 at 3.09.42 PM.jpeg',
    description: 'Demonstration of active Kuroiler and Sasso dual-purpose breeds in motion.',
    date: '2026-08-02'
  },
  {
    id: 'vid-14',
    title: 'Farm Staff Daily Operations',
    category: 'Farm Tours',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 3.42.39 PM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-08-02 at 3.10.50 PM.jpeg',
    description: 'Behind the scenes with our dedicated poultry management team.',
    date: '2026-08-02'
  },
  {
    id: 'vid-15',
    title: 'Chicks Brooding Environment Full Video',
    category: 'Chick Care',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 8.12.06 AM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-08-02 at 3.11.12 PM.jpeg',
    description: 'In-depth footage showing optimal chick warmth and activity levels in our brooder.',
    date: '2026-08-02'
  },
  {
    id: 'vid-16',
    title: 'Chick Box Counting & Quality Audit',
    category: 'Deliveries',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 8.14.38 AM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-08-02 at 3.13.12 PM.jpeg',
    description: 'Quality verification and box counting prior to delivery vehicle departure.',
    date: '2026-08-02'
  },
  {
    id: 'vid-17',
    title: 'Chick Vitality & Movement Check',
    category: 'Chick Care',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 8.15.12 AM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-08-02 at 3.13.35 PM.jpeg',
    description: 'Ensuring high alertness and physical vitality in day-old chick batches.',
    date: '2026-08-02'
  },
  {
    id: 'vid-18',
    title: 'Farm Ventilation & Air Flow Demo',
    category: 'Farm Tours',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 8.15.38 AM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-08-02 at 3.13.36 PM.jpeg',
    description: 'Demonstrating fresh airflow management to prevent respiratory issues in poultry.',
    date: '2026-08-02'
  },
  {
    id: 'vid-19',
    title: 'Delivery Vehicle Loading Procedure',
    category: 'Deliveries',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 8.17.20 AM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-08-02 at 3.20.41 PM.jpeg',
    description: 'Securing climate-controlled transport boxes in our delivery vans.',
    date: '2026-08-02'
  },
  {
    id: 'vid-20',
    title: 'Chick Customer Unboxing Experience',
    category: 'Deliveries',
    type: 'video',
    url: '/media/gallery/WhatsApp Video 2026-08-02 at 8.19.18 AM.mp4',
    thumbnail: '/media/gallery/WhatsApp Image 2026-08-02 at 3.26.19 PM.jpeg',
    description: 'Farmer receiving and unboxing vibrant healthy chicks on their farm.',
    date: '2026-08-02'
  },

  // IMAGES
  {
    id: 'img-1',
    title: 'Day-Old Chicks in Brooder Pen',
    category: 'Chick Care',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.38.20%20PM.jpeg',
    description: 'Vibrant, healthy day-old chicks resting and feeding under warm brooding lights.',
    date: '2026-01-20'
  },
  {
    id: 'img-2',
    title: 'High-Density Chick Feeding Area',
    category: 'Chick Care',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.38.27%20PM.jpeg',
    description: 'Chicks feeding actively on starter feed trays inside the brood unit.',
    date: '2026-01-20'
  },
  {
    id: 'img-3',
    title: 'Team Member Holding Chicks',
    category: 'Farm Tours',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.44.53%20PM.jpeg',
    description: 'Friendly hands-on handling of chicks by Cucu Mutugi staff.',
    date: '2026-01-20'
  },
  {
    id: 'img-4',
    title: 'Pre-Vaccinated Chicks Display',
    category: 'Vaccination',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.44.58%20PM.jpeg',
    description: 'Chicks sorted and ready following Mareks and Newcastle vaccination.',
    date: '2026-01-20'
  },
  {
    id: 'img-5',
    title: 'Cucu Mutugi Exhibition Banner & Stand',
    category: 'Branding & Events',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.51.20%20PM%20(1).jpeg',
    description: 'Cucu Mutugi Poultry showcase stand at agricultural trade show.',
    date: '2026-01-20'
  },
  {
    id: 'img-6',
    title: 'Poultry Farm Promotional Flyer',
    category: 'Branding & Events',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-01-20%20at%209.12.05%20PM.jpeg',
    description: 'Official product flyer detailing chick pricing, breeds, and free delivery locations.',
    date: '2026-01-20'
  },
  {
    id: 'img-7',
    title: '5 Breeds Chick Lineup',
    category: 'Breeds',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-01-27%20at%208.59.13%20PM.jpeg',
    description: 'Comparing Kuroiler, Sasso, Kenbro, Rainbow Rooster, and Layer chicks side by side.',
    date: '2026-01-27'
  },
  {
    id: 'img-8',
    title: 'Cucu Mutugi Branded Apparel & Staff',
    category: 'Branding & Events',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-06-04%20at%2021.14.30%20-%20Copy%20(2).jpeg',
    description: 'Farm manager proudly wearing Cucu Mutugi signature uniform.',
    date: '2026-06-04'
  },
  {
    id: 'img-9',
    title: 'Team at Farm Inspection',
    category: 'Farm Tours',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-06-04%20at%2021.18.27%20-%20Copy.jpeg',
    description: 'Technical support staff conducting routine farm checks.',
    date: '2026-06-04'
  },
  {
    id: 'img-10',
    title: 'Branded Team Gathering at Farm',
    category: 'Farm Tours',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-06-04%20at%2021.18.28.jpeg',
    description: 'Our team working together to inspect and manage flock housing.',
    date: '2026-06-04'
  },
  {
    id: 'img-11',
    title: 'Cucu Mutugi Dedicated Staff Team',
    category: 'Branding & Events',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-06-04%20at%2021.18.33%20-%20Copy%20-%20Copy.jpeg',
    description: 'The passionate Cucu Mutugi team committed to farmer success.',
    date: '2026-06-04'
  },
  {
    id: 'img-12',
    title: 'Single Team Member at Farm Facility',
    category: 'Farm Tours',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-06-05%20at%2008.46.40.jpeg',
    description: 'Farm worker overseeing brooding operations in Embu HQ.',
    date: '2026-06-05'
  },
  {
    id: 'img-13',
    title: 'Chicks Feeding Close-Up',
    category: 'Chick Care',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.09.42%20PM.jpeg',
    description: 'Close-up detail of vibrant, healthy chicks eating nutrient-rich mash.',
    date: '2026-08-02'
  },
  {
    id: 'img-14',
    title: 'Uniform Chick Flock Overview',
    category: 'Chick Care',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.10.50%20PM.jpeg',
    description: 'Uniform chick distribution across warm litter flooring.',
    date: '2026-08-02'
  },
  {
    id: 'img-15',
    title: 'Healthy Broiler Chicks Batch',
    category: 'Breeds',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.11.12%20PM.jpeg',
    description: 'Fast-growing Cobb 500 broiler chicks ready for dispatch.',
    date: '2026-08-02'
  },
  {
    id: 'img-16',
    title: 'Chicks under Drinker Nipple System',
    category: 'Chick Care',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.13.12%20PM.jpeg',
    description: 'Chicks accessing clean water via automatic nipple drinking line.',
    date: '2026-08-02'
  },
  {
    id: 'img-17',
    title: 'Layer Chicks Resting',
    category: 'Breeds',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.13.35%20PM.jpeg',
    description: 'ISA Brown layer chicks in comfortable climate-controlled brooder.',
    date: '2026-08-02'
  },
  {
    id: 'img-18',
    title: 'Chick Health & Feathers Audit',
    category: 'Vaccination',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.13.36%20PM.jpeg',
    description: 'Checking chick feathering quality and active alertness.',
    date: '2026-08-02'
  },
  {
    id: 'img-19',
    title: 'Pre-Dispatch Chick Count in Pen',
    category: 'Deliveries',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.20.41%20PM.jpeg',
    description: 'Counting and boxing chicks prior to countrywide transport dispatch.',
    date: '2026-08-02'
  },
  {
    id: 'img-20',
    title: 'Improved Kienyeji Kuroiler Chicks',
    category: 'Breeds',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.26.19%20PM.jpeg',
    description: 'Robust Kuroiler chicks thriving on starter ration.',
    date: '2026-08-02'
  },
  {
    id: 'img-21',
    title: 'Flock Active Feeding & Watering',
    category: 'Chick Care',
    type: 'image',
    url: '/media/gallery/WhatsApp%20Image%202026-08-02%20at%203.31.34%20PM.jpeg',
    description: 'Wide shot of brooding house with active feeding and watering.',
    date: '2026-08-02'
  },
  {
    id: 'img-22',
    title: 'Cucu Mutugi Halal & Watermark Logo',
    category: 'Branding & Events',
    type: 'image',
    url: '/media/gallery/islamic%20water%20mark.png',
    description: 'Certified Islamic Halal quality mark for Cucu Mutugi Poultry.',
    date: '2026-08-02'
  }
];

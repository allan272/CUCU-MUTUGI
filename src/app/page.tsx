import Image from 'next/image';
import Link from 'next/link';
import {
  Sprout,
  ShoppingBag,
  LayoutDashboard,
  Bird,
  Truck,
  Syringe,
  BookOpen,
  Smartphone,
  Award,
  Sparkles,
  Phone,
  MapPin,
  MessageCircle,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col bg-[#FFFDF0]">

      {/* ===== HERO SECTION - Animated Live Background (Signature Warm Yellow) ===== */}
      <section className="animated-bg relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b-4 border-amber-500">
        {/* Floating Particles */}
        <div className="particles">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`} />
          ))}
        </div>

        {/* Animated rings behind logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full border border-slate-900/10 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute w-72 h-72 rounded-full border border-slate-900/15" style={{ animation: 'ripple 4s ease-out infinite 1s' }} />
          <div className="absolute w-48 h-48 rounded-full border border-slate-900/20" style={{ animation: 'ripple 4s ease-out infinite 2s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-slate-900 px-4 py-20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden ring-4 ring-slate-900/20 shadow-2xl glow-yellow bg-white p-2">
              <Image
                src="/logo.png"
                alt="CUCU MUTUGI POULTRY"
                fill
                className="object-contain p-4"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-4 leading-tight tracking-tight drop-shadow-sm text-slate-950">
            CUCU MUTUGI
            <span className="block text-slate-900 font-extrabold mt-1">
              POULTRY
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-900 mb-4 font-bold max-w-2xl mx-auto flex items-center justify-center gap-2">
            Growing Farmers, Building Prosperity <Sprout className="h-6 w-6 text-slate-900 inline" />
          </p>
          <p className="text-slate-800 mb-10 max-w-xl mx-auto font-semibold text-lg">
            Your Trusted Partner for Pre-Vaccinated Kienyeji, Broilers & Layers — Delivered Free Across Kenya
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary text-lg flex items-center justify-center gap-2 shadow-xl">
              <ShoppingBag className="h-5 w-5 text-amber-400" /> Order Chicks Now
            </Link>
            <Link href="/dashboard" className="btn-outline text-lg flex items-center justify-center gap-2 shadow-md">
              <LayoutDashboard className="h-5 w-5 text-slate-900" /> Farmer Dashboard
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { val: '14+', label: 'Counties Served' },
              { val: '5+', label: 'Breeds Available' },
              { val: 'FREE', label: 'Delivery' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-3 text-center border border-slate-900/15">
                <div className="text-2xl font-black text-slate-950">{stat.val}</div>
                <div className="text-xs text-slate-900 font-bold mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="wave-container">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FFFDF0"/>
          </svg>
        </div>
      </section>

      {/* ===== WHAT WE OFFER ===== */}
      <section className="section-gradient py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-3">What We Offer</h2>
            <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-4" />
            <p className="text-slate-700 max-w-xl mx-auto font-medium text-lg">Everything you need to start and succeed in poultry farming</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Bird, title: 'Improved Kienyeji Chicks', desc: 'Kuroiler, KARI, Sasso, Rainbow Rooster & Kenbro — pre-vaccinated and healthy.', color: 'from-amber-400 to-amber-500' },
              { icon: Bird, title: 'Broilers & Layers', desc: 'Day-old to 1-month-old broilers and layers, ready for your farm.', color: 'from-amber-500 to-amber-600' },
              { icon: Truck, title: 'Free Countrywide Delivery', desc: 'We deliver to all major counties across Kenya — at no extra cost to you.', color: 'from-amber-600 to-slate-900' },
              { icon: Syringe, title: 'Fully Pre-Vaccinated', desc: 'Every chick is vaccinated before delivery, giving your flock the healthiest start.', color: 'from-slate-900 to-amber-500' },
              { icon: BookOpen, title: 'Farmer Support', desc: 'Expert guidance on brooding, feeding, disease management and farm records.', color: 'from-amber-500 to-amber-400' },
              { icon: Smartphone, title: 'Farmer Dashboard', desc: 'Manage your flocks, track profit, log feed and mortality — all in one place.', color: 'from-amber-400 to-slate-900' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass-white rounded-2xl p-8 card-hover border border-amber-200 shadow-md">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-slate-950 mb-5 shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-700 leading-relaxed font-medium">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== OUR BREEDS ===== */}
      <section className="py-20 px-4 bg-white border-y border-amber-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-3">Our Breeds</h2>
            <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-4" />
            <p className="text-slate-700 font-medium text-lg">Pre-vaccinated and ready for your farm</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Kuroiler', icon: Bird, tag: 'Dual Purpose' },
              { name: 'KARI', icon: Bird, tag: 'Indigenous' },
              { name: 'Sasso', icon: Bird, tag: 'Fast Growing' },
              { name: 'Rainbow Rooster', icon: Sparkles, tag: 'Colorful' },
              { name: 'Kenbro', icon: Award, tag: 'Hardy' },
            ].map((breed) => {
              const Icon = breed.icon;
              return (
                <div key={breed.name} className="text-center p-6 rounded-2xl card-hover cursor-pointer border-2 border-amber-200 hover:border-amber-500 bg-amber-50/50 flex flex-col items-center justify-center shadow-sm">
                  <div className="text-slate-950 mb-3 bg-amber-400 p-3 rounded-full shadow-md">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{breed.name}</h3>
                  <span className="text-xs text-slate-900 font-black bg-amber-200 px-2.5 py-1 rounded-full mt-2 inline-block uppercase tracking-wider">{breed.tag}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== REAL PHOTO GALLERY ===== */}
      <section className="py-20 px-4 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-amber-400 mb-3">Behind the Scenes</h2>
            <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-4" />
            <p className="text-slate-300 font-medium text-lg">Real moments from our farm, team & deliveries</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: '/media/owner-with-chicks-1.jpg', alt: 'Owner with newborn chicks', label: 'Day-Old Chicks', span: 'md:col-span-2 md:row-span-2' },
              { src: '/media/owner-banner.jpg', alt: 'Owner with Cucu Mutugi banner', label: 'At the Exhibition', span: '' },
              { src: '/media/owner-flag.jpg', alt: 'Owner with Cucu Mutugi flag', label: 'Cucu Mutugi Brand', span: '' },
              { src: '/media/team-delivery-1.jpg', alt: 'Team with chick boxes ready for delivery', label: 'Delivery Day', span: '' },
              { src: '/media/team-delivery-2.jpg', alt: 'Team holding chick packaging boxes', label: 'Packaging & Dispatch', span: '' },
              { src: '/media/chicks-lineup.jpg', alt: 'Five breeds of day-old chicks', label: '5 Breeds Side by Side', span: 'md:col-span-2' },
            ].map((photo) => (
              <div key={photo.src} className={`relative overflow-hidden rounded-2xl group cursor-pointer ${photo.span}`}>
                <div className="relative w-full h-48 md:h-full min-h-[180px]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-amber-500/90 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {photo.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Team photos row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              { src: '/media/team-farm-4.jpg', alt: 'Team in branded uniforms at farm', label: 'Our Team' },
              { src: '/media/team-farm-2.jpg', alt: 'Team showing Cucu Mutugi polos', label: 'Branded Team' },
              { src: '/media/team-farm-1.jpg', alt: 'Team member at farm', label: 'At the Farm' },
            ].map((photo) => (
              <div key={photo.src} className="relative overflow-hidden rounded-2xl group cursor-pointer h-52">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-amber-500/90 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ANIMATED CTA BANNER ===== */}
      <section className="animated-bg relative py-20 px-4 overflow-hidden border-y-4 border-amber-500">
        <div className="particles">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className={`particle particle-${i + 1}`} />)}
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center text-slate-900">
          <h2 className="text-4xl font-black mb-4 text-slate-950">Ready to Start Your Poultry Journey?</h2>
          <p className="text-slate-900 text-xl font-bold mb-8">Join thousands of successful Kenyan farmers who trust CUCU MUTUGI POULTRY.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-lg flex items-center justify-center gap-2 shadow-xl">
              <Phone className="h-5 w-5 text-amber-400" /> Contact Us Today
            </Link>
            <Link href="/resources" className="btn-outline text-lg flex items-center justify-center gap-2 shadow-md">
              <BookOpen className="h-5 w-5 text-slate-900" /> Read Farmer Guides
            </Link>
          </div>
        </div>
      </section>

      {/* ===== LOCATION COVERAGE ===== */}
      <section className="section-gradient py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-3">Where We Deliver</h2>
            <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-4" />
            <p className="text-slate-700 font-medium text-lg">Free countrywide delivery to major towns and counties</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Embu', 'Kirinyaga', 'Meru', 'Nyeri', 'Tharaka Nithi', 'Kitale', 'Kitui', 'Machakos', 'Eldoret', 'Rongo', 'Bungoma', 'Nairobi', 'Naivasha', 'Nakuru'].map((county) => (
              <span key={county} className="px-4 py-2 bg-white rounded-full text-slate-900 font-bold text-sm border border-amber-300 shadow-sm hover:shadow-md hover:border-amber-500 hover:bg-amber-100 card-hover cursor-default flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-amber-600" /> {county}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHATSAPP FLOATING BUTTON ===== */}
      <a
        href="https://wa.me/254706972161?text=Hello%2C+I+want+to+order+chicks"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 text-white"
        title="WhatsApp Us"
        style={{ boxShadow: '0 0 0 0 rgba(37,211,102,0.7)', animation: 'pulse-green 2s infinite' }}
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}

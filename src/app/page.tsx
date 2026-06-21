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
    <div className="flex flex-col">
      {/* ===== HERO SECTION - Animated Live Background ===== */}
      <section className="animated-bg relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Floating Particles */}
        <div className="particles">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`} />
          ))}
        </div>

        {/* Animated rings behind logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full border border-white/10 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute w-72 h-72 rounded-full border border-white/15" style={{ animation: 'ripple 4s ease-out infinite 1s' }} />
          <div className="absolute w-48 h-48 rounded-full border border-white/20" style={{ animation: 'ripple 4s ease-out infinite 2s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 py-20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden ring-4 ring-white/30 shadow-2xl glow-blue"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
              <Image
                src="/logo.png"
                alt="CUCU MUTUGI POULTRY"
                fill
                className="object-contain p-4"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            CUCU MUTUGI
            <span className="block text-aqua-light" style={{ textShadow: '0 0 30px rgba(0,188,212,0.8)' }}>
              POULTRY
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-4 font-light max-w-2xl mx-auto flex items-center justify-center gap-2">
            Growing Farmers, Building Prosperity <Sprout className="h-6 w-6 text-green-300 inline" />
          </p>
          <p className="text-blue-200 mb-10 max-w-xl mx-auto">
            Your Trusted Partner for Pre-Vaccinated Kienyeji, Broilers & Layers — Delivered Free Across Kenya
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary text-lg flex items-center justify-center gap-2">
              <ShoppingBag className="h-5 w-5" /> Order Chicks Now
            </Link>
            <Link href="/dashboard" className="btn-outline text-lg flex items-center justify-center gap-2">
              <LayoutDashboard className="h-5 w-5" /> Farmer Dashboard
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { val: '14+', label: 'Counties Served' },
              { val: '5+', label: 'Breeds Available' },
              { val: 'FREE', label: 'Delivery' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-3 text-center">
                <div className="text-2xl font-extrabold text-white">{stat.val}</div>
                <div className="text-xs text-blue-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="wave-container">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F0F8FF"/>
          </svg>
        </div>
      </section>

      {/* ===== WHAT WE OFFER ===== */}
      <section className="section-gradient py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gradient mb-3">What We Offer</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Everything you need to start and succeed in poultry farming</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Bird, title: 'Improved Kienyeji Chicks', desc: 'Kuroiler, KARI, Sasso, Rainbow Rooster & Kenbro — pre-vaccinated and healthy.', color: 'from-blue-500 to-aqua' },
              { icon: Bird, title: 'Broilers & Layers', desc: 'Day-old to 1-month-old broilers and layers, ready for your farm.', color: 'from-aqua to-teal' },
              { icon: Truck, title: 'Free Countrywide Delivery', desc: 'We deliver to all major counties across Kenya — at no extra cost to you.', color: 'from-teal to-primary' },
              { icon: Syringe, title: 'Fully Pre-Vaccinated', desc: 'Every chick is vaccinated before delivery, giving your flock the healthiest start.', color: 'from-primary to-blue-500' },
              { icon: BookOpen, title: 'Farmer Support', desc: 'Expert guidance on brooding, feeding, disease management and farm records.', color: 'from-blue-600 to-aqua-dark' },
              { icon: Smartphone, title: 'Farmer Dashboard', desc: 'Manage your flocks, track profit, log feed and mortality — all in one place.', color: 'from-aqua-dark to-primary-dark' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass-white rounded-2xl p-8 card-hover border border-blue-100">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-5 shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== OUR BREEDS ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gradient mb-3">Our Breeds</h2>
            <p className="text-gray-600">Pre-vaccinated and ready for your farm</p>
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
                <div key={breed.name} className="text-center p-6 rounded-2xl card-hover cursor-pointer border-2 border-blue-50 hover:border-aqua bg-gradient-to-b from-white to-blue-50 flex flex-col items-center justify-center">
                  <div className="text-blue-500 mb-3 bg-blue-50 p-3 rounded-full">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-primary">{breed.name}</h3>
                  <span className="text-xs text-aqua font-semibold bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block">{breed.tag}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ANIMATED CTA BANNER ===== */}
      <section className="animated-bg relative py-20 px-4 overflow-hidden">
        <div className="particles">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className={`particle particle-${i + 1}`} />)}
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4">Ready to Start Your Poultry Journey?</h2>
          <p className="text-blue-100 text-xl mb-8">Join thousands of successful Kenyan farmers who trust CUCU MUTUGI POULTRY.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-lg flex items-center justify-center gap-2">
              <Phone className="h-5 w-5" /> Contact Us Today
            </Link>
            <Link href="/resources" className="btn-outline text-lg flex items-center justify-center gap-2">
              <BookOpen className="h-5 w-5" /> Read Farmer Guides
            </Link>
          </div>
        </div>
      </section>

      {/* ===== LOCATION COVERAGE ===== */}
      <section className="section-gradient py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-gradient mb-3">Where We Deliver</h2>
            <p className="text-gray-600">Free countrywide delivery to major towns and counties</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Embu', 'Kirinyaga', 'Meru', 'Nyeri', 'Tharaka Nithi', 'Kitale', 'Kitui', 'Machakos', 'Eldoret', 'Rongo', 'Bungoma', 'Nairobi', 'Naivasha', 'Nakuru'].map((county) => (
              <span key={county} className="px-4 py-2 bg-white rounded-full text-primary font-semibold text-sm border border-blue-200 shadow-sm hover:shadow-md hover:border-aqua card-hover cursor-default flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-aqua" /> {county}
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

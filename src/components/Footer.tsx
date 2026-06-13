import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #0097A7 100%)' }}>
      {/* Wave top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F0F8FF"/>
        </svg>
      </div>

      <div className="relative z-10 pt-20 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 relative overflow-hidden rounded-full bg-white/20 ring-2 ring-white/40">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">CUCU MUTUGI</h2>
                <span className="text-aqua-light text-sm font-semibold tracking-widest uppercase">Poultry</span>
              </div>
            </div>
            <p className="text-blue-100 mb-4 max-w-md leading-relaxed">
              🌱 Growing Farmers, Building Prosperity. Your trusted partner in poultry farming — providing healthy, pre-vaccinated chicks across Kenya and beyond.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">f</a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">in</a>
              <a href="https://wa.me/254706972161" className="w-9 h-9 rounded-full bg-green-500/70 hover:bg-green-500 flex items-center justify-center text-white transition-colors">W</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-blue-100">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/products', label: 'Products' },
                { href: '/resources', label: 'Resources' },
                { href: '/dashboard', label: 'Farmer Dashboard' },
                { href: '/admin', label: 'Admin Panel' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-aqua-light transition-colors flex items-center gap-2">
                    <span className="text-aqua text-xs">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-start gap-2">
                <span className="text-aqua-light mt-0.5">📞</span>
                <div>
                  <p>0706 972 161</p>
                  <p>0740 662 799</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-light mt-0.5">📧</span>
                <span>cucumutugipoultry@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-light mt-0.5">📍</span>
                <span>Embu · Nairobi · Nakuru · Eldoret & more</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-light mt-0.5">📅</span>
                <span>Marketing Days: Wed & Thu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center text-blue-200 text-sm">
          <p>&copy; {new Date().getFullYear()} CUCU MUTUGI POULTRY. All rights reserved. 🐔 Growing Farmers, Building Prosperity.</p>
        </div>
      </div>
    </footer>
  );
}

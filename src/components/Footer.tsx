'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sprout, Phone, Mail, MapPin, Calendar, Bird } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return (
    <footer className="relative overflow-hidden bg-slate-950 border-t-4 border-amber-400">
      {/* Wave top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FFFDF0"/>
        </svg>
      </div>

      <div className="relative z-10 pt-20 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 relative overflow-hidden rounded-full bg-white/10 ring-2 ring-amber-400">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-amber-400">CUCU MUTUGI</h2>
                <span className="text-amber-200 text-xs font-black tracking-widest uppercase">Poultry</span>
              </div>
            </div>
            <p className="text-slate-300 mb-4 max-w-md leading-relaxed flex items-start gap-2 text-sm font-medium">
              <Sprout className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>Growing Farmers, Building Prosperity. Your trusted partner in poultry farming — providing healthy, pre-vaccinated chicks across Kenya and beyond.</span>
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-amber-400/20 hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center text-amber-400 font-bold transition-all">f</a>
              <a href="#" className="w-9 h-9 rounded-full bg-amber-400/20 hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center text-amber-400 font-bold transition-all">in</a>
              <a href="https://wa.me/254706972161" className="w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white font-bold transition-all shadow-md">W</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-amber-400 font-extrabold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-300 font-medium">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/products', label: 'Products' },
                { href: '/resources', label: 'Resources' },
                { href: '/videos', label: 'Farm Videos & Tutorials' },
                { href: '/dashboard', label: 'Farmer Dashboard' },
                { href: '/admin', label: 'Admin Panel' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-amber-400 transition-colors flex items-center gap-2 text-sm">
                    <span className="text-amber-400 text-xs">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-amber-400 font-extrabold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-slate-300 text-sm font-medium">
              <li className="flex items-start gap-2">
                <Phone className="text-amber-400 h-4 w-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">0706 972 161</p>
                  <p className="font-bold text-white">0740 662 799</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="text-amber-400 h-4 w-4 mt-1 flex-shrink-0" />
                <span>cucumutugipoultry@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="text-amber-400 h-4 w-4 mt-1 flex-shrink-0" />
                <span>Embu · Nairobi · Nakuru · Eldoret & more</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="text-amber-400 h-4 w-4 mt-1 flex-shrink-0" />
                <span>Marketing Days: Wed & Thu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-slate-400 text-sm">
          <p className="flex items-center justify-center gap-1.5 flex-wrap font-medium">
            <span>&copy; {new Date().getFullYear()} CUCU MUTUGI POULTRY. All rights reserved.</span>
            <Bird className="h-4 w-4 text-amber-400 inline" />
            <span className="text-amber-400 font-bold">Growing Farmers, Building Prosperity.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

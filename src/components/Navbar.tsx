'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname?.startsWith('/admin')) return null;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/community', label: '💬 Farmer Lounge', isLive: true },
    { href: '/poultry-updates', label: '24h Updates', isLive: true },
    { href: '/products', label: 'Products' },
    { href: '/resources', label: 'Resources' },
    { href: '/videos', label: 'Videos' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-white border-b-2 border-green-700/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative overflow-hidden rounded-full glow-green ring-2 ring-emerald-600 bg-white">
              <Image src="/logo.png" alt="Cucu Mutugi Poultry Logo" fill className="object-contain p-0.5" />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-lg text-emerald-900 group-hover:text-amber-600 transition-colors">CUCU MUTUGI</span>
              <span className="block text-xs font-black text-amber-600 tracking-widest uppercase">Poultry</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-extrabold text-sm transition-colors duration-200 relative group flex items-center gap-1 ${
                  pathname === link.href ? 'text-emerald-700' : 'text-slate-800 hover:text-emerald-700'
                }`}
              >
                {link.label}
                {link.isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-amber-500 transition-all duration-300 group-hover:w-full rounded" />
              </Link>
            ))}
            <Link href="/products" className="btn-primary text-xs !py-2 !px-4 flex items-center gap-1.5 shadow-md">
              <ShoppingBag className="h-4 w-4 text-amber-300" /> Order Chicks
            </Link>
            <Link href="/admin" className="text-xs font-black text-emerald-950 bg-amber-400 px-3 py-1.5 rounded-full hover:bg-amber-300 transition-colors shadow-sm border border-amber-500">
              Admin Panel
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="lg:hidden text-slate-900 text-2xl p-2.5 rounded-full hover:bg-emerald-100/60 transition-colors"
            aria-label="Toggle main navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden py-4 border-t border-emerald-200 space-y-2 z-50 relative bg-white px-3 rounded-b-2xl shadow-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between text-slate-900 font-bold hover:text-emerald-700 py-2 px-3 rounded-xl hover:bg-emerald-50"
              >
                <span>{link.label}</span>
                {link.isLive && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> 24h Live
                  </span>
                )}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/products" className="btn-primary inline-flex items-center gap-1.5 text-sm !py-2.5 !px-5 w-full justify-center">
                <ShoppingBag className="h-4 w-4 text-amber-300" /> Order Chicks
              </Link>
              <Link href="/admin" className="text-xs font-black text-center text-emerald-950 bg-amber-400 py-2.5 rounded-xl hover:bg-amber-300 border border-amber-500">
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

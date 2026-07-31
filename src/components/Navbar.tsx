'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';

import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav className="sticky top-0 z-50 glass-white border-b border-amber-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative overflow-hidden rounded-full glow-yellow ring-2 ring-amber-400 bg-white">
              <Image src="/logo.png" alt="Cucu Mutugi Poultry Logo" fill className="object-contain p-0.5" />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">CUCU MUTUGI</span>
              <span className="block text-xs font-black text-amber-600 tracking-widest uppercase">Poultry</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/poultry-updates', label: 'Updates' },
              { href: '/products', label: 'Products' },
              { href: '/resources', label: 'Resources' },
              { href: '/videos', label: 'Videos' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-900 font-bold hover:text-amber-600 transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full rounded" />
              </Link>
            ))}
            <Link href="/products" className="btn-primary text-sm !py-2 !px-5 flex items-center gap-1.5 shadow-md">
              <ShoppingBag className="h-4 w-4 text-amber-400" /> Order Chicks
            </Link>
            <Link href="/admin" className="text-xs font-bold text-amber-400 bg-slate-900 px-3.5 py-1.5 rounded-full hover:bg-black transition-colors shadow-sm">
              Admin
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden text-slate-900 text-2xl p-3 rounded-full hover:bg-amber-100/60 transition-colors"
            aria-label="Toggle main navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden py-4 border-t border-amber-200 space-y-3 z-50 relative bg-white px-2 rounded-b-2xl shadow-xl">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/poultry-updates', label: 'Updates' },
                { href: '/products', label: 'Products' },
                { href: '/resources', label: 'Resources' },
                { href: '/videos', label: 'Videos' },
                { href: '/contact', label: 'Contact' },
                { href: '/admin', label: 'Admin Panel' },
              ].map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block text-slate-900 font-bold hover:text-amber-600 py-1.5 px-3 rounded-lg hover:bg-amber-50">
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Link href="/products" className="btn-primary inline-flex items-center gap-1.5 text-sm !py-2.5 !px-5 w-full justify-center">
                  <ShoppingBag className="h-4 w-4 text-amber-400" /> Order Chicks
                </Link>
              </div>
            </div>
          )}
      </div>
    </nav>
  );
}

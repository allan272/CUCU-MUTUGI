'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-white border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative overflow-hidden rounded-full glow-blue ring-2 ring-blue-200">
              <Image src="/logo.png" alt="Cucu Mutugi Poultry Logo" fill className="object-contain p-0.5" />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-lg text-gradient">CUCU MUTUGI</span>
              <span className="block text-xs font-semibold text-aqua tracking-widest uppercase">Poultry</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/products', label: 'Products' },
              { href: '/resources', label: 'Resources' },
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary font-medium hover:text-aqua transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-aqua transition-all duration-300 group-hover:w-full rounded" />
              </Link>
            ))}
            <Link href="/products" className="btn-primary text-sm !py-2 !px-5 flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4" /> Order Chicks
            </Link>
            <Link href="/admin" className="text-xs font-bold text-white bg-primary-dark px-3 py-1.5 rounded-full hover:bg-primary transition-colors">
              Admin
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden text-primary text-2xl p-3 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="Toggle main navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100 space-y-3 z-50 relative bg-white">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/products', label: 'Products' },
              { href: '/resources', label: 'Resources' },
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/contact', label: 'Contact' },
              { href: '/admin', label: 'Admin Panel' },
            ].map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block text-primary font-medium hover:text-aqua py-1">
                {link.label}
              </Link>
            ))}
            <Link href="/products" className="btn-primary inline-flex items-center gap-1.5 text-sm !py-2 !px-5">
              <ShoppingBag className="h-4 w-4" /> Order Chicks
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

import Link from 'next/link';
import { Bird, Shield, Lock, ArrowRight } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Our Policies</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Commitment to Excellence, Animal Welfare, and Sustainability
        </p>
      </section>

      {/* Policies Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Animal Welfare Policy */}
          <Link href="/policies/animal-welfare">
            <div className="bg-light-green hover:shadow-lg transition-all p-8 rounded-xl border-2 border-primary hover:border-accent cursor-pointer h-full">
              <div className="text-primary mb-4"><Bird className="h-12 w-12" /></div>
              <h2 className="text-2xl font-bold text-primary mb-4">Animal Welfare Policy</h2>
              <p className="text-gray-700 mb-6">
                Our commitment to the highest standards of animal care, guided by the Five Freedoms and Kenya's Prevention of Cruelty to Animals Act.
              </p>
              <span className="text-primary font-semibold hover:text-accent flex items-center gap-1">Read More <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>

          {/* AMR Policy */}
          <Link href="/policies/amr">
            <div className="bg-light-gold hover:shadow-lg transition-all p-8 rounded-xl border-2 border-accent hover:border-primary cursor-pointer h-full">
              <div className="text-accent mb-4"><Shield className="h-12 w-12" /></div>
              <h2 className="text-2xl font-bold text-accent mb-4">Antimicrobial Resistance (AMR) Policy</h2>
              <p className="text-gray-700 mb-6">
                Our responsible use of antimicrobials to preserve their effectiveness and support sustainable poultry production.
              </p>
              <span className="text-accent font-semibold hover:text-primary flex items-center gap-1">Read More <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>

          {/* Food Safety Policy */}
          <Link href="/policies/food-safety">
            <div className="bg-green-100 hover:shadow-lg transition-all p-8 rounded-xl border-2 border-green-400 hover:border-accent cursor-pointer h-full">
              <div className="text-primary mb-4"><Lock className="h-12 w-12" /></div>
              <h2 className="text-2xl font-bold text-primary mb-4">Food Safety Policy</h2>
              <p className="text-gray-700 mb-6">
                Our commitment to providing safe, high-quality poultry products through preventive controls and continuous improvement.
              </p>
              <span className="text-primary font-semibold hover:text-accent flex items-center gap-1">Read More <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>
        </div>

        {/* Mission Section */}
        <div className="mt-16 p-8 bg-gray-50 rounded-xl">
          <h2 className="text-3xl font-bold text-primary mb-6">Our Commitment</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At Cucu Mutugi Poultry, we are dedicated to maintaining the highest standards in every aspect of our operations. Our policies reflect our commitment to animal welfare, food safety, sustainability, and the wellbeing of the farming communities we serve. We continuously monitor and improve our practices to ensure compliance with all applicable regulations and internationally recognized best practices.
          </p>
        </div>
      </section>
    </div>
  );
}

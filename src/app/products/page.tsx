import Link from 'next/link';
import { Bird, Check, ShoppingBag, Calendar, Truck, Syringe, Clock, MapPin, Mail, Smartphone } from 'lucide-react';

export default function ProductsPage() {
  const breeds = [
    { name: "KUROILER" },
    { name: "KARI" },
    { name: "SASSO" },
    { name: "RAINBOW ROOSTER" },
    { name: "KENBRO" }
  ];

  const locations = [
    "Embu", "Kirinyaga", "Meru", "Nyeri", "Tharaka Nithi",
    "Kitale", "Kitui", "Machakos", "Eldoret", "Rongo",
    "Bungoma", "Nairobi", "Naivasha", "Nakuru"
  ];

  return (
    <div className="bg-[#FFFDF0] text-slate-900 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-amber-400 text-slate-950 py-20 px-4 text-center relative overflow-hidden border-b-4 border-amber-500 shadow-md">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-sm text-slate-950">Our Products & Services</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-black text-slate-900">
            Premium Pre-Vaccinated Chicks and Free Nationwide Delivery
          </p>
        </div>
      </section>

      {/* Main Offerings */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 text-center">What We Offer</h2>
        <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Improved Kienyeji */}
          <div className="bg-white p-8 rounded-2xl border-t-4 border-t-amber-400 border border-amber-200 shadow-xl hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center mb-6 text-slate-950 shadow-md font-bold">
              <Bird className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Improved Kienyeji Chicks</h3>
            <p className="text-slate-700 mb-6 font-medium">Premium improved indigenous breeds including:</p>
            <ul className="space-y-3 text-slate-800 font-bold">
              {breeds.map((breed) => (
                <li key={breed.name} className="flex items-center gap-3">
                  <div className="bg-amber-400 p-1 rounded-full text-slate-950"><Check className="h-4 w-4" /></div>
                  {breed.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Broilers & Layers */}
          <div className="bg-amber-50/70 p-8 rounded-2xl border-t-4 border-t-amber-500 border border-amber-300 shadow-xl hover:shadow-2xl transition-all group transform md:-translate-y-4">
            <div className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center mb-6 text-slate-950 shadow-md">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Broilers & Layers</h3>
            <p className="text-slate-700 mb-6 font-medium">Pre-vaccinated day-old chicks:</p>
            <ul className="space-y-3 text-slate-800 font-bold">
              <li className="flex items-center gap-3">
                <div className="bg-amber-400 p-1 rounded-full text-slate-950"><Check className="h-4 w-4" /></div>
                Broiler Chicks
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-amber-400 p-1 rounded-full text-slate-950"><Check className="h-4 w-4" /></div>
                Layer Chicks
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-amber-400 p-1 rounded-full text-slate-950"><Check className="h-4 w-4" /></div>
                All fully vaccinated
              </li>
            </ul>
          </div>

          {/* Age Range */}
          <div className="bg-white p-8 rounded-2xl border-t-4 border-t-amber-400 border border-amber-200 shadow-xl hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center mb-6 text-slate-950 shadow-md">
              <Calendar className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Age Range</h3>
            <p className="text-slate-700 mb-6 font-medium">We supply chicks at various ages:</p>
            <ul className="space-y-3 text-slate-800 font-bold">
              <li className="flex items-center gap-3">
                <div className="bg-amber-400 p-1 rounded-full text-slate-950"><Check className="h-4 w-4" /></div>
                Day-old chicks
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-amber-400 p-1 rounded-full text-slate-950"><Check className="h-4 w-4" /></div>
                Up to one month old
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-amber-400 p-1 rounded-full text-slate-950"><Check className="h-4 w-4" /></div>
                Various growth stages
              </li>
            </ul>
          </div>
        </div>

        {/* Special Features */}
        <div className="bg-slate-950 text-white p-12 rounded-3xl mb-16 shadow-2xl relative overflow-hidden border-2 border-amber-400">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
          
          <h2 className="text-3xl md:text-4xl font-black mb-10 text-amber-400 text-center relative z-10">Our Commitment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mb-4 font-bold shadow-lg"><Truck className="h-8 w-8" /></div>
              <h3 className="text-xl font-extrabold mb-2 text-white">Free Delivery</h3>
              <p className="text-slate-300 font-medium">We deliver throughout Kenya ensuring your chicks arrive safely</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mb-4 font-bold shadow-lg"><Syringe className="h-8 w-8" /></div>
              <h3 className="text-xl font-extrabold mb-2 text-white">Pre-Vaccinated</h3>
              <p className="text-slate-300 font-medium">All chicks are fully vaccinated before delivery for optimal health</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mb-4 font-bold shadow-lg"><Clock className="h-8 w-8" /></div>
              <h3 className="text-xl font-extrabold mb-2 text-white">Marketing Days</h3>
              <p className="text-slate-300 font-medium">We operate on Wednesday and Thursday for your convenience</p>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-2 text-center">Service Locations</h2>
          <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-8" />
          <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-lg">
            <div className="flex flex-wrap gap-3 justify-center">
              {locations.map((location) => (
                <div key={location} className="flex items-center gap-2 text-slate-900 bg-amber-50 px-4 py-2 rounded-full border border-amber-300 font-bold hover:border-amber-500 transition-colors cursor-default">
                  <MapPin className="text-amber-600 h-4 w-4" />
                  {location}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-amber-400 text-slate-950 p-12 rounded-3xl text-center shadow-xl border-2 border-amber-500">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Order?</h2>
          <p className="text-lg font-black mb-8">Contact us today for premium pre-vaccinated chicks</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="mailto:cucumutugipoultry@gmail.com" className="flex items-center justify-center gap-2 bg-slate-950 text-amber-400 hover:bg-slate-900 transition-colors px-6 py-3.5 rounded-full font-extrabold shadow-md">
              <Mail className="h-5 w-5" /> cucumutugipoultry@gmail.com
            </a>
            <a href="tel:0706972161" className="flex items-center justify-center gap-2 bg-slate-950 text-amber-400 hover:bg-slate-900 transition-colors px-6 py-3.5 rounded-full font-extrabold shadow-md">
              <Smartphone className="h-5 w-5" /> 0706 972 161 / 0740 662 799
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

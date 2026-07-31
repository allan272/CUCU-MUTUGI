import Link from 'next/link';
import { Mail, Smartphone, Calendar, Check, Truck, MapPin, Award, Users, Sparkles, Sprout, Bird } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-[#FFFDF0] text-slate-900 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-amber-400 text-slate-950 py-20 px-4 text-center relative overflow-hidden border-b-4 border-amber-500 shadow-md">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-sm text-slate-950">Contact Us</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-black text-slate-900">
            Get in touch with CUCU MUTUGI POULTRY for orders and support
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        {/* Main Contact Card */}
        <div className="bg-slate-950 text-white p-12 rounded-3xl mb-16 text-center shadow-2xl relative overflow-hidden border-2 border-amber-400">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
          
          <h2 className="text-3xl md:text-4xl font-black mb-10 text-amber-400 relative z-10">Ready to Order Premium Chicks?</h2>
          
          <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-20 relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mb-4 font-bold shadow-lg"><Mail className="h-8 w-8" /></div>
              <h3 className="text-xl font-extrabold text-amber-400 mb-2">Email</h3>
              <a href="mailto:cucumutugipoultry@gmail.com" className="text-lg font-bold text-white hover:text-amber-300 transition-colors">
                cucumutugipoultry@gmail.com
              </a>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mb-4 font-bold shadow-lg"><Smartphone className="h-8 w-8" /></div>
              <h3 className="text-xl font-extrabold text-amber-400 mb-2">Phone</h3>
              <div className="space-y-1 text-center font-bold">
                <a href="tel:0706972161" className="block text-lg text-white hover:text-amber-300 transition-colors">
                  0706 972 161
                </a>
                <a href="tel:0740662799" className="block text-lg text-white hover:text-amber-300 transition-colors">
                  0740 662 799
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Days & Service Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="bg-amber-400 p-3 rounded-2xl text-slate-950"><Calendar className="h-7 w-7" /></div>
              Marketing Days
            </h3>
            <p className="text-lg text-slate-700 mb-4 font-semibold">We operate on:</p>
            <div className="space-y-3 text-lg text-slate-900 font-black">
              <p className="flex items-center gap-3"><Check className="h-6 w-6 text-amber-600" /> Wednesday</p>
              <p className="flex items-center gap-3"><Check className="h-6 w-6 text-amber-600" /> Thursday</p>
            </div>
          </div>

          <div className="bg-amber-500 text-slate-950 p-8 rounded-3xl border-2 border-amber-600 shadow-lg hover:shadow-xl transition-all group">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
              <div className="bg-slate-950 p-3 rounded-2xl text-amber-400"><Truck className="h-7 w-7" /></div>
              Delivery
            </h3>
            <p className="text-lg text-slate-950 leading-relaxed font-bold">
              <strong className="text-slate-950 block text-2xl mb-2 font-black">FREE COUNTRYWIDE DELIVERY</strong> 
              On all orders to ensure your chicks arrive safely and on time.
            </p>
          </div>
        </div>

        {/* Service Locations */}
        <div className="bg-white p-10 rounded-3xl border border-amber-200 mb-16 shadow-lg">
          <h2 className="text-3xl font-black text-slate-900 mb-2 text-center flex items-center justify-center gap-3">
            <MapPin className="h-8 w-8 text-amber-600" /> Service Locations
          </h2>
          <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-8" />
          <div className="flex flex-wrap gap-3 justify-center">
            {['Embu', 'Kirinyaga', 'Meru', 'Nyeri', 'Tharaka Nithi', 'Kitale', 'Kitui', 'Machakos', 'Eldoret', 'Rongo', 'Bungoma', 'Nairobi', 'Naivasha', 'Nakuru'].map((location) => (
              <div key={location} className="flex items-center gap-2 text-slate-900 bg-amber-50 px-4 py-2 rounded-full border border-amber-300 font-bold hover:border-amber-500 transition-colors cursor-default">
                <MapPin className="text-amber-600 h-4 w-4" />
                {location}
              </div>
            ))}
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-white p-10 rounded-3xl border-t-4 border-t-amber-400 border border-amber-200 shadow-xl mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-8">Our Product Range</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Pre-Vaccinated Improved Kienyeji</h3>
              <p className="text-slate-700 mb-4 text-sm font-semibold">Premium quality breeds including:</p>
              <ul className="space-y-2 text-slate-900 font-bold">
                {['KUROILER', 'KARI', 'SASSO', 'RAINBOW ROOSTER', 'KENBRO'].map(b => (
                  <li key={b} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div>{b}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Broiler & Layer Chicks</h3>
              <p className="text-slate-800 font-semibold leading-relaxed">Pre-vaccinated day-old chicks for both meat and egg production.</p>
            </div>

            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Various Ages</h3>
              <p className="text-slate-800 font-semibold leading-relaxed">From day-old chicks up to one month old, available at multiple stages of development.</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white border border-amber-200 rounded-3xl p-8 text-center shadow-md hover:shadow-xl hover:border-amber-400 transition-all group">
            <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-5 font-bold shadow-md">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 mb-2">Quality Chicks</h3>
            <p className="text-slate-700 font-medium">Healthy, strong, and fully vaccinated chicks</p>
          </div>

          <div className="bg-white border border-amber-200 rounded-3xl p-8 text-center shadow-md hover:shadow-xl hover:border-amber-400 transition-all group">
            <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-5 font-bold shadow-md">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 mb-2">Expert Support</h3>
            <p className="text-slate-700 font-medium">Technical expertise and reliable customer service</p>
          </div>

          <div className="bg-white border border-amber-200 rounded-3xl p-8 text-center shadow-md hover:shadow-xl hover:border-amber-400 transition-all group">
            <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-5 font-bold shadow-md">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 mb-2">Trusted Partner</h3>
            <p className="text-slate-700 font-medium">Your partner in building profitable poultry businesses</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="bg-amber-400 text-slate-950 p-12 rounded-3xl text-center shadow-xl mb-16 border-2 border-amber-500">
          <h2 className="text-3xl md:text-4xl font-black mb-4">CUCU MUTUGI POULTRY</h2>
          <p className="text-xl md:text-2xl italic font-black flex items-center justify-center gap-3">
            "Growing Farmers, Building Prosperity" 
          </p>
        </div>

        {/* Follow Us Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900">Follow Us on Social Media</h2>
          <p className="text-slate-700 text-lg font-medium">Connect with us on your favorite platforms for updates, tips, and community engagement</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <a
              href="https://www.threads.com/@cucu.mutugi.poultry"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-black text-white p-6 rounded-xl text-center font-bold transition-all shadow-md"
            >
              Threads
            </a>
            <a
              href="https://x.com/KelvinM60040495"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black hover:bg-slate-900 text-white p-6 rounded-xl text-center font-bold transition-all shadow-md"
            >
              𝕏 X (Twitter)
            </a>
            <a
              href="https://www.facebook.com/cucumutugipoultry"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl text-center font-bold transition-all shadow-md"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/cucumutugipoultry/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-600 hover:bg-pink-700 text-white p-6 rounded-xl text-center font-bold transition-all shadow-md"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@cucumutugipoultry"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-black text-white p-6 rounded-xl text-center font-bold transition-all shadow-md"
            >
              TikTok
            </a>
            <a
              href="https://chat.whatsapp.com/HCBJw4Dp5iV2CoAPS4MXaW"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl text-center font-bold transition-all shadow-md"
            >
              WhatsApp
            </a>
          </div>

          {/* More Details */}
          <Link href="/follow-us" className="block text-center pt-4">
            <button className="bg-slate-950 text-amber-400 px-8 py-3.5 rounded-full font-extrabold hover:bg-slate-900 transition-colors shadow-lg">
              View All Social Media Links
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { Check, ShieldCheck, Heart, Leaf, Target, Users, Sparkles, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-20 font-medium">
      {/* Header section with the signature yellow theme */}
      <section className="bg-amber-400 text-slate-950 py-20 px-4 text-center relative overflow-hidden shadow-lg border-b-4 border-amber-500">
        {/* Faint Logo Background Pattern */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-slate-950 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Logo centered */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-xl ring-4 ring-slate-950/20 inline-flex">
              <Image src="/logo.png" alt="Cucu Mutugi Poultry Logo" width={80} height={80} className="object-contain" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-sm text-slate-950">About Cucu Mutugi Poultry</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-black text-slate-900">
            Growing Farmers, Building Prosperity.
          </p>
        </div>
      </section>

      {/* Intro / Who We Are */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Your Trusted Partner in Poultry Farming</h2>
        <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-6" />
        <p className="text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto font-medium">
          We sell pre-vaccinated improved Kienyeji chicks including Kuroiler, KARI, Sasso, Rainbow Rooster, and Kenbro. We offer day-old up to one-month-old chicks, as well as pre-vaccinated broilers and layers. With free countrywide delivery on our marketing days (Wednesday & Thursday), we are committed to making poultry farming accessible and profitable across Kenya.
        </p>
      </section>

      {/* ===== REAL TEAM PHOTOS ===== */}
      <section className="bg-slate-950 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-amber-400 mb-3">Meet Our Team</h2>
            <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-4" />
            <p className="text-slate-300 font-medium text-lg">The passionate people behind Cucu Mutugi Poultry</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Big hero team image */}
            <div className="relative overflow-hidden rounded-3xl h-72 md:h-auto md:row-span-2 group">
              <Image
                src="/media/team-farm-4.jpg"
                alt="Cucu Mutugi Poultry team in branded uniforms"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-white font-black text-lg drop-shadow">The Cucu Mutugi Team</span>
                <p className="text-amber-300 text-sm font-semibold">Dedicated to your farming success</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl h-56 group">
              <Image
                src="/media/team-farm-2.jpg"
                alt="Cucu Mutugi team showing branded polo shirts"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="text-white font-bold text-sm">Branded & Professional</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl h-56 group">
              <Image
                src="/media/owner-banner.jpg"
                alt="Cucu Mutugi founder at exhibition with banner"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="text-white font-bold text-sm">At the Nairobi Agri-Expo</span>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { src: '/media/owner-with-chicks-1.jpg', alt: 'Owner holding newborn chicks', label: 'Day-Old Chicks' },
              { src: '/media/owner-with-chicks-2.jpg', alt: 'Owner with yellow chicks', label: 'Premium Breeds' },
              { src: '/media/team-delivery-1.jpg', alt: 'Delivery team with chick boxes', label: 'Delivery Ready' },
              { src: '/media/chicks-lineup.jpg', alt: 'Five different chick breeds', label: '5 Breeds Available' },
            ].map((p) => (
              <div key={p.src} className="relative overflow-hidden rounded-2xl h-40 group">
                <Image src={p.src} alt={p.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 text-white text-xs font-bold">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16 px-4 border-y border-amber-200 shadow-sm relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div className="bg-amber-50/50 p-10 rounded-3xl border-t-4 border-t-amber-500 border border-amber-200 shadow-lg hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center mb-6 shadow-md text-slate-950">
              <Target className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-700 leading-relaxed text-lg font-medium">
              To provide farmers with healthy, high-quality, pre-vaccinated chicks and reliable poultry support services that promote profitable, sustainable, and successful poultry farming across Kenya and Globally.
            </p>
          </div>

          <div className="bg-amber-50/50 p-10 rounded-3xl border-t-4 border-t-amber-500 border border-amber-200 shadow-lg hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center mb-6 shadow-md text-slate-950">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Our Vision</h2>
            <p className="text-slate-700 leading-relaxed text-lg font-medium">
              To become Kenya's most trusted and leading poultry supplier, empowering farmers through quality poultry breeds, excellent customer service, and innovative farming solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Our Plan */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 text-center">Our Plan & Commitment</h2>
        <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-10" />
        <div className="bg-slate-950 text-white p-10 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden border-2 border-amber-400">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
          
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {[
              "Supply healthy and fully vaccinated chicks to farmers nationwide.",
              "Expand our distribution network to reach every county in Kenya.",
              "Offer timely and reliable delivery services.",
              "Educate and support farmers with poultry management best practices.",
              "Build long-term relationships with customers through trust, consistency, and quality products.",
              "Continuously improve our breeding and sourcing standards to meet farmers' needs."
            ].map((plan, i) => (
              <li key={i} className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-amber-400 transition-colors">
                <div className="bg-amber-400 p-2 rounded-full flex-shrink-0 mt-1 text-slate-950 font-black">
                  <Check className="h-5 w-5" />
                </div>
                <span className="text-slate-200 leading-relaxed font-semibold">{plan}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-950 text-white py-20 px-4 relative border-y-4 border-amber-400">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-amber-400 mb-4">Core Values</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium">The principles that guide our operations, our relationships with farmers, and our commitment to excellence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Quality Excellence", desc: "Providing high-quality day-old chicks and poultry products that meet the highest industry standards.", icon: Award },
              { title: "Integrity", desc: "Conducting business with honesty, transparency, and accountability, building trust.", icon: ShieldCheck },
              { title: "Customer Success", desc: "Supporting growth through reliable products, technical expertise, and responsive service.", icon: Users },
              { title: "Innovation", desc: "Embracing modern poultry farming practices and technologies.", icon: Sparkles },
              { title: "Sustainability", desc: "Promoting responsible farming practices that protect the environment.", icon: Leaf },
              { title: "Animal Welfare", desc: "Prioritizing the health, welfare, and proper management of poultry.", icon: Heart }
            ].map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-amber-400/30 hover:border-amber-400 hover:bg-white/15 transition-all group">
                  <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-amber-300 transition-colors text-slate-950">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-extrabold text-amber-400 mb-3">{val.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-medium">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Policies Section (Matches the Signature Yellow Design) */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Company Policies</h2>
          <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-4" />
          <p className="text-lg text-slate-700 font-medium">Our commitments to safety, health, and welfare.</p>
        </div>

        <div className="space-y-12">
          {/* Animal Welfare Policy */}
          <div className="bg-amber-400 text-slate-950 p-8 md:p-12 rounded-3xl shadow-xl border-2 border-amber-500 hover:shadow-2xl transition-all">
            <h3 className="text-3xl font-black mb-6 flex items-center gap-3 border-b-2 border-slate-950/10 pb-4">
              <Heart className="h-8 w-8" /> Animal Welfare Policy
            </h3>
            <p className="text-lg leading-relaxed mb-6 font-bold">
              At Cucu Mutugi Poultry, we are committed to ensuring the highest standards of animal welfare throughout our operations. We recognize that good animal welfare is essential for animal health, productivity, product quality, and consumer confidence.
            </p>
            <p className="text-lg leading-relaxed mb-6 font-extrabold">
              Our animal welfare programme is founded on the internationally recognized Five Freedoms, ensuring that our birds are:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-950 font-black">
              <li className="flex items-start gap-3"><Check className="h-6 w-6 shrink-0 mt-0.5" /> Free from hunger, malnutrition, and thirst.</li>
              <li className="flex items-start gap-3"><Check className="h-6 w-6 shrink-0 mt-0.5" /> Free from fear and distress.</li>
              <li className="flex items-start gap-3"><Check className="h-6 w-6 shrink-0 mt-0.5" /> Free from physical and thermal discomfort.</li>
              <li className="flex items-start gap-3"><Check className="h-6 w-6 shrink-0 mt-0.5" /> Free from pain, injury, and disease.</li>
              <li className="flex items-start gap-3 md:col-span-2"><Check className="h-6 w-6 shrink-0 mt-0.5" /> Free to express normal patterns of behavior.</li>
            </ul>
          </div>

          {/* Food Safety Policy */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border-2 border-amber-200 hover:shadow-xl hover:border-amber-400 transition-all">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-amber-600" /> Food Safety Policy
            </h3>
            <p className="text-slate-700 text-lg leading-relaxed mb-6 font-medium">
              Food safety is a core priority. We are committed to providing safe, high-quality poultry products that meet customer expectations and comply with all applicable food safety laws.
            </p>
            <ul className="space-y-4 text-slate-800 font-semibold">
              <li className="flex items-start gap-3"><div className="bg-amber-400 p-1 rounded-full shrink-0 mt-1 text-slate-950"><Check className="h-4 w-4" /></div> Implementation of Good Agricultural Practices (GAP) and Good Hygiene Practices (GHP).</li>
              <li className="flex items-start gap-3"><div className="bg-amber-400 p-1 rounded-full shrink-0 mt-1 text-slate-950"><Check className="h-4 w-4" /></div> Maintaining effective biosecurity and sanitation measures to protect flock health.</li>
              <li className="flex items-start gap-3"><div className="bg-amber-400 p-1 rounded-full shrink-0 mt-1 text-slate-950"><Check className="h-4 w-4" /></div> Regular monitoring, auditing, and review of food safety performance.</li>
            </ul>
          </div>

          {/* AMR Policy */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border-2 border-amber-200 hover:shadow-xl hover:border-amber-400 transition-all">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Leaf className="h-8 w-8 text-amber-600" /> Antimicrobial Resistance (AMR) Policy
            </h3>
            <p className="text-slate-700 text-lg leading-relaxed mb-6 font-medium">
              We recognize AMR as a significant global challenge. We are committed to the responsible and prudent use of antimicrobials in our poultry operations to help preserve their effectiveness.
            </p>
            <ul className="space-y-4 text-slate-800 font-semibold">
              <li className="flex items-start gap-3"><div className="bg-amber-400 p-1 rounded-full shrink-0 mt-1 text-slate-950"><Check className="h-4 w-4" /></div> Using antimicrobials only when necessary and under veterinary guidance.</li>
              <li className="flex items-start gap-3"><div className="bg-amber-400 p-1 rounded-full shrink-0 mt-1 text-slate-950"><Check className="h-4 w-4" /></div> Prioritizing disease prevention through strong biosecurity and vaccination programs.</li>
              <li className="flex items-start gap-3"><div className="bg-amber-400 p-1 rounded-full shrink-0 mt-1 text-slate-950"><Check className="h-4 w-4" /></div> Observing prescribed withdrawal periods to ensure product safety.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-400 text-slate-950 py-16 px-4 text-center mt-10 border-t-4 border-amber-500">
        <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to Start Your Farming Journey?</h2>
        <Link href="/contact" className="inline-block bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold px-8 py-4 rounded-full transition-all shadow-xl text-lg">
          Contact Us Today
        </Link>
      </section>
    </div>
  );
}

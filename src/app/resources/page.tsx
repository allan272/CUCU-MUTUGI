import Link from 'next/link';
import { Egg, Wheat, Droplet, Activity, Brush, ClipboardList, Wrench, Check, Mail, Smartphone, ArrowRight, Film } from 'lucide-react';

export default function ResourcesPage() {
  const guides = [
    {
      title: "Brooding Management",
      description: "Learn how to properly brood newly hatched chicks with optimal temperature, space, and ventilation management.",
      icon: Egg,
      href: "/resources/brooding-management"
    },
    {
      title: "Feeding Programme",
      description: "Comprehensive guide on feeding requirements and programmes for broilers, layers, and improved indigenous chickens.",
      icon: Wheat,
      href: "/resources/feeding-programme"
    },
    {
      title: "Water Management",
      description: "Best practices for providing clean drinking water and managing drinker systems throughout the production cycle.",
      icon: Droplet,
      href: "/resources/water-management"
    },
    {
      title: "Health Management",
      description: "Comprehensive strategies for maintaining optimal flock health, vaccination programs, and disease prevention.",
      icon: Activity,
      href: "/resources/health-management"
    },
    {
      title: "Hygiene and Sanitation",
      description: "Best practices for maintaining disease-free facilities through proper cleaning, disinfection, and biosecurity.",
      icon: Brush,
      href: "/resources/hygiene-sanitation"
    },
    {
      title: "Record Keeping",
      description: "Essential guide to accurate record keeping for monitoring performance, profitability, and flock management.",
      icon: ClipboardList,
      href: "/resources/record-keeping"
    },
    {
      title: "Technical Support",
      description: "Expert guidance and tailored solutions for all aspects of poultry production and farm management.",
      icon: Wrench,
      href: "/resources/technical-support"
    }
  ];

  return (
    <div className="bg-[#FFFDF0] text-slate-900 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-amber-400 text-slate-950 py-20 px-4 text-center relative overflow-hidden border-b-4 border-amber-500 shadow-md">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-sm text-slate-950">Farmer Resources</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-black text-slate-900">
            Expert guides and best practices for successful poultry farming
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link key={guide.href} href={guide.href}>
                <div className="bg-white p-8 rounded-2xl border-t-4 border-t-amber-400 border border-amber-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group h-full flex flex-col">
                  <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center mb-6 text-slate-950 shadow-md group-hover:bg-amber-300 transition-colors">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">{guide.title}</h3>
                  <p className="text-slate-700 mb-6 flex-grow leading-relaxed font-medium">{guide.description}</p>
                  <span className="text-amber-700 font-extrabold flex items-center gap-2 group-hover:text-amber-800">
                    Read Guide <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Introduction */}
        <div className="bg-amber-50/80 p-10 md:p-12 rounded-3xl mb-16 border-2 border-amber-300 shadow-lg relative overflow-hidden">
          <h2 className="text-3xl font-black text-slate-900 mb-6 relative z-10">Getting Started with Your Flock</h2>
          <p className="text-slate-800 text-lg leading-relaxed font-semibold relative z-10">
            A flock that gets off to a good start is easier to manage and will perform well throughout the rearing period. Such a flock will have higher initial body weight, better uniformity, improved health status, and greater ability to reach its genetic potential. Our comprehensive farmer resources will guide you through every stage of production.
          </p>
        </div>

        {/* Key Principles */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 text-center">Key Principles for Success</h2>
          <div className="w-24 h-1.5 bg-amber-400 mx-auto rounded-full mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-amber-200 rounded-3xl p-8 shadow-md hover:shadow-xl hover:border-amber-400 transition-all group">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <div className="bg-amber-400 p-2 rounded-full text-slate-950"><Check className="h-5 w-5 flex-shrink-0" /></div>
                Proper Preparation
              </h3>
              <p className="text-slate-700 font-medium">Ensure all equipment and facilities are functioning before chicks arrive. Check house temperature, ventilation, feed, water, and lighting.</p>
            </div>
            <div className="bg-white border border-amber-200 rounded-3xl p-8 shadow-md hover:shadow-xl hover:border-amber-400 transition-all group">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <div className="bg-amber-400 p-2 rounded-full text-slate-950"><Check className="h-5 w-5 flex-shrink-0" /></div>
                Quality Feed
              </h3>
              <p className="text-slate-700 font-medium">Purchase feed from reputable manufacturers. Avoid mixing feeds from different sources or adding unauthorized supplements.</p>
            </div>
            <div className="bg-white border border-amber-200 rounded-3xl p-8 shadow-md hover:shadow-xl hover:border-amber-400 transition-all group">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <div className="bg-amber-400 p-2 rounded-full text-slate-950"><Check className="h-5 w-5 flex-shrink-0" /></div>
                Continuous Monitoring
              </h3>
              <p className="text-slate-700 font-medium">Regularly monitor feed intake, bird behavior, water consumption, and health status throughout the production cycle.</p>
            </div>
            <div className="bg-white border border-amber-200 rounded-3xl p-8 shadow-md hover:shadow-xl hover:border-amber-400 transition-all group">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <div className="bg-amber-400 p-2 rounded-full text-slate-950"><Check className="h-5 w-5 flex-shrink-0" /></div>
                Optimal Environment
              </h3>
              <p className="text-slate-700 font-medium">Maintain proper temperature, ventilation, space allocation, and lighting conditions to promote bird comfort and health.</p>
            </div>
          </div>
        </div>

        {/* Media & Video Resource Gallery Banner */}
        <div className="bg-amber-400 p-10 rounded-3xl mb-16 border-4 border-amber-500 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-slate-950 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-slate-950 text-amber-400 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Film className="w-4 h-4 text-amber-400" /> Interactive Media Hub
            </div>
            <h2 className="text-3xl md:text-4xl font-black">Video Guides & Photo Library</h2>
            <p className="text-slate-900 font-bold text-base md:text-lg max-w-xl">
              Watch real brooding demonstrations, vaccination protocols, drinker installations, and customer delivery dispatches from Cucu Mutugi Poultry.
            </p>
          </div>
          <Link
            href="/videos"
            className="flex-shrink-0 bg-slate-950 hover:bg-black text-amber-400 font-black px-8 py-4 rounded-2xl transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2 text-lg border-2 border-amber-400"
          >
            Open Media Hub <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Support Section */}
        <div className="bg-slate-950 text-white p-12 rounded-3xl text-center shadow-2xl relative overflow-hidden border-2 border-amber-400">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
          
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-amber-400 relative z-10">Need More Support?</h2>
          <p className="text-lg text-slate-300 mb-8 relative z-10 font-medium">Our team is here to help you succeed with expert guidance and customer support.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <a href="mailto:cucumutugipoultry@gmail.com" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm px-6 py-3.5 rounded-full font-extrabold border border-amber-400/40">
              <Mail className="h-5 w-5 text-amber-400" /> cucumutugipoultry@gmail.com
            </a>
            <a href="tel:0706972161" className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors px-6 py-3.5 rounded-full font-extrabold shadow-md">
              <Smartphone className="h-5 w-5" /> 0706 972 161 / 0740 662 799
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

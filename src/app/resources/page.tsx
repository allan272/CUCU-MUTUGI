import Link from 'next/link';
import { Egg, Wheat, Droplet, Activity, Brush, ClipboardList, Wrench, Check, Mail, Smartphone, ArrowRight } from 'lucide-react';

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
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Farmer Resources</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Expert guides and best practices for successful poultry farming
        </p>
      </section>

      {/* Guides Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link key={guide.href} href={guide.href}>
                <div className="bg-light-green hover:shadow-lg transition-all p-8 rounded-xl border-2 border-primary hover:border-accent cursor-pointer h-full">
                  <div className="text-primary mb-4">
                    <Icon className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-3">{guide.title}</h3>
                  <p className="text-gray-700 mb-6">{guide.description}</p>
                  <span className="text-primary font-semibold hover:text-accent flex items-center gap-1">Read Guide <ArrowRight className="h-4 w-4" /></span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Introduction */}
        <div className="bg-light-gold p-12 rounded-xl mb-12">
          <h2 className="text-2xl font-bold text-accent mb-4">Getting Started with Your Flock</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            A flock that gets off to a good start is easier to manage and will perform well throughout the rearing period. Such a flock will have higher initial body weight, better uniformity, improved health status, and greater ability to reach its genetic potential. Our comprehensive farmer resources will guide you through every stage of production.
          </p>
        </div>

        {/* Key Principles */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-8">Key Principles for Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-primary rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" /> Proper Preparation
              </h3>
              <p className="text-gray-700">Ensure all equipment and facilities are functioning before chicks arrive. Check house temperature, ventilation, feed, water, and lighting.</p>
            </div>
            <div className="bg-white border-2 border-primary rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" /> Quality Feed
              </h3>
              <p className="text-gray-700">Purchase feed from reputable manufacturers. Avoid mixing feeds from different sources or adding unauthorized supplements.</p>
            </div>
            <div className="bg-white border-2 border-primary rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" /> Continuous Monitoring
              </h3>
              <p className="text-gray-700">Regularly monitor feed intake, bird behavior, water consumption, and health status throughout the production cycle.</p>
            </div>
            <div className="bg-white border-2 border-primary rounded-xl p-8">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" /> Optimal Environment
              </h3>
              <p className="text-gray-700">Maintain proper temperature, ventilation, space allocation, and lighting conditions to promote bird comfort and health.</p>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-primary text-white p-12 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-accent">Need More Support?</h2>
          <p className="text-lg mb-6">Our team is here to help you succeed with expert guidance and customer support.</p>
          <div className="space-y-3">
            <p className="text-lg"><Mail className="h-4 w-4 inline mr-1 text-accent" /> <strong>Email:</strong> cucumutugipoultry@gmail.com</p>
            <p className="text-lg"><Smartphone className="h-4 w-4 inline mr-1 text-accent" /> <strong>Call:</strong> 0706972161 / 0740662799</p>
          </div>
        </div>
      </section>
    </div>
  );
}

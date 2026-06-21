import Link from 'next/link';
import { Coffee, Smile, Home, Activity, Heart, ArrowLeft } from 'lucide-react';

export default function AnimalWelfarePage() {
  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Animal Welfare Policy</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Our Commitment to the Highest Standards of Animal Care
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none space-y-8 text-gray-800">
          <p>
            At Cucu Mutugi Poultry, we are committed to ensuring the highest standards of animal welfare throughout our operations. We recognize that good animal welfare is essential for animal health, productivity, product quality, and consumer confidence. Our practices are guided by the requirements of Kenya's <strong>Prevention of Cruelty to Animals Act (Cap. 360)</strong>, applicable animal health regulations, and internationally recognized animal welfare principles.
          </p>

          <p>
            We are dedicated to providing humane care and management of all poultry under our responsibility. Our animal welfare programme is founded on the internationally recognized <strong>Five Freedoms</strong>, ensuring that our birds are:
          </p>

          <div className="bg-light-green p-8 rounded-xl space-y-6 border-l-4 border-primary">
            <div>
              <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2"><Coffee className="h-5 w-5" /> Free from Hunger and Thirst</h3>
              <p>Access to adequate feed and clean water</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2"><Smile className="h-5 w-5" /> Free from Fear and Distress</h3>
              <p>Minimizing stress and ensuring appropriate handling practices</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2"><Home className="h-5 w-5" /> Free from Physical and Thermal Discomfort</h3>
              <p>Suitable housing, ventilation, and environmental conditions</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2"><Activity className="h-5 w-5" /> Free from Pain, Injury, and Disease</h3>
              <p>Preventive healthcare, biosecurity measures, and timely veterinary care</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2"><Heart className="h-5 w-5" /> Free to Express Normal Behavior</h3>
              <p>Appropriate stocking densities and management practices</p>
            </div>
          </div>

          <p>
            Cucu Mutugi Poultry continuously monitors and improves its animal welfare practices to ensure compliance with legal requirements and industry best practices, while promoting the health and wellbeing of our poultry.
          </p>

          <div className="text-center mt-12">
            <Link href="/policies" className="text-primary font-semibold hover:text-accent transition-colors">
              <span className="flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back to Policies</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

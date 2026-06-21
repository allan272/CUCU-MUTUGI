import Link from 'next/link';
import { Check, ArrowLeft } from 'lucide-react';

export default function AMRPolicyPage() {
  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Antimicrobial Resistance (AMR) Policy</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Responsible Antimicrobial Use for Sustainable Poultry Production
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none space-y-8 text-gray-800">
          <p>
            At Cucu Mutugi Poultry, we recognize antimicrobial resistance (AMR) as a significant global public health challenge that can impact animal health, food safety, and human wellbeing. We are committed to the responsible and prudent use of antimicrobials in our poultry operations to help preserve their effectiveness and support sustainable poultry production.
          </p>

          <p>
            Our approach to antimicrobial stewardship is guided by applicable Kenyan regulations, veterinary best practices, and internationally recognized principles for responsible antimicrobial use. We prioritize disease prevention through strong biosecurity measures, good husbandry practices, vaccination programs, and proper flock management to reduce the need for antimicrobial treatments.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10">Our Commitments</h2>

          <div className="bg-light-gold p-8 rounded-xl space-y-4 border-l-4 border-accent">
            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-primary">Using antimicrobials only when necessary</h3>
                <p className="text-sm mt-1">Under the guidance of qualified veterinary professionals</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-primary">Avoiding routine or indiscriminate use</h3>
                <p className="text-sm mt-1">Adhering to prescribed treatment protocols</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-primary">Implementing robust biosecurity</h3>
                <p className="text-sm mt-1">Sanitation, and disease prevention measures across all operations</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-primary">Maintaining accurate records</h3>
                <p className="text-sm mt-1">Of antimicrobial use and monitoring treatment outcomes</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-primary">Observing withdrawal periods</h3>
                <p className="text-sm mt-1">To ensure the safety of poultry products</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-primary">Training employees</h3>
                <p className="text-sm mt-1">On responsible antimicrobial use and AMR awareness</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-primary">Supporting continuous improvement</h3>
                <p className="text-sm mt-1">Of antimicrobial stewardship practices</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-primary">Collaborating with stakeholders</h3>
                <p className="text-sm mt-1">Veterinarians, suppliers, regulators, and others to promote responsible antimicrobial use</p>
              </div>
            </div>
          </div>

          <p className="text-lg mt-10">
            Through these commitments, Cucu Mutugi Poultry aims to contribute to the global effort to combat antimicrobial resistance while safeguarding animal welfare, food safety, public health, and the long-term sustainability of poultry production.
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

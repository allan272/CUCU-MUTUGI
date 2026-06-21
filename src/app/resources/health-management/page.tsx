import Link from 'next/link';
import { Home, LineChart, Wrench, Shield, Check, ArrowLeft } from 'lucide-react';

export default function HealthManagementPage() {
  const benefits = [
    "Enhanced disease prevention and flock health",
    "Improved bird welfare and reduced stress during production",
    "Lower mortality rates and reduced production losses",
    "Better growth performance and feed efficiency",
    "Reduced incidence of disease-related carcass condemnations",
    "Improved product quality and food safety outcomes",
    "Increased productivity and profitability"
  ];

  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Health Management</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Comprehensive strategies for maintaining optimal flock health
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {/* Overview */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Health Management Strategy</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            At Cucu Mutugi Poultry, maintaining optimal flock health is fundamental to animal welfare, productivity, food safety, and business sustainability. We implement comprehensive health management programs designed to prevent disease, enhance bird performance, and minimize production losses.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our health management strategy emphasizes preventive healthcare through vaccination, biosecurity, proper nutrition, environmental management, and continuous monitoring of flock performance. Vaccination programs are administered in accordance with veterinary recommendations and industry best practices to protect birds against major poultry diseases.
          </p>
        </div>

        {/* Disease Challenges */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Managing Production Challenges</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            As poultry production intensifies, challenges such as disease outbreaks, mortality, reduced growth performance, and carcass condemnations can significantly impact productivity and profitability. To address these risks, Cucu Mutugi Poultry continuously invests in:
          </p>
          <div className="bg-light-gold p-8 rounded-xl space-y-3 border-l-4 border-accent">
            <div className="flex gap-3">
              <Home className="h-5 w-5 text-primary" />
              <p className="text-gray-700">Improved housing and facilities</p>
            </div>
            <div className="flex gap-3">
              <LineChart className="h-5 w-5 text-primary" />
              <p className="text-gray-700">Appropriate stocking densities</p>
            </div>
            <div className="flex gap-3">
              <Wrench className="h-5 w-5 text-primary" />
              <p className="text-gray-700">Enhanced farm management practices</p>
            </div>
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <p className="text-gray-700">Comprehensive disease prevention measures</p>
            </div>
          </div>
        </div>

        {/* Vaccination Strategy */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Vaccination Programs</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Where feasible, early vaccination strategies are adopted to provide birds with timely protection against common diseases. Vaccinations are administered by trained personnel following strict handling and storage procedures to ensure vaccine efficacy and bird safety.
          </p>
          
          <div className="bg-light-green p-8 rounded-xl space-y-4 border-l-4 border-primary">
            <h3 className="font-bold text-primary text-lg">Benefits of Effective Vaccination:</h3>
            <ul className="space-y-3">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <Check className="text-accent h-5 w-5 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hatchery Approach - Gumboro and Newcastle */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Two-Pronged Hatchery Vaccination Approach</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            At Cucu Mutugi Poultry, we adopt a proactive two-pronged vaccination strategy at the hatchery to provide early protection against two of the most significant poultry diseases: <strong>Gumboro Disease</strong> and <strong>Newcastle Disease</strong>.
          </p>

          {/* Gumboro */}
          <div className="bg-white border-2 border-primary rounded-xl p-8 mt-6">
            <h3 className="text-2xl font-bold text-primary mb-4">Gumboro Disease (Infectious Bursal Disease)</h3>
            <p className="text-gray-700 mb-4">
              Gumboro Disease, also known as Infectious Bursal Disease (IBD), is a highly contagious viral infection that primarily affects young chickens. First identified in Gumboro, Delaware, USA, in the early 1960s, the disease has since spread worldwide.
            </p>
            <div className="space-y-3 text-gray-700">
              <p><strong>How it works:</strong> The disease attacks the immune system by damaging the Bursa of Fabricius, an organ responsible for developing B lymphocytes, which play a vital role in immunity.</p>
              <p><strong>High-risk period:</strong> Birds between 3-6 weeks of age are particularly susceptible when the Bursa is at its peak development.</p>
              <p><strong>Symptoms:</strong> Depression, ruffled feathers, diarrhea, dehydration, and reduced feed intake. In severe outbreaks, significant mortality can occur in unvaccinated flocks.</p>
              <p><strong>Secondary effects:</strong> The disease weakens the immune system, making birds vulnerable to secondary infections and reducing overall flock performance.</p>
            </div>
          </div>

          {/* Newcastle */}
          <div className="bg-white border-2 border-primary rounded-xl p-8 mt-6">
            <h3 className="text-2xl font-bold text-primary mb-4">Newcastle Disease</h3>
            <p className="text-gray-700 mb-4">
              Newcastle Disease is a highly contagious viral disease affecting poultry of all ages, caused by avian paramyxoviruses. It spreads rapidly through direct contact, contaminated equipment, airborne particles, and infected droppings.
            </p>
            <div className="space-y-3 text-gray-700">
              <p><strong>Systems affected:</strong> Primarily affects respiratory, digestive, and nervous systems.</p>
              <p><strong>Symptoms:</strong> Respiratory distress, coughing, sneezing, reduced feed consumption, diarrhea, nervous symptoms (twisted necks, paralysis), and sudden mortality increases.</p>
              <p><strong>Impact on layers:</strong> Causes significant decline in egg production and egg quality.</p>
              <p><strong>Economic importance:</strong> Due to its highly infectious nature and economic impact, Newcastle Disease remains one of the most important diseases requiring continuous monitoring and vaccination.</p>
            </div>
          </div>

          {/* Hatchery Benefits */}
          <div className="bg-light-green p-8 rounded-xl space-y-3 border-l-4 border-primary mt-6">
            <h3 className="font-bold text-primary text-lg mb-4">Benefits of Hatchery-Based Vaccination:</h3>
            <div className="flex gap-3">
              <Check className="text-primary h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700">Improved vaccine coverage and consistency across all chicks</p>
            </div>
            <div className="flex gap-3">
              <Check className="text-primary h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700">Enhanced early immunity and disease resistance</p>
            </div>
            <div className="flex gap-3">
              <Check className="text-primary h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700">Reduced disease-related mortality and production losses</p>
            </div>
            <div className="flex gap-3">
              <Check className="text-primary h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700">Lower stress on birds compared to repeated field vaccinations</p>
            </div>
            <div className="flex gap-3">
              <Check className="text-primary h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700">Improved flock health, growth performance, and productivity</p>
            </div>
            <div className="flex gap-3">
              <Check className="text-primary h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700">Reduced risk of disease outbreaks and carcass condemnations</p>
            </div>
            <div className="flex gap-3">
              <Check className="text-primary h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700">Enhanced food safety and animal welfare outcomes</p>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mt-6">
            <strong>Note:</strong> Marex is vaccinated at day one to provide immediate protection against these critical diseases.
          </p>
        </div>

        {/* Commitment */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Our Ongoing Commitment</h2>
          <div className="bg-primary text-white p-8 rounded-xl border-l-4 border-accent">
            <p className="text-lg leading-relaxed">
              Through effective vaccination, strong biosecurity measures, and continuous veterinary oversight, Cucu Mutugi Poultry remains committed to maintaining healthy flocks and supporting sustainable poultry production. We invest in the health and wellbeing of our birds because it directly impacts the success and profitability of our farming partners.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-center pt-12">
          <Link href="/resources" className="text-primary font-semibold hover:text-accent transition-colors">
            <span className="flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back to Resources</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

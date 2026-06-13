import Link from 'next/link';

export default function FoodSafetyPolicyPage() {
  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Food Safety Policy</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Ensuring Safe, High-Quality Poultry Products
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {/* Overview */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Our Commitment to Food Safety</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            At Cucu Mutugi Poultry, food safety is a core priority throughout our production and supply chain. We are committed to providing safe, high-quality poultry products that meet customer expectations and comply with all applicable food safety laws, regulations, and industry standards.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our food safety management system is based on preventive controls and continuous improvement principles, ensuring that food safety risks are identified, assessed, and effectively managed at every stage of production. We strive to maintain the highest standards of hygiene, biosecurity, processing, storage, and distribution to safeguard consumer health and confidence.
          </p>
        </div>

        {/* Key Commitments */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Our Commitments</h2>
          <div className="bg-light-green p-8 rounded-xl space-y-4 border-l-4 border-primary">
            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Regulatory Compliance:</strong> Compliance with all relevant food safety regulations and statutory requirements</p>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Best Practices:</strong> Implementation and maintenance of Good Agricultural Practices (GAP), Good Hygiene Practices (GHP), and Good Manufacturing Practices (GMP)</p>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Hazard Prevention:</strong> Prevention, monitoring, and control of food safety hazards throughout the production process</p>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Biosecurity & Sanitation:</strong> Maintaining effective biosecurity and sanitation measures to protect flock health and product integrity</p>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Product Traceability:</strong> Ensuring traceability of products across the entire value chain</p>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Employee Training:</strong> Providing continuous food safety training and awareness for all employees</p>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Continuous Monitoring:</strong> Regular monitoring, auditing, and review of food safety performance to drive continuous improvement</p>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Incident Management:</strong> Prompt investigation and resolution of food safety incidents, complaints, and non-conformities</p>
            </div>
          </div>
        </div>

        {/* Impact */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Our Promise</h2>
          <div className="bg-primary text-white p-8 rounded-xl border-l-4 border-accent">
            <p className="text-lg leading-relaxed">
              Through these commitments, Cucu Mutugi Poultry aims to consistently deliver safe, wholesome, and high-quality poultry products while protecting consumer health and maintaining stakeholder trust. We understand that food safety is not just a regulatory requirement—it is a fundamental responsibility to our customers and the communities we serve.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-center pt-12">
          <Link href="/policies" className="text-primary font-semibold hover:text-accent transition-colors">
            ← Back to Policies
          </Link>
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';

export default function TechnicalSupportPage() {
  const supportAreas = [
    {
      title: "Poultry Housing",
      description: "Design and construction guidance for poultry houses and facilities",
      icon: "🏠"
    },
    {
      title: "Husbandry Practices",
      description: "Best practices for caring for and managing poultry flocks",
      icon: "👨‍🌾"
    },
    {
      title: "Nutrition",
      description: "Feeding programs and nutritional requirements for optimal growth",
      icon: "🌾"
    },
    {
      title: "Biosecurity",
      description: "Disease prevention and biosecurity protocols",
      icon: "🛡️"
    },
    {
      title: "Flock Health Management",
      description: "Vaccination programs and health monitoring strategies",
      icon: "🏥"
    },
    {
      title: "Production Optimization",
      description: "Strategies to achieve optimal productivity and profitability",
      icon: "📈"
    }
  ];

  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Technical Support</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Expert guidance and practical solutions for successful poultry farming
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {/* Our Commitment */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Our Commitment to Farmers</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            At CUCU MUTUGI POULTRY, we are committed to providing reliable technical support and practical solutions to poultry farmers. Our team offers expert guidance on all aspects of poultry production to help you achieve optimal productivity and profitability.
          </p>
        </div>

        {/* Foundation of Advice */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Foundation of Our Recommendations</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The information and recommendations we provide are based on:
          </p>
          <div className="bg-light-green p-8 rounded-xl space-y-4 border-l-4 border-primary">
            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Proven Performance Results:</strong> Real-world data from successful flock management</p>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Sound Management Practices:</strong> Industry-recognized best practices in poultry production</p>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Current Scientific Knowledge:</strong> Latest research relevant to poultry production in East Africa and beyond</p>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Practical Industry Experience:</strong> Decades of field experience and expertise</p>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-gray-700"><strong>Ongoing Advancements:</strong> Latest technologies and innovations in poultry production</p>
            </div>
          </div>
        </div>

        {/* Areas of Support */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Areas of Technical Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportAreas.map((area, idx) => (
              <div key={idx} className="bg-white border-2 border-primary rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{area.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{area.title}</h3>
                <p className="text-gray-700">{area.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Note */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">How to Use Our Recommendations</h2>
          <div className="bg-light-gold p-8 rounded-xl border-l-4 border-accent">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The management programs and guidelines we offer are intended as <strong>recommendations</strong> and should be adapted to suit your individual farm conditions, management systems, and production goals. While these recommendations are designed to promote best practices and optimal performance, they should not be interpreted as guarantees of specific production results.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Every farm is unique, and factors such as climate, housing, available resources, and management capacity will influence which practices are best suited to your operation. Our technical team is available to help you adapt these recommendations to your specific situation.
            </p>
          </div>
        </div>

        {/* Customized Solutions */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Tailored Support for Your Farm</h2>
          <div className="bg-primary text-white p-8 rounded-xl border-l-4 border-accent">
            <p className="text-lg leading-relaxed mb-6">
              Our technical team remains available to assist farmers in developing and implementing poultry management programs tailored to their unique operational needs, ensuring sustainable and successful poultry production.
            </p>
            <div className="bg-primary/80 p-6 rounded mt-6 space-y-3">
              <p className="text-lg"><strong>📧 Email:</strong> cucumutugipoultry@gmail.com</p>
              <p className="text-lg"><strong>📱 Call:</strong> 0706972161 / 0740662799</p>
              <p className="text-lg"><strong>⏰ Marketing Days:</strong> Wednesday & Thursday</p>
            </div>
          </div>
        </div>

        {/* Resources Link */}
        <div className="bg-light-green p-8 rounded-xl border-2 border-primary text-center">
          <h3 className="text-2xl font-bold text-primary mb-4">Explore Our Resources</h3>
          <p className="text-gray-700 mb-6">
            Visit our comprehensive farmer resources section for detailed guides on brooding, feeding, water management, health management, sanitation, and record keeping.
          </p>
          <Link href="/resources" className="text-primary font-semibold hover:text-accent transition-colors text-lg">
            View All Farmer Guides →
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-center pt-12">
          <Link href="/resources" className="text-primary font-semibold hover:text-accent transition-colors">
            ← Back to Resources
          </Link>
        </div>
      </section>
    </div>
  );
}

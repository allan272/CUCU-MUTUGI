import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">About CUCU MUTUGI POULTRY</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Your Trusted Partner in Poultry Farming Since 2020
        </p>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
        <div className="prose prose-lg max-w-none space-y-6 text-gray-800">
          <p>
            Since 2020, <strong>CUCU MUTUGI POULTRY</strong> has been driven by a passion for poultry farming and a commitment to empowering farmers through sustainable and profitable poultry enterprises. We believe that successful poultry farming creates lasting livelihoods that can be passed from one generation to the next, and we take pride in seeing our farmers grow and succeed.
          </p>
          <p>
            Our mission is to provide farmers with high-quality poultry products, expert guidance, and reliable support at every stage of their farming journey. We understand that our success is closely linked to the success of the farmers we serve.
          </p>
          <p>
            We specialize in supplying premium-quality day-old chicks, including <strong>Layers, Broilers, and IMPROVED KIENYEJI breeds</strong>, carefully selected for their strong performance, adaptability, and disease resistance. Through quality genetics, sound management advice, and dedicated customer support, we help farmers maximize productivity and achieve better returns on their investments.
          </p>
          <p className="text-lg font-semibold text-primary">
            At CUCU MUTUGI POULTRY, we are more than a supplier—we are your trusted partner in building a successful and sustainable poultry business.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-light-green p-8 rounded-xl shadow-sm border border-green-100">
          <h2 className="text-3xl font-bold text-primary mb-4 flex items-center gap-3">
            <span>🎯</span> Our Mission
          </h2>
          <p className="text-lg leading-relaxed text-gray-800">
            To provide farmers with healthy, high-quality, pre-vaccinated chicks and reliable poultry support services that promote profitable, sustainable, and successful poultry farming across Kenya and Globally.
          </p>
        </div>
        
        <div className="bg-light-gold p-8 rounded-xl shadow-sm border border-yellow-100">
          <h2 className="text-3xl font-bold text-accent mb-4 flex items-center gap-3">
            <span>👁️</span> Our Vision
          </h2>
          <p className="text-lg leading-relaxed text-gray-800">
            To become Kenya's most trusted and leading poultry supplier, empowering farmers through quality poultry breeds, excellent customer service, and innovative farming solutions.
          </p>
        </div>
      </section>

      {/* Our Plan */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-primary mb-10">Our Plan</h2>
        <ul className="space-y-6">
          <li className="flex gap-4">
            <span className="text-accent text-2xl">✓</span>
            <span className="text-lg">Supply healthy and fully vaccinated chicks to farmers nationwide.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-accent text-2xl">✓</span>
            <span className="text-lg">Expand our distribution network to reach every county in Kenya.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-accent text-2xl">✓</span>
            <span className="text-lg">Offer timely and reliable delivery services.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-accent text-2xl">✓</span>
            <span className="text-lg">Educate and support farmers with poultry management best practices.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-accent text-2xl">✓</span>
            <span className="text-lg">Build long-term relationships with customers through trust, consistency, and quality products.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-accent text-2xl">✓</span>
            <span className="text-lg">Continuously improve our breeding and sourcing standards to meet farmers' needs.</span>
          </li>
        </ul>
      </section>

      {/* Core Values */}
      <section className="bg-charcoal text-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-accent mb-12">Our Core Values</h2>
          <p className="text-center text-light-green text-lg mb-12">
            <Link href="/values" className="hover:text-accent transition-colors font-semibold">
              View all 10 core values →
            </Link>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-600 rounded-lg hover:border-accent transition-colors">
              <h3 className="text-xl font-bold text-light-green mb-3">1. Quality Excellence</h3>
              <p className="text-gray-300">Providing high-quality day-old chicks and poultry products that meet the highest industry standards.</p>
            </div>
            <div className="p-6 border border-gray-600 rounded-lg hover:border-accent transition-colors">
              <h3 className="text-xl font-bold text-light-green mb-3">2. Integrity</h3>
              <p className="text-gray-300">Honesty, transparency, and accountability, building trust and long-term relationships.</p>
            </div>
            <div className="p-6 border border-gray-600 rounded-lg hover:border-accent transition-colors">
              <h3 className="text-xl font-bold text-light-green mb-3">3. Customer Success</h3>
              <p className="text-gray-300">Dedicated to supporting farmer growth through reliable products, expertise, and responsive service.</p>
            </div>
            <div className="p-6 border border-gray-600 rounded-lg">
              <h3 className="text-xl font-bold text-light-green mb-3">4. Innovation</h3>
              <p className="text-gray-300">Embracing modern poultry farming practices, technologies, and continuous learning.</p>
            </div>
            <div className="p-6 border border-gray-600 rounded-lg">
              <h3 className="text-xl font-bold text-light-green mb-3">5. Sustainability</h3>
              <p className="text-gray-300">Responsible farming practices that enhance productivity while protecting the environment.</p>
            </div>
            <div className="p-6 border border-gray-600 rounded-lg">
              <h3 className="text-xl font-bold text-light-green mb-3">6. Teamwork</h3>
              <p className="text-gray-300">Collaboration and mutual respect, working closely with farmers and partners.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="text-center py-16 px-4">
        <h2 className="text-3xl font-bold text-primary mb-6">Ready to work with us?</h2>
        <Link href="/contact" className="inline-block bg-accent text-charcoal px-8 py-4 rounded-md font-bold text-lg hover:bg-yellow-500 transition-colors shadow-lg">
          Get in Touch
        </Link>
      </section>
    </div>
  );
}

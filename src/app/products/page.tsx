import Link from 'next/link';

export default function ProductsPage() {
  const breeds = [
    { name: "KUROILER", emoji: "🐔" },
    { name: "KARI", emoji: "🐔" },
    { name: "SASSO", emoji: "🐔" },
    { name: "RAINBOW ROOSTER", emoji: "🐔" },
    { name: "KENBRO", emoji: "🐔" }
  ];

  const locations = [
    "Embu", "Kirinyaga", "Meru", "Nyeri", "Tharaka Nithi",
    "Kitale", "Kitui", "Machakos", "Eldoret", "Rongo",
    "Bungoma", "Nairobi", "Naivasha", "Nakuru"
  ];

  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Our Products & Services</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Premium Pre-Vaccinated Chicks and Nationwide Delivery
        </p>
      </section>

      {/* Main Offerings */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-primary mb-8">What We Offer</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Improved Kienyeji */}
          <div className="bg-light-green p-8 rounded-xl border-2 border-primary">
            <h3 className="text-2xl font-bold text-primary mb-4">🐥 Improved Kienyeji Chicks</h3>
            <p className="text-gray-700 mb-6">Premium improved indigenous breeds including:</p>
            <ul className="space-y-2 text-gray-700">
              {breeds.map((breed) => (
                <li key={breed.name} className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  {breed.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Broilers & Layers */}
          <div className="bg-light-gold p-8 rounded-xl border-2 border-accent">
            <h3 className="text-2xl font-bold text-accent mb-4">🐣 Broilers & Layers</h3>
            <p className="text-gray-700 mb-6">Pre-vaccinated day-old chicks:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                Broiler Chicks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                Layer Chicks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                All fully vaccinated
              </li>
            </ul>
          </div>

          {/* Age Range */}
          <div className="bg-green-100 p-8 rounded-xl border-2 border-green-400">
            <h3 className="text-2xl font-bold text-primary mb-4">📅 Age Range</h3>
            <p className="text-gray-700 mb-6">We supply chicks at various ages:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                Day-old chicks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                Up to one month old
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                Various growth stages
              </li>
            </ul>
          </div>
        </div>

        {/* Special Features */}
        <div className="bg-primary text-white p-12 rounded-xl mb-12">
          <h2 className="text-3xl font-bold mb-6 text-accent">Our Commitment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="text-xl font-bold mb-2">Free Nationwide Delivery</h3>
              <p>We deliver throughout Kenya ensuring your chicks arrive safely</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💉</div>
              <h3 className="text-xl font-bold mb-2">Pre-Vaccinated</h3>
              <p>All chicks are fully vaccinated before delivery for optimal health</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="text-xl font-bold mb-2">Marketing Days</h3>
              <p>We operate on Wednesday and Thursday for your convenience</p>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Service Locations</h2>
          <div className="bg-light-green p-8 rounded-xl border-2 border-primary">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {locations.map((location) => (
                <div key={location} className="flex items-center gap-2 text-gray-700">
                  <span className="text-accent text-lg">📍</span>
                  {location}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-accent text-charcoal p-12 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-lg mb-6">Contact us today for premium pre-vaccinated chicks</p>
          <div className="space-y-3">
            <p className="text-lg"><strong>📧 Email:</strong> cucumutugipoultry@gmail.com</p>
            <p className="text-lg"><strong>📱 Call:</strong> 0706972161 / 0740662799</p>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';

export default function FeedingProgrammePage() {
  const feedingProgrammes = [
    {
      type: "Broilers",
      feeds: [
        { stage: "Starter Crumbs or Mash", age: "0–21 days" },
        { stage: "Finisher Pellets or Mash", age: "22–35 days" }
      ]
    },
    {
      type: "Layers",
      feeds: [
        { stage: "Chick and Duckling Mash", age: "Week 1–8" },
        { stage: "Grower Mash", age: "Week 9–18 (up to point of lay)" },
        { stage: "Layer Mash", age: "From 18 weeks onwards" }
      ]
    },
    {
      type: "Improved Indigenous Chickens",
      breeds: "(Sasso, KARI Improved Kienyeji, Rainbow Rooster, Kuroiler, Kenbro)",
      feeds: [
        { stage: "Starter Mash", age: "0–50 days" },
        { stage: "Grower Mash", age: "51–75 days" },
        { stage: "Finisher Mash", age: "76–90 days (for meat production)" },
        { stage: "Layer Mash", age: "From 20–25 weeks onwards (for egg production)" }
      ]
    }
  ];

  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Feeding Programme</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Optimal nutrition for healthy growth and maximum productivity
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {/* Pre-Placement */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Pre-Placement Preparation</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            A flock that gets off to a good start is easier to manage and will perform well throughout the rearing period. Before chicks arrive, ensure:
          </p>
          <div className="bg-light-green p-8 rounded-xl space-y-4 border-l-4 border-primary">
            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p>House temperature is at the recommended level</p>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p>Adequate fresh air available through proper ventilation</p>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p>Feed and clean drinking water readily accessible</p>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <p>Sufficient lighting provided to encourage feeding and drinking</p>
            </div>
          </div>
        </div>

        {/* Feed Selection */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Selecting Quality Feed</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Feed represents the largest cost in commercial poultry production. It is therefore essential to purchase feed from a reputable manufacturer who can guarantee consistent quality and performance.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-8 rounded-xl mt-6 space-y-4">
            <h3 className="font-bold text-yellow-700 text-lg">⚠️ Important Guidelines:</h3>
            <div className="space-y-3 text-gray-700">
              <p><strong>❌ Do NOT:</strong> Mix feeds from different manufacturers</p>
              <p><strong>❌ Do NOT:</strong> Add unauthorized protein sources like fish meal</p>
              <p><strong>❌ Do NOT:</strong> Add mineral supplements like dicalcium phosphate (DCP)</p>
              <p className="text-sm">Such practices can alter nutrient balance and negatively affect bird performance. For example, fish meal above 5% can result in fishy taste in eggs and meat.</p>
            </div>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mt-6">
            <strong>Always consult with a qualified nutritionist</strong> before adding any supplements or making feed modifications.
          </p>
        </div>

        {/* Feeder Management */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Feeder Management</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            When starting a flock, provide feeder lids or plastic feeder trays at a rate of <strong>one tray per 100 chicks</strong>. Feed may also be spread on clean paper placed over the litter to encourage feed intake during the first few days.
          </p>
          
          <div className="space-y-6">
            <div className="bg-light-gold p-8 rounded-xl border-l-4 border-accent">
              <h3 className="font-bold text-lg text-accent mb-3">Transition Schedule:</h3>
              <ul className="space-y-3 text-gray-700">
                <li><strong>Days 1–10:</strong> Use feeder lids/trays and paper on litter</li>
                <li><strong>Day 10:</strong> Remove all feeder lids and trays, replace with standard feeders</li>
                <li><strong>Ongoing:</strong> Maintain recommended feeder space at all stages</li>
              </ul>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              Providing adequate feeder space is essential for healthy growth, uniform development, and optimal feed intake at every stage of production.
            </p>
          </div>
        </div>

        {/* Feeding Programmes */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Feeding Programmes by Class</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Different classes of poultry require specific feeds to meet their nutritional requirements at various stages of growth and production.
          </p>

          <div className="space-y-8">
            {feedingProgrammes.map((programme, idx) => (
              <div key={idx} className="bg-white border-2 border-primary rounded-xl p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">{programme.type}</h3>
                {programme.breeds && (
                  <p className="text-gray-600 text-sm mb-4 italic">{programme.breeds}</p>
                )}
                <div className="space-y-3">
                  {programme.feeds.map((feed, fidx) => (
                    <div key={fidx} className="flex justify-between items-start gap-4 pb-3 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="font-bold text-gray-800">{feed.stage}</p>
                      </div>
                      <p className="text-accent font-semibold whitespace-nowrap">{feed.age}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monitoring */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Regular Monitoring</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Regular monitoring of feed intake and bird performance is important to ensure that the feeding programme meets the nutritional needs of the flock and supports optimum growth, productivity, and profitability.
          </p>
          
          <div className="bg-light-green p-8 rounded-xl space-y-4 border-l-4 border-primary mt-6">
            <div className="flex gap-4">
              <span className="text-2xl">👀</span>
              <p>Observe feed consumption patterns and adjust as needed</p>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">📊</span>
              <p>Monitor bird weight and uniformity regularly</p>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">🏥</span>
              <p>Assess overall health and productivity indicators</p>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">📋</span>
              <p>Keep detailed records of feed usage and performance</p>
            </div>
          </div>
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

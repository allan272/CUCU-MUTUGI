import Link from 'next/link';
import { Check, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function BroodingManagementPage() {
  const temperatureGuide = [
    { week: 1, chipLevel: "33–35", houseLevel: "30–32" },
    { week: 2, chipLevel: "30–32", houseLevel: "27–29" },
    { week: 3, chipLevel: "27–29", houseLevel: "24–26" },
    { week: 4, chipLevel: "24–26", houseLevel: "21–23" }
  ];

  const cropFillTargets = [
    { time: "2 Hours", target: "75%" },
    { time: "12 Hours", target: ">85%" },
    { time: "24 Hours", target: ">95%" }
  ];

  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Brooding Management</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Essential guide for managing newly hatched chicks
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {/* Overview */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Overview</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Brooding is the process of providing newly hatched chicks with supplemental heat and optimal environmental conditions to support temperature regulation, growth, and early development. Since young chicks are unable to effectively regulate their body temperature, proper brooding is essential for ensuring bird welfare, health, and performance during the first weeks of life.
          </p>
        </div>

        {/* Pre-Placement */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Pre-Placement Preparation</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Prior to chick arrival, ensure the following measures are implemented:
          </p>
          <div className="bg-light-green p-8 rounded-xl space-y-4 border-l-4 border-primary">
            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p>Brooding house is thoroughly cleaned, disinfected, and maintained under strict biosecurity protocols.</p>
            </div>
            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p>Feeders and drinkers arranged for easy access to feed and water immediately upon arrival.</p>
            </div>
            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p>Supplementary feeders and drinkers positioned close to primary systems.</p>
            </div>
            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p>Chicks do not need to travel more than one metre to access feed or water during first 24 hours.</p>
            </div>
            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p>Brooding area pre-heated and temperature/humidity stabilized before chick placement.</p>
            </div>
            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p>Floor temperature maintained at approximately 28°C–30°C for optimal comfort.</p>
            </div>
          </div>
        </div>

        {/* Temperature Management */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Temperature Management</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Maintaining the correct temperature during the brooding period is essential for chick health, welfare, growth, and survival. Use thermometers positioned at chick height to ensure accurate readings.
          </p>
          
          <div className="overflow-x-auto bg-light-green rounded-xl p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="text-left p-3 font-bold text-primary">Age (Weeks)</th>
                  <th className="text-left p-3 font-bold text-primary">Temperature at Chick Level (°C)</th>
                  <th className="text-left p-3 font-bold text-primary">House Temperature (°C)</th>
                </tr>
              </thead>
              <tbody>
                {temperatureGuide.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-300">
                    <td className="p-3">{row.week}</td>
                    <td className="p-3">{row.chipLevel}</td>
                    <td className="p-3">{row.houseLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
              <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2"><XCircle className="h-5 w-5" /> When Temperatures Are Too Low:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Chicks huddle closely together beneath heat source</li>
                <li>• Increased chirping or distress calls</li>
                <li>• Feed and water intake decline</li>
                <li>• Growth rates reduced, mortality increases</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
              <h3 className="font-bold text-yellow-700 mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> When Temperatures Are Too High:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Chicks move away from heat, gather at edges</li>
                <li>• Birds pant and show heat stress</li>
                <li>• Water consumption increases, feed decreases</li>
                <li>• Growth and uniformity negatively affected</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Space Management */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Space Management During Brooding</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Provide adequate space to promote bird welfare and uniform growth. During the first week, the brooding area should occupy approximately one-third of the poultry house. Expand gradually every two days to accommodate growing birds:
          </p>
          <div className="bg-light-gold p-8 rounded-xl space-y-3 border-l-4 border-accent">
            <p className="text-gray-700"><strong>Week 1:</strong> One-third of the house</p>
            <p className="text-gray-700"><strong>Week 2:</strong> Two-thirds of the house (after day 14)</p>
            <p className="text-gray-700"><strong>Week 3+:</strong> Full access to entire house</p>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mt-6">
            Overcrowding can result in reduced feed/water access, poor uniformity, increased stress, higher mortality, and stunting.
          </p>
        </div>

        {/* Ventilation */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Ventilation Management</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Proper ventilation is critical during brooding and helps maintain air quality, control moisture, and create a healthy environment. Maintain minimum ventilation opening at the top of the poultry house. During high temperature periods, open curtains from the top (not bottom) to encourage airflow while preventing direct drafts that may compromise chick health.
          </p>
        </div>

        {/* Feeding Management */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Feeding Management</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Early access to feed and water is critical for chick health and growth. Monitor crop fill during the first 24 hours to assess whether chicks have successfully located feed and water.
          </p>
          
          <div className="overflow-x-auto bg-light-green rounded-xl p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="text-left p-3 font-bold text-primary">Time After Placement</th>
                  <th className="text-left p-3 font-bold text-primary">Target Crop Fill (% of Chicks)</th>
                </tr>
              </thead>
              <tbody>
                {cropFillTargets.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-300">
                    <td className="p-3">{row.time}</td>
                    <td className="p-3 font-bold text-accent">{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-gray-700 text-lg leading-relaxed mt-6">
            Examine a sample of 30–40 chicks from three to four different locations within the brooding area. If targets are not met, evaluate feeder/drinker placement, brooding temperature, lighting, stocking density, and chick comfort.
          </p>
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

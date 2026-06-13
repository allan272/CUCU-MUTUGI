import Link from 'next/link';

export default function WaterManagementPage() {
  const waterSpaceRequirements = [
    {
      type: "Trough",
      space: "2.0 cm per bird"
    },
    {
      type: "Bell-Shaped Drinker (35 cm diameter)",
      space: "6–9 drinkers per 1,000 birds (min 4)"
    },
    {
      type: "Nipple Drinker",
      space: "8–10 birds per nipple"
    }
  ];

  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Water Management</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Essential guide for providing clean drinking water and managing drinker systems
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {/* Overview */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Water Management Overview</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Drinking equipment should be evenly distributed throughout the poultry house and alternated with feeders to ensure easy access for all birds. <strong>No bird should have to travel more than 1.5 metres to reach either feed or water.</strong>
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Clean, fresh water should be available at all times to support optimal growth, health, and performance. During the first week, provide one chick drinker (fount) for every 75 chicks. As the birds grow, gradually replace chick drinkers with regular drinkers while ensuring adequate drinking space is maintained for the entire flock.
          </p>
        </div>

        {/* Introduction */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Why Water Management Matters</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Access to clean, fresh drinking water is essential for chick health, growth, and performance. Birds must have continuous access to wholesome drinking water throughout the production cycle, and drinkers should never be allowed to run dry.
          </p>
        </div>

        {/* Drinker Distribution */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Drinker Placement and Distribution</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Drinking equipment should be distributed evenly throughout the poultry house and alternated with feeders to ensure easy access for all birds. <strong>No bird should have to travel more than 1.5 metres to reach either feed or water.</strong>
          </p>

          <div className="bg-light-green p-8 rounded-xl space-y-6 border-l-4 border-primary">
            <div>
              <h3 className="font-bold text-primary text-lg mb-2">During First Week:</h3>
              <p className="text-gray-700">Provide <strong>one chick drinker (fount) for every 75 chicks</strong></p>
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg mb-2">As Birds Grow:</h3>
              <p className="text-gray-700">Gradually replace chick drinkers with standard drinkers while ensuring adequate drinking space is maintained</p>
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg mb-2">Equipment Maintenance:</h3>
              <p className="text-gray-700">Chick drinkers should be washed and disinfected daily, then refilled with clean, fresh water</p>
            </div>
          </div>
        </div>

        {/* Height Adjustment */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Height Adjustment</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            As birds grow, regularly adjust the height of both drinkers and feeders so that they remain slightly above the level of the birds' backs. This helps reduce feed and water wastage through spillage and promotes optimal bird comfort and access.
          </p>
        </div>

        {/* Water Recommendations */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Drinking Water Recommendations</h2>
          
          <div className="space-y-6">
            <div className="bg-light-gold p-8 rounded-xl border-l-4 border-accent">
              <h3 className="font-bold text-lg text-accent mb-3">🌡️ Temperature Management:</h3>
              <p className="text-gray-700">During hot weather, provide cool drinking water to help maintain feed intake, bird comfort, and overall productivity. Water storage tanks should be protected from direct sunlight and, where possible, have reflective surfaces to minimize water heating.</p>
            </div>

            <div className="bg-green-50 p-8 rounded-xl border-l-4 border-green-500">
              <h3 className="font-bold text-lg text-green-700 mb-3">💧 Water Quality:</h3>
              <p className="text-gray-700">To maintain water quality and reduce disease risk, use a reliable water sanitiser such as <strong>chlorine</strong> to control harmful microorganisms in the drinking water system.</p>
            </div>

            <div className="bg-blue-50 p-8 rounded-xl border-l-4 border-blue-500">
              <h3 className="font-bold text-lg text-blue-700 mb-3">🚰 Hygiene Practice:</h3>
              <p className="text-gray-700">Maintain clean drinkers by washing and disinfecting daily. Never allow drinkers to run dry, and always provide fresh water throughout the production cycle.</p>
            </div>
          </div>
        </div>

        {/* Water Space Requirements */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Recommended Water Space Requirements</h2>
          
          <div className="overflow-x-auto bg-light-green rounded-xl p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="text-left p-4 font-bold text-primary">Type of Drinker</th>
                  <th className="text-left p-4 font-bold text-primary">Recommended Water Space</th>
                </tr>
              </thead>
              <tbody>
                {waterSpaceRequirements.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-300 hover:bg-green-200 transition-colors">
                    <td className="p-4 font-medium">{item.type}</td>
                    <td className="p-4 text-accent font-bold">{item.space}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mt-6">
            Maintaining these recommendations ensures all birds have adequate access to water and reduces competition and stress during peak drinking times.
          </p>
        </div>

        {/* Best Practices */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Best Practices for Water Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-primary rounded-xl p-6">
              <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                <span>✓</span> Daily Maintenance
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Clean and disinfect drinkers daily</li>
                <li>• Check water level regularly</li>
                <li>• Monitor for leaks and damage</li>
                <li>• Refill with fresh water</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-primary rounded-xl p-6">
              <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                <span>✓</span> Monitoring & Adjustment
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Observe water consumption patterns</li>
                <li>• Adjust drinker height as birds grow</li>
                <li>• Monitor bird behavior and health</li>
                <li>• Keep records of water usage</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-primary rounded-xl p-6">
              <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                <span>✓</span> Equipment Management
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Distribute drinkers evenly</li>
                <li>• Alternate with feeders</li>
                <li>• Never allow drinkers to run dry</li>
                <li>• Protect storage tanks from sunlight</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-primary rounded-xl p-6">
              <h3 className="font-bold text-primary text-lg mb-4 flex items-center gap-2">
                <span>✓</span> Quality Control
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Use water sanitiser regularly</li>
                <li>• Maintain proper water temperature</li>
                <li>• Ensure adequate water quality</li>
                <li>• Test water safety periodically</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Impact on Performance */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Impact on Bird Performance</h2>
          
          <div className="bg-primary text-white p-8 rounded-xl space-y-4 border-l-4 border-accent">
            <p className="text-lg">Proper water management contributes significantly to:</p>
            <ul className="space-y-3 text-light-green">
              <li>✓ Improved bird health and welfare</li>
              <li>✓ Optimal growth and development</li>
              <li>✓ Enhanced feed efficiency and conversion</li>
              <li>✓ Better uniformity across the flock</li>
              <li>✓ Increased productivity and profitability</li>
              <li>✓ Reduced stress and mortality rates</li>
            </ul>
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

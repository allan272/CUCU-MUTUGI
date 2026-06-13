import Link from 'next/link';

export default function HygieneSanitationPage() {
  const disinfectants = [
    {
      type: "Oxidizing Agents",
      examples: "Hydrogen Peroxide",
      advantages: "Broad-spectrum antimicrobial activity",
      disadvantages: "Corrosive; reduced effectiveness with organic matter"
    },
    {
      type: "Alcohols",
      examples: "Ethanol, Isopropyl Alcohol",
      advantages: "Broad-spectrum; inexpensive; fast-acting",
      disadvantages: "Highly flammable; evaporates quickly"
    },
    {
      type: "Halogens",
      examples: "Iodine, Iodophors",
      advantages: "Broad-spectrum; relatively inexpensive",
      disadvantages: "Can be corrosive to equipment"
    },
    {
      type: "Phenolic Compounds",
      examples: "Phenols",
      advantages: "Effective in footbaths; wide range activity",
      disadvantages: "Limited effectiveness against some viruses"
    },
    {
      type: "Quaternary Ammonium Compounds",
      examples: "TH4",
      advantages: "Broad-spectrum; good cleaning properties",
      disadvantages: "Expensive; less effective with organic matter"
    },
    {
      type: "Aldehydes",
      examples: "Formalin (Formaldehyde)",
      advantages: "Broad-spectrum; highly effective",
      disadvantages: "Toxic to humans; expensive"
    }
  ];

  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Hygiene and Sanitation</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Best practices for maintaining disease-free poultry facilities
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {/* Clean Out Process */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Complete Cleanout Procedure</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Once the previous flock has been harvested or depleted, the poultry house and all equipment should be thoroughly cleaned and disinfected. The house should remain vacant for a minimum of <strong>two weeks</strong> before the arrival of the next flock. This downtime helps reduce the buildup and spread of disease-causing organisms.
          </p>

          <div className="space-y-6 mt-8">
            <div className="bg-light-green p-6 rounded-lg border-l-4 border-primary">
              <h3 className="font-bold text-primary mb-3">Step 1: Prepare the House</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Remove all birds from the house</li>
                <li>• Take all equipment out of the house</li>
                <li>• Lightly dampen ceiling, walls, and litter with water to minimize dust</li>
              </ul>
            </div>

            <div className="bg-light-green p-6 rounded-lg border-l-4 border-primary">
              <h3 className="font-bold text-primary mb-3">Step 2: Remove Old Litter</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Remove all old litter from the house</li>
                <li>• Dispose of litter at least 1.5 km away from farm premises</li>
                <li>• Do NOT store or spread used litter near the poultry house</li>
                <li>• Used litter may re-contaminate the cleaned facility</li>
              </ul>
            </div>

            <div className="bg-light-green p-6 rounded-lg border-l-4 border-primary">
              <h3 className="font-bold text-primary mb-3">Step 3: Remove Unused Feed</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Dispose of all unused feed remaining in the house</li>
                <li>• Do NOT carry feed to the next flock</li>
                <li>• Exception: Feed stored separately in sealed bags away from house</li>
              </ul>
            </div>

            <div className="bg-light-green p-6 rounded-lg border-l-4 border-primary">
              <h3 className="font-bold text-primary mb-3">Step 4: Wash Thoroughly</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Use water and detergent starting with roof</li>
                <li>• Proceed to walls, then finally the floor</li>
                <li>• Allow the house to dry completely before applying disinfectant</li>
              </ul>
            </div>

            <div className="bg-light-green p-6 rounded-lg border-l-4 border-primary">
              <h3 className="font-bold text-primary mb-3">Step 5: Disinfect</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Apply disinfectant solution working from roof downward</li>
                <li>• Use pressure washer with jet nozzle for thorough coverage</li>
                <li>• Ensure all interior surfaces are thoroughly soaked</li>
                <li>• Work systematically from top to bottom</li>
              </ul>
            </div>

            <div className="bg-light-green p-6 rounded-lg border-l-4 border-primary">
              <h3 className="font-bold text-primary mb-3">Step 6: Equipment Maintenance</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Wash all equipment thoroughly</li>
                <li>• Disinfect all equipment</li>
                <li>• Inspect for damage</li>
                <li>• Complete necessary repairs and maintenance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disinfectants */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Common Disinfectants in Poultry Production</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Different disinfectants have varying effectiveness and characteristics. Choose based on your specific needs and facility conditions.
          </p>

          <div className="space-y-4">
            {disinfectants.map((item, idx) => (
              <div key={idx} className="bg-white border-2 border-primary rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-primary mb-2">{item.type}</h3>
                    <p className="text-sm text-gray-600 mb-3"><strong>Examples:</strong> {item.examples}</p>
                  </div>
                  <div></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded">
                    <p className="text-sm font-bold text-green-700 mb-2">✓ Advantages</p>
                    <p className="text-sm text-gray-700">{item.advantages}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded">
                    <p className="text-sm font-bold text-red-700 mb-2">✗ Disadvantages</p>
                    <p className="text-sm text-gray-700">{item.disadvantages}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Biosecurity */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Biosecurity and Farm Sanitation</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Maintaining good hygiene is one of the most important factors in keeping poultry healthy. Effective farm sanitation involves thorough cleaning and the use of appropriate disinfectants. However, <strong>disinfectants can be rendered ineffective by the presence of organic matter</strong>; therefore, proper cleaning must always precede disinfection.
          </p>

          <div className="space-y-6 mt-6">
            <div className="bg-light-gold p-8 rounded-xl border-l-4 border-accent">
              <h3 className="font-bold text-accent text-lg mb-4">All-In-All-Out System</h3>
              <p className="text-gray-700">
                An all-in-all-out production system is considered the best management practice in poultry farming, as it helps prevent the buildup and spread of disease-causing organisms. Where flocks of different ages must be kept, each flock should be housed separately to minimize disease transmission.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-primary text-lg">Access Control & Visitor Management</h3>
              <p className="text-gray-700 mb-4">Access to poultry houses should be restricted to authorized staff only. When visitors are permitted entry, record the following information:</p>
              <div className="bg-white border-2 border-primary rounded-xl p-6 space-y-2 text-gray-700">
                <p>• Name, address, and telephone number</p>
                <p>• Place of origin</p>
                <p>• Purpose of the visit</p>
                <p>• The last farm visited</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-primary text-lg">Worker Hygiene Practices</h3>
              <p className="text-gray-700 mb-4">Poultry workers should maintain strict hygiene standards:</p>
              <div className="bg-white border-2 border-primary rounded-xl p-6 space-y-2 text-gray-700">
                <p>• Wear clean, disinfected clothing and footwear at all times</p>
                <p>• When visiting flocks of different ages: begin with youngest, proceed to older birds</p>
                <p>• Attend to sick flocks LAST, regardless of age, to reduce disease spread</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-primary text-lg">Pest and Contamination Control</h3>
              <p className="text-gray-700 mb-4">Implement effective measures to control vectors of disease:</p>
              <div className="bg-white border-2 border-primary rounded-xl p-6 space-y-2 text-gray-700">
                <p>• Control rodents, wild birds, and insects</p>
                <p>• Use mechanical, biological, or chemical control methods</p>
                <p>• Never introduce materials into houses without thorough cleaning and disinfection</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-primary text-lg">Water System Sanitation</h3>
              <p className="text-gray-700 mb-4">Maintain clean water systems:</p>
              <div className="bg-white border-2 border-primary rounded-xl p-6 space-y-2 text-gray-700">
                <p>• Open, inspect, and scrub water storage/header tanks using detergent</p>
                <p>• Completely drain the drinking system before cleaning solution</p>
                <p>• Circulate sanitizing solution throughout the drinking system</p>
                <p>• If circulation not possible: allow solution to remain for at least 12 hours</p>
                <p>• Thoroughly flush with clean water before use</p>
              </div>
            </div>
          </div>
        </div>

        {/* House Preparation */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">House Preparation After Disinfection</h2>
          
          <div className="space-y-4">
            <div className="bg-light-green p-8 rounded-xl border-l-4 border-primary">
              <h3 className="font-bold text-primary text-lg mb-4">Reinstate Biosecurity</h3>
              <p className="text-gray-700">Once the house is completely dry, reinstate all biosecurity measures at the poultry house entrances.</p>
            </div>

            <div className="bg-light-green p-8 rounded-xl border-l-4 border-primary">
              <h3 className="font-bold text-primary text-lg mb-4">Add Litter Material</h3>
              <p className="text-gray-700 mb-3">Spread approximately <strong>4 inches (10 cm)</strong> of litter material evenly across the floor. Common materials include:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Wood shavings</li>
                <li>Straw</li>
                <li>Rice husks</li>
                <li>Coffee husks</li>
              </ul>
              <p className="text-gray-700 mt-3">Good-quality litter should provide insulation, absorb moisture effectively, and maintain a dry, comfortable environment for birds.</p>
            </div>

            <div className="bg-light-green p-8 rounded-xl border-l-4 border-primary">
              <h3 className="font-bold text-primary text-lg mb-4">Return Equipment</h3>
              <p className="text-gray-700">Return all cleaned and disinfected equipment to the house.</p>
            </div>

            <div className="bg-light-green p-8 rounded-xl border-l-4 border-primary">
              <h3 className="font-bold text-primary text-lg mb-4">Brooder Preparation</h3>
              <p className="text-gray-700">Prepare the brooder area at least <strong>24 hours before chick arrival</strong> to ensure temperature, equipment, feed, and water systems are properly set up and functioning.</p>
            </div>
          </div>
        </div>

        {/* Monitoring */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Sanitation Effectiveness Evaluation</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            To evaluate the effectiveness of the sanitation program, use both visual inspections and microbiological testing. Quantitative laboratory tests can assess the level of microbial contamination.
          </p>
          
          <div className="bg-primary text-white p-8 rounded-xl space-y-4 border-l-4 border-accent">
            <p className="text-lg">
              Although <strong>complete sterilization</strong> of poultry facilities is not practical, <strong>regular microbiological monitoring</strong> can help verify that harmful pathogens, such as Salmonella, have been effectively eliminated.
            </p>
            <p className="text-light-green text-lg">
              Routine monitoring and strict adherence to biosecurity protocols are essential for maintaining flock health and reducing the risk of disease outbreaks.
            </p>
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

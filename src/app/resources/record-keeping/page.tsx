import Link from 'next/link';
import { LineChart, DollarSign, TrendingUp, AlertTriangle, Activity, Bird, Syringe, Home, Briefcase, ClipboardList, Check, ArrowLeft } from 'lucide-react';

export default function RecordKeepingPage() {
  return (
    <div className="bg-white text-charcoal min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Record Keeping</h1>
        <p className="text-xl max-w-2xl mx-auto text-light-green">
          Accurate documentation for flock management and profitability
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {/* Importance */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Why Record Keeping Matters</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Accurate record keeping is essential for monitoring the performance and profitability of a flock. It provides valuable information for forecasting, planning, and cash flow projections, while also serving as an early warning system for identifying potential problems.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Key Benefits of Accurate Records</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-light-green p-8 rounded-xl border-l-4 border-primary">
              <h3 className="font-bold text-primary text-lg mb-3 flex items-center gap-2">
                <LineChart className="h-6 w-6 text-primary flex-shrink-0" /> Performance Monitoring
              </h3>
              <p className="text-gray-700">
                Track flock growth, feed conversion, mortality rates, and production metrics to identify trends and improvements.
              </p>
            </div>

            <div className="bg-light-green p-8 rounded-xl border-l-4 border-primary">
              <h3 className="font-bold text-primary text-lg mb-3 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary flex-shrink-0" /> Profitability Analysis
              </h3>
              <p className="text-gray-700">
                Calculate costs, revenues, and profit margins to understand farm economics and optimize operations.
              </p>
            </div>

            <div className="bg-light-green p-8 rounded-xl border-l-4 border-primary">
              <h3 className="font-bold text-primary text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary flex-shrink-0" /> Forecasting & Planning
              </h3>
              <p className="text-gray-700">
                Use historical data to predict future performance and plan production strategies accordingly.
              </p>
            </div>

            <div className="bg-light-green p-8 rounded-xl border-l-4 border-primary">
              <h3 className="font-bold text-primary text-lg mb-3 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary flex-shrink-0" /> Cash Flow Management
              </h3>
              <p className="text-gray-700">
                Project income and expenses to ensure adequate liquidity and financial stability.
              </p>
            </div>

            <div className="bg-light-green p-8 rounded-xl border-l-4 border-primary">
              <h3 className="font-bold text-primary text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-primary flex-shrink-0" /> Early Warning System
              </h3>
              <p className="text-gray-700">
                Identify potential problems early through trend analysis and anomalies in production data.
              </p>
            </div>

            <div className="bg-light-green p-8 rounded-xl border-l-4 border-primary">
              <h3 className="font-bold text-primary text-lg mb-3 flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary flex-shrink-0" /> Health Tracking
              </h3>
              <p className="text-gray-700">
                Monitor disease outbreaks, vaccination schedules, treatments, and bird health status.
              </p>
            </div>
          </div>
        </div>

        {/* Daily Records */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Daily Record Keeping</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Daily records should be maintained accurately and displayed in each poultry house for easy reference and effective management. Consistent daily documentation ensures you capture important information while it's fresh and accurate.
          </p>

          <div className="bg-light-gold p-8 rounded-xl border-l-4 border-accent mt-6">
            <h3 className="font-bold text-accent text-lg mb-4">Display Records in the House</h3>
            <p className="text-gray-700">
              Post records in each poultry house for easy access by all staff. This ensures everyone can reference current information and contribute to accurate record keeping.
            </p>
          </div>
        </div>

        {/* Types of Records */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Essential Records to Maintain</h2>
          
          <div className="space-y-4">
            <div className="bg-white border-2 border-primary rounded-xl p-6">
              <h3 className="font-bold text-primary text-lg mb-3 flex items-center gap-2"><Bird className="h-5 w-5" /> Flock Information</h3>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• Flock number and starting date</li>
                <li>• Breed and strain information</li>
                <li>• Initial number of birds</li>
                <li>• Source of chicks (supplier)</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-primary rounded-xl p-6">
              <h3 className="font-bold text-primary text-lg mb-3 flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Production Data</h3>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• Daily feed consumption</li>
                <li>• Daily water consumption</li>
                <li>• Bird weight (periodic weighing)</li>
                <li>• Egg production (for layers)</li>
                <li>• Mortality rates and causes</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-primary rounded-xl p-6">
              <h3 className="font-bold text-primary text-lg mb-3 flex items-center gap-2"><Syringe className="h-5 w-5" /> Health & Vaccination Records</h3>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• Vaccination dates and types</li>
                <li>• Disease outbreaks or health issues</li>
                <li>• Medication treatments given</li>
                <li>• Veterinary visits and recommendations</li>
                <li>• Withdrawal periods for medications</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-primary rounded-xl p-6">
              <h3 className="font-bold text-primary text-lg mb-3 flex items-center gap-2"><Home className="h-5 w-5" /> Management Activities</h3>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• Equipment maintenance and repairs</li>
                <li>• Cleaning and disinfection activities</li>
                <li>• Environmental conditions (temperature, humidity)</li>
                <li>• Personnel activities in the house</li>
                <li>• Visitor access and biosecurity measures</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-primary rounded-xl p-6">
              <h3 className="font-bold text-primary text-lg mb-3 flex items-center gap-2"><Briefcase className="h-5 w-5" /> Financial Records</h3>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• Feed purchases and costs</li>
                <li>• Chick purchases and costs</li>
                <li>• Medication and vaccination costs</li>
                <li>• Labor costs</li>
                <li>• Revenue from bird/egg sales</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-primary rounded-xl p-6">
              <h3 className="font-bold text-primary text-lg mb-3 flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Compliance & Traceability</h3>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• Feed supplier and batch numbers</li>
                <li>• Medication lot numbers and expiry dates</li>
                <li>• Biosecurity protocol compliance</li>
                <li>• Audit trails and signed records</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Record Keeping Best Practices</h2>
          
          <div className="bg-light-green p-8 rounded-xl space-y-4 border-l-4 border-primary">
            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Document Daily:</strong> Record information each day while it's accurate and fresh</p>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Use Clear Format:</strong> Use standardized forms to ensure consistency and easy reading</p>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Include Details:</strong> Record specific information (dates, times, quantities, person responsible)</p>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Maintain Legibility:</strong> Write clearly or use digital records that are easy to read</p>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Store Safely:</strong> Keep records in a protected location to prevent damage or loss</p>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Review Regularly:</strong> Analyze records periodically to track trends and identify issues</p>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Sign & Date:</strong> Ensure records are signed by responsible person for accountability</p>
            </div>

            <div className="flex gap-4">
              <Check className="text-accent h-5 w-5 flex-shrink-0" />
              <p className="text-gray-700"><strong>Retain Long-term:</strong> Keep records for at least 2-3 years for historical comparison</p>
            </div>
          </div>
        </div>

        {/* Action Item */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary">Taking Action on Records</h2>
          <div className="bg-primary text-white p-8 rounded-xl border-l-4 border-accent">
            <p className="text-lg leading-relaxed">
              Record keeping is not just about documentation—it's about using data to improve your operation. Regularly review your records to identify trends, spot problems early, make informed decisions, and continuously improve your poultry farming performance and profitability.
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

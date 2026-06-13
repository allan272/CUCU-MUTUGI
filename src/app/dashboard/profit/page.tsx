import Link from 'next/link';

export default function DashboardProfitPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Profit Tracker</h1>
          <p className="text-gray-600">See revenue, costs and profit estimates for your farm.</p>
        </div>
        <Link href="/dashboard" className="inline-block bg-primary text-white px-5 py-3 rounded-lg shadow-sm hover:bg-primary/90 transition-colors">
          ← Back to Overview
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-3xl font-bold text-charcoal">KES 92,500</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Costs</p>
          <p className="text-3xl font-bold text-charcoal">KES 48,700</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Estimated Profit</p>
          <p className="text-3xl font-bold text-charcoal">KES 43,800</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-primary mb-4">Profit Notes</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Revenue is based on recent orders and average selling price.</li>
          <li>Costs include feed, vaccines, labour and transport estimates.</li>
          <li>Update your product prices in the Admin panel for more accurate values.</li>
        </ul>
      </div>
    </div>
  );
}

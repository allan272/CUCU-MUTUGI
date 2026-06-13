import Link from 'next/link';

export default function DashboardFlocksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Flocks</h1>
          <p className="text-gray-600">Track each flock on your farm and review flock size, age and breed.</p>
        </div>
        <Link href="/dashboard" className="inline-block bg-primary text-white px-5 py-3 rounded-lg shadow-sm hover:bg-primary/90 transition-colors">
          ← Back to Overview
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-primary mb-3">Kuroiler Flock</h2>
          <p className="text-gray-500 mb-4">Age: 4 weeks</p>
          <div className="space-y-2 text-sm text-gray-700">
            <p>Birds: 420</p>
            <p>Feed per day: 12 kg</p>
            <p>Status: Healthy</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-primary mb-3">Layers Flock</h2>
          <p className="text-gray-500 mb-4">Age: 8 weeks</p>
          <div className="space-y-2 text-sm text-gray-700">
            <p>Birds: 310</p>
            <p>Feed per day: 10 kg</p>
            <p>Status: Good</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-primary mb-3">Broiler Flock</h2>
          <p className="text-gray-500 mb-4">Age: 3 weeks</p>
          <div className="space-y-2 text-sm text-gray-700">
            <p>Birds: 175</p>
            <p>Feed per day: 9 kg</p>
            <p>Status: Growing well</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-primary mb-4">Flock Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-3xl p-5">
            <p className="text-sm text-gray-500">Total birds</p>
            <p className="text-3xl font-bold text-charcoal">905</p>
          </div>
          <div className="bg-slate-50 rounded-3xl p-5">
            <p className="text-sm text-gray-500">Average age</p>
            <p className="text-3xl font-bold text-charcoal">5 weeks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

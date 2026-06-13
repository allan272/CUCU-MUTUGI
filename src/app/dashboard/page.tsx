import Link from 'next/link';

export default function DashboardOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back, Farmer!</h1>
      <p className="text-gray-600 mb-8">Here's what's happening with your flocks today.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-t-primary">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Flocks</h3>
          <p className="text-3xl font-bold text-charcoal">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-t-accent">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Birds</h3>
          <p className="text-3xl font-bold text-charcoal">1,250</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-t-blue-500">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Feed Used (This Week)</h3>
          <p className="text-3xl font-bold text-charcoal">450 kg</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-t-red-500">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Mortality Rate</h3>
          <p className="text-3xl font-bold text-charcoal">1.2%</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-primary mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/feed" className="flex flex-col items-center p-4 bg-light-green rounded-lg hover:bg-green-100 transition-colors">
            <span className="text-2xl mb-2">🌾</span>
            <span className="font-medium text-charcoal">Log Feed</span>
          </Link>
          <Link href="/dashboard/mortality" className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <span className="text-2xl mb-2">⚠️</span>
            <span className="font-medium text-charcoal">Log Mortality</span>
          </Link>
          <Link href="/dashboard/profit" className="flex flex-col items-center p-4 bg-light-gold rounded-lg hover:bg-yellow-100 transition-colors">
            <span className="text-2xl mb-2">💰</span>
            <span className="font-medium text-charcoal">Estimate Profit</span>
          </Link>
          <Link href="/dashboard/flocks" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="text-2xl mb-2">🐣</span>
            <span className="font-medium text-charcoal">Manage Flocks</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

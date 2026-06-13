import Link from 'next/link';

export default function DashboardFeedPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Feed Log</h1>
          <p className="text-gray-600">Record and review your feed usage for each flock.</p>
        </div>
        <Link href="/dashboard" className="inline-block bg-primary text-white px-5 py-3 rounded-lg shadow-sm hover:bg-primary/90 transition-colors">
          ← Back to Overview
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead>
            <tr className="border-b border-gray-200">
              {['Date', 'Flock', 'Feed used', 'Notes'].map((heading) => (
                <th key={heading} className="py-3 px-3 font-medium text-gray-500 uppercase tracking-wide">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['2026-06-11', 'Kuroiler Flock', '12 kg', 'Normal'],
              ['2026-06-11', 'Layers Flock', '10 kg', 'Good appetite'],
              ['2026-06-10', 'Broiler Flock', '9 kg', 'Stable growth'],
            ].map((row) => (
              <tr key={row[0] + row[1]} className="border-b border-gray-100 hover:bg-slate-50">
                {row.map((cell) => (
                  <td key={cell} className="py-3 px-3">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

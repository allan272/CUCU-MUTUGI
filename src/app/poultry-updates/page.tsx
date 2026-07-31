import PoultryUpdatesBar from '@/components/stories/PoultryUpdatesBar';

export const metadata = {
  title: 'Poultry Updates | Cucu Mutugi Poultry',
  description: 'Farm stories, updates, and news from Cucu Mutugi Poultry.',
};

export default function PoultryUpdatesPage() {
  return (
    <div className="min-h-[80vh] flex flex-col bg-slate-50">
      <div className="py-12 px-4 text-center bg-gradient-to-br from-primary via-primary-dark to-accent-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80')] opacity-10 bg-cover bg-center" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-accent-light mb-3 drop-shadow-lg">Farm Stories & Updates</h1>
          <p className="text-white text-lg max-w-2xl mx-auto font-medium">Catch up on the latest farm activities, new chick arrivals, and important announcements straight from Cucu Mutugi Poultry.</p>
        </div>
      </div>
      
      {/* We add a container to make the bar look good as a standalone component */}
      <div className="flex-1 w-full bg-slate-900">
        <PoultryUpdatesBar />
        
        <div className="max-w-4xl mx-auto py-16 px-4 text-center text-slate-400">
          <p>Click on any of the update circles above to view the full story.</p>
          <p className="text-sm mt-2">Updates disappear after 24 hours.</p>
        </div>
      </div>
    </div>
  );
}

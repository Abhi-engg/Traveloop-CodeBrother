import { Link } from "react-router-dom";
import { mockTrips, mockStats } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";

const DashboardPage = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--cream)] dark:bg-gray-950 transition-colors duration-300 pb-20 lg:pb-0">
      
      {/* Top Header / Stats Bar */}
      <header className="px-6 py-8 md:px-12 md:py-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)] dark:text-gray-400 font-semibold mb-1">
            Welcome back
          </p>
          <h1 className="text-3xl font-bold text-[var(--indigo)] dark:text-white">
            Your Travel Studio
          </h1>
        </div>
        
        <div className="flex items-center gap-6 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Trips</span>
            <span className="text-xl font-semibold dark:text-white">{mockStats.totalTrips}</span>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Countries</span>
            <span className="text-xl font-semibold dark:text-white">{mockStats.countriesVisited}</span>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Saved</span>
            <span className="text-xl font-semibold text-emerald-500">₹{mockStats.totalSaved.toLocaleString()}</span>
          </div>
          
          <button 
            onClick={logout}
            className="ml-4 rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white whitespace-nowrap"
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="px-6 py-10 md:px-12 space-y-12 max-w-7xl mx-auto">
        
        {/* Next Departure Banner */}
        <section className="relative rounded-[2rem] overflow-hidden shadow-2xl group">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${mockTrips[0].coverPhoto})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--indigo)]/90 via-[var(--indigo)]/60 to-transparent dark:from-gray-900/95 dark:via-gray-900/70" />
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-white max-w-xl">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest bg-[#ff6b47] rounded-full">
                Next Departure
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-3">{mockTrips[0].name}</h2>
              <p className="text-lg text-white/80 font-light mb-6">
                {mockTrips[0].destinations}
              </p>
              
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  ⏳ 14 Days left
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  👥 {mockTrips[0].travelers} Travelers
                </div>
              </div>
            </div>
            
            <Link 
              to="/itinerary/builder" 
              className="bg-white text-[var(--indigo)] hover:bg-gray-50 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap text-center"
            >
              Open Itinerary →
            </Link>
          </div>
        </section>

        {/* Recent Trips Horizontal Scroll */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[var(--indigo)] dark:text-white">Your Adventures</h3>
            <Link to="/create-trip" className="text-sm font-bold text-[#ff6b47] hover:underline flex items-center gap-1">
              <span>+</span> New Trip
            </Link>
          </div>
          
          <div className="flex overflow-x-auto pb-8 -mx-6 px-6 gap-6 hide-scrollbar snap-x">
            {/* New Trip Card */}
            <Link to="/create-trip" className="snap-start shrink-0 w-72 md:w-80 h-96 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-transparent flex flex-col items-center justify-center text-gray-400 hover:text-[var(--indigo)] dark:hover:text-[#ff6b47] hover:border-[var(--indigo)] dark:hover:border-[#ff6b47] hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all group">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-50 dark:group-hover:bg-gray-700 transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
              <span className="font-semibold text-lg">Plan New Trip</span>
            </Link>

            {mockTrips.map((trip) => (
              <div key={trip.id} className="snap-start shrink-0 w-72 md:w-80 h-96 rounded-3xl overflow-hidden shadow-lg group relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <div className="h-48 overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${trip.coverPhoto})` }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                    {trip.status === 'upcoming' ? 'Upcoming' : trip.status === 'planning' ? 'Planning' : 'Past'}
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-semibold mb-1">{trip.startDate} — {trip.endDate}</p>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[var(--indigo)] dark:group-hover:text-indigo-400 transition-colors">{trip.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-1">{trip.destinations}</p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs font-medium mb-1 dark:text-gray-300">
                      <span>Budget</span>
                      <span>₹{trip.spent.toLocaleString()} / ₹{trip.budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-1.5 rounded-full" 
                        style={{ width: `${Math.min((trip.spent / trip.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default DashboardPage;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { mockTrips, initialItineraryColumns } from "../data/mockData";

const SharedTrip = () => {
  const navigate = useNavigate();
  const [isCopying, setIsCopying] = useState(false);
  const trip = mockTrips[0]; // Iberian Sunsets

  const handleCopyTrip = () => {
    setIsCopying(true);
    
    // Simulate API delay
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#ff6b47', '#10B981']
      });
      
      setTimeout(() => {
        navigate("/"); // Redirect to dashboard
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] dark:bg-gray-950 transition-colors duration-300 pb-20">
      
      {/* Premium Hero Banner */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${trip.coverPhoto})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        
        {/* Top Nav (Public Mode) */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <p className="text-sm uppercase tracking-[0.4em] text-white/90 font-bold">
            Traveloop
          </p>
          <div className="flex gap-3">
             <Link to="/login" className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white transition-colors">
               Log In
             </Link>
             <Link to="/login" className="px-4 py-2 bg-[var(--indigo)] rounded-full text-xs font-bold text-white shadow-lg">
               Sign Up
             </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-5xl mx-auto z-10 text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
              Shared Itinerary
            </span>
            <span className="px-3 py-1 bg-[#ff6b47] rounded-full text-[10px] font-bold uppercase tracking-widest">
              {trip.mood}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">{trip.name}</h1>
          <p className="text-xl md:text-2xl font-light text-white/90 mb-6">{trip.destinations}</p>
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold border-2 border-white">
                 A
               </div>
               <span>Curated by Alex</span>
            </div>
            <span className="opacity-60">•</span>
            <span>{trip.startDate} — {trip.endDate}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[1fr_350px] gap-12">
        
        {/* Timeline Itinerary */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--indigo)] dark:text-white mb-8">Trip Itinerary</h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--indigo)] before:via-gray-200 before:to-transparent dark:before:via-gray-800">
            
            {Object.values(initialItineraryColumns).map((day, dayIndex) => (
              <div key={day.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline Dot */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-gray-950 bg-[var(--indigo)] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2"></div>
                
                {/* Content Card */}
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 ml-auto md:ml-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-[var(--indigo)] dark:text-indigo-400">{day.title}</h3>
                    <span className="text-xs font-bold text-gray-400">{day.date}</span>
                  </div>
                  
                  {day.items.length > 0 ? (
                    <div className="space-y-3">
                      {day.items.map(item => (
                        <div key={item.id} className="flex gap-3 items-start p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                          <span className="text-xs font-mono font-bold text-gray-400 mt-0.5">{item.time}</span>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                            <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Exploring at leisure.</p>
                  )}
                </div>
              </div>
            ))}
            
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800 sticky top-24">
             <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--indigo)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
             </div>
             <h3 className="text-2xl font-bold text-[var(--indigo)] dark:text-white mb-2">Make it yours</h3>
             <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
               Love this itinerary? Duplicate the entire trip into your own Traveloop studio to customize dates, invite your friends, and manage your budget.
             </p>
             <button 
               onClick={handleCopyTrip}
               disabled={isCopying}
               className="w-full bg-[var(--indigo)] hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
             >
               {isCopying ? "Copying Trip..." : "Copy this trip ✨"}
             </button>
             
             <p className="text-center text-xs text-gray-400 mt-4">
               Requires a free Traveloop account.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SharedTrip;

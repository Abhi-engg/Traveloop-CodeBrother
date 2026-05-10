import { useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { mockTrips } from "../data/mockData";

const coverPhotos = [
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop", // Paris
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=600&auto=format&fit=crop", // Venice
  "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&auto=format&fit=crop", // Sydney
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop", // Mountains
];

const moods = ["Relaxed", "Adventure", "Culture & Cuisine", "Nightlife", "Nature", "Romantic"];

const CreateTripPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    coverPhoto: coverPhotos[0],
    mood: "Relaxed",
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.name && formData.startDate) {
      setStep(2);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Confetti burst in coral + gold
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff6b47', '#FFD700', '#FF8C00']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff6b47', '#FFD700', '#FF8C00']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          navigate("/itinerary/builder");
        }
      };
      
      frame();
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-[var(--cream)] dark:bg-gray-950 transition-colors">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] rounded-[2rem] overflow-hidden shadow-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        
        {/* Left Side: Form Wizard */}
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b47] mb-2">
              Step {step} of 2
            </p>
            <h1 className="text-4xl font-bold text-[var(--indigo)] dark:text-white">
              {step === 1 ? "Trip Details" : "Vibe & Visuals"}
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {step === 1 
                ? "Let's start with the basics of your next adventure."
                : "Choose a cover photo and set the mood."}
            </p>
          </div>

          <div className="flex mb-8 gap-2">
             <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[var(--indigo)]' : 'bg-gray-200 dark:bg-gray-800'}`}></div>
             <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[var(--indigo)]' : 'bg-gray-200 dark:bg-gray-800'} transition-colors duration-500`}></div>
          </div>

          <form onSubmit={step === 1 ? handleNext : (e) => { e.preventDefault(); handleSave(); }}>
            {step === 1 ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)] dark:text-gray-400">
                    Trip Name
                  </label>
                  <input
                    required
                    autoFocus
                    className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:border-[var(--indigo)] focus:ring-1 focus:ring-[var(--indigo)] outline-none transition-all dark:text-white"
                    placeholder="e.g. Euro Summer 2026"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)] dark:text-gray-400">
                      Start Date
                    </label>
                    <input
                      required
                      type="date"
                      className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:border-[var(--indigo)] focus:ring-1 focus:ring-[var(--indigo)] outline-none transition-all dark:text-white"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)] dark:text-gray-400">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:border-[var(--indigo)] focus:ring-1 focus:ring-[var(--indigo)] outline-none transition-all dark:text-white"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="mt-8 w-full rounded-xl bg-[var(--indigo)] px-4 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Continue →
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                
                {/* Cover Photo Selection */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)] dark:text-gray-400 mb-3 block">
                    Cover Photo
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {coverPhotos.map((url, i) => (
                      <div 
                        key={i}
                        onClick={() => setFormData({...formData, coverPhoto: url})}
                        className={`h-24 rounded-xl cursor-pointer overflow-hidden border-2 transition-all ${formData.coverPhoto === url ? 'border-[#ff6b47] scale-105 shadow-md' : 'border-transparent hover:opacity-80'}`}
                      >
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mood Selection */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)] dark:text-gray-400 mb-3 block">
                    Trip Mood
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFormData({...formData, mood: m})}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${formData.mood === m ? 'bg-[#ff6b47] text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 rounded-xl bg-[var(--indigo)] px-4 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isSaving ? "Creating Magic..." : "Create Trip ✨"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Side: Live Preview */}
        <div className="hidden lg:block relative bg-[var(--indigo)] p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,107,71,0.2),_transparent_70%)]" />
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6 text-center">
              Live Preview
            </p>
            
            {/* Mock Mobile Device */}
            <div className="w-[300px] h-[600px] bg-white dark:bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl relative border-8 border-white/10 dark:border-gray-800/50">
               {/* Screen Content */}
               <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative shadow-inner">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                    style={{ backgroundImage: `url(${formData.coverPhoto})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md rounded-full mb-3">
                      {formData.mood}
                    </span>
                    <h3 className="text-2xl font-bold leading-tight mb-1 truncate">
                      {formData.name || "Trip Name"}
                    </h3>
                    <p className="text-xs text-white/80">
                      {formData.startDate ? formData.startDate : "Start Date"} — {formData.endDate ? formData.endDate : "End Date"}
                    </p>
                  </div>
               </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateTripPage;

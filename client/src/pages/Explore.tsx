import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Clock, IndianRupee, Sparkles, Gem, Check, AlertCircle, MapPin, ArrowRight } from 'lucide-react';
import { generateQuest } from '../services/api';
import { getSessionId, addKhojScore } from '../utils/session';

export const Explore: React.FC = () => {
  const navigate = useNavigate();

  // Form State with user defaults
  const [location, setLocation] = useState('Ambala');
  const [timeAvailable, setTimeAvailable] = useState<number>(90);
  const [budget, setBudget] = useState<number>(800);
  const [interests, setInterests] = useState<string[]>(['History', 'Food', 'Hidden Gems']);
  const [explorationStyle, setExplorationStyle] = useState('Curious');
  const [hiddenGemMode, setHiddenGemMode] = useState(true);

  // Interaction State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeOptions = [
    { label: '30 min', value: 30, desc: 'Quick micro-discovery' },
    { label: '1 hour', value: 60, desc: 'Focused exploration' },
    { label: '90 min', value: 90, desc: 'Deep multi-stop quest' },
    { label: '2 hours', value: 120, desc: 'Comprehensive journey' },
    { label: 'Half day', value: 240, desc: '4-hour local adventure' },
    { label: 'Full day', value: 480, desc: 'All-day urban immersion' }
  ];

  const budgetOptions = [
    { label: '₹0', value: 0 },
    { label: '₹200', value: 200 },
    { label: '₹500', value: 500 },
    { label: '₹800', value: 800 },
    { label: '₹1500', value: 1500 },
    { label: '₹2500+', value: 2500 }
  ];

  const interestOptions = [
    'History',
    'Food',
    'Architecture',
    'Culture',
    'Nature',
    'Art',
    'Markets',
    'Spiritual',
    'Photography',
    'Hidden Gems'
  ];

  const styleOptions = [
    { label: 'Curious', desc: 'Focus on small overlooked architectural details' },
    { label: 'Adventurous', desc: 'Wandering hidden alleyways and ruins' },
    { label: 'Relaxed', desc: 'Serene, unhurried parks & tranquil shrines' },
    { label: 'Foodie', desc: 'Prioritizing historic street snacks and generational tea stalls' },
    { label: 'History Hunter', desc: 'Deep dive into 19th-century colonial & Mughal stories' },
    { label: 'Photographer', desc: 'Scouting optimal golden-hour light and geometric arches' }
  ];

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      if (interests.length > 1) {
        setInterests(interests.filter(i => i !== interest));
      }
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const sessionId = getSessionId();
      const res = await generateQuest({
        location,
        timeAvailable,
        budget,
        interests,
        explorationStyle,
        hiddenGemMode,
        sessionId
      });

      if (res.success && res.data) {
        addKhojScore(10, 'Quest Generated');
        sessionStorage.setItem('current_quest', JSON.stringify(res.data));
        navigate('/quest/preview');
      } else {
        setError(res.error || 'KHOJ HIT A DETOUR. TRY AGAIN.');
      }
    } catch (err: any) {
      setError('KHOJ HIT A DETOUR. TRY AGAIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-World Personalization</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          WHERE DO YOU WANT TO <span className="text-gradient">KHOJ?</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Every field below actively personalizes the matched destinations and observation challenges.
        </p>
      </div>

      {/* Main Exploration Form */}
      <form onSubmit={handleGenerate} className="p-6 sm:p-10 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-10 shadow-2xl">
        
        {/* 1. WHERE? */}
        <div className="space-y-3">
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>WHERE?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Ambala', 'Chandigarh', 'Kurukshetra'].map((loc) => {
              const active = location === loc;
              return (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className={`p-4 rounded-xl border text-left font-bold transition-all min-h-[50px] ${
                    active
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="text-base font-bold">{loc}</div>
                  <div className="text-xs font-normal text-zinc-400 mt-1">
                    {loc === 'Ambala' ? 'Historic Cantt, Havelis, Ghee Tikki' : loc === 'Chandigarh' ? 'Rock Garden, Corbusier, ICH' : 'Ancient Sarovar & Sufi Tombs'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. HOW MUCH TIME? */}
        <div className="space-y-3">
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>HOW MUCH TIME?</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timeOptions.map((t) => {
              const active = timeAvailable === t.value;
              return (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setTimeAvailable(t.value)}
                  className={`p-3.5 rounded-xl border text-left transition-all min-h-[50px] ${
                    active
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="text-base font-semibold">{t.label}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. WHAT'S YOUR BUDGET? */}
        <div className="space-y-3">
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
            <IndianRupee className="w-4 h-4" />
            <span>WHAT'S YOUR BUDGET?</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {budgetOptions.map((b) => {
              const active = budget === b.value;
              return (
                <button
                  type="button"
                  key={b.value}
                  onClick={() => setBudget(b.value)}
                  className={`py-3 px-2 rounded-xl border text-center font-bold text-sm transition-all min-h-[44px] ${
                    active
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. WHAT ARE YOU CURIOUS ABOUT? */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>WHAT ARE YOU CURIOUS ABOUT?</span>
            </h2>
            <span className="text-xs text-zinc-400 font-medium">{interests.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {interestOptions.map((interest) => {
              const active = interests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all flex items-center space-x-1.5 min-h-[44px] ${
                    active
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. HOW DO YOU WANT TO EXPLORE? */}
        <div className="space-y-3">
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
            <Compass className="w-4 h-4" />
            <span>HOW DO YOU WANT TO EXPLORE?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {styleOptions.map((style) => {
              const active = explorationStyle === style.label;
              return (
                <button
                  type="button"
                  key={style.label}
                  onClick={() => setExplorationStyle(style.label)}
                  className={`p-3.5 rounded-xl border text-left transition-all min-h-[50px] ${
                    active
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="text-sm font-bold">{style.label}</div>
                  <div className="text-[11px] text-zinc-400 font-normal mt-0.5">{style.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. WANT PLACES TOURISTS MISS? */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wide flex items-center space-x-2">
              <Gem className="w-4 h-4 text-amber-400" />
              <span>WANT PLACES TOURISTS MISS?</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Hidden Gem Mode: Prioritizes obscure ruins, forgotten architectural details, and local secrets.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setHiddenGemMode(!hiddenGemMode)}
            className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              hiddenGemMode ? 'bg-amber-500' : 'bg-zinc-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-zinc-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                hiddenGemMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{error}</p>
              <p className="text-xs mt-0.5 text-red-300/90">Please adjust your constraints or try again.</p>
            </div>
          </div>
        )}

        {/* Submit Button: # BUILD MY KHOJ */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-black text-base shadow-xl shadow-orange-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-3 min-h-[52px]"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span className="tracking-wide">BUILDING YOUR KHOJ...</span>
              </>
            ) : (
              <>
                <Compass className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
                <span className="tracking-wide">BUILD MY KHOJ</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-zinc-400 mt-2">
            Queries MongoDB for verified places and uses Gemini to craft observation challenges.
          </p>
        </div>

      </form>

    </div>
  );
};

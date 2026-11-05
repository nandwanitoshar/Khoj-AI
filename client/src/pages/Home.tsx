import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, Gem, Clock, ShieldCheck, MapPin, Eye, ArrowRight, Zap, BookOpen, CheckCircle, Search, CompassIcon } from 'lucide-react';
import { generateQuest } from '../services/api';
import { getSessionId, addKhojScore } from '../utils/session';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loadingQuick, setLoadingQuick] = useState(false);
  const [quickError, setQuickError] = useState<string | null>(null);

  // 30-MINUTE KHOJ FAST ACTION
  const handleThirtyMinuteKhoj = async () => {
    setLoadingQuick(true);
    setQuickError(null);
    try {
      const sessionId = getSessionId();
      const res = await generateQuest({
        location: 'Ambala',
        timeAvailable: 30,
        budget: 200,
        interests: ['History', 'Hidden Gems', 'Food'],
        explorationStyle: 'Curious',
        hiddenGemMode: true,
        sessionId
      });

      if (res.success && res.data) {
        addKhojScore(10, '30-Minute Khoj Initiated');
        sessionStorage.setItem('current_quest', JSON.stringify(res.data));
        navigate(`/quest/preview`);
      } else {
        setQuickError(res.error || 'KHOJ HIT A DETOUR. TRY AGAIN.');
      }
    } catch (err: any) {
      setQuickError('KHOJ HIT A DETOUR. TRY AGAIN.');
    } finally {
      setLoadingQuick(false);
    }
  };

  return (
    <div className="space-y-24 pb-20">

      {/* 1. HERO SECTION — UNDERSTANDABLE IN 10 SECONDS */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        {/* Ambient atmospheric backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-r from-amber-600/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Problem-First Exploration Engine</span>
          </div>

          {/* Main Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              YOUR CITY IS <span className="text-gradient">HIDING STORIES.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-zinc-300 font-semibold">
              Don't just visit. <span className="text-amber-400">KHOJ it.</span>
            </p>
          </div>

          {/* Core Product Statement */}
          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal bg-zinc-900/60 border border-zinc-800 p-4 sm:p-5 rounded-2xl">
            "KHOJ AI doesn't just tell you where to go. It tells you <strong className="text-amber-300 font-bold">what to discover</strong> when you get there."
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/explore"
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-extrabold text-base shadow-xl shadow-orange-600/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              <Compass className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
              <span>START YOUR KHOJ</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/hidden-gems"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold text-base border border-zinc-700/80 transition-all flex items-center justify-center space-x-2"
            >
              <Gem className="w-4 h-4 text-amber-400" />
              <span>EXPLORE HIDDEN GEMS</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 2. THE 3-STEP VISUAL DISCOVERY LOOP: FIND -> NOTICE -> UNDERSTAND */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">How It Works</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Three Steps To True Local Discovery</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

          {/* FIND */}
          <div className="p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 relative group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xl">
                01
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">STAGE 1</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Search className="w-5 h-5 text-amber-400" />
              <span>FIND</span>
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Personalized places based strictly on your available time, real budget, and interests.
            </p>
          </div>

          {/* NOTICE (Signature Feature Highlight) */}
          <div className="p-7 rounded-3xl bg-zinc-900/80 border-2 border-amber-500/40 space-y-4 relative shadow-xl shadow-amber-500/5 group hover:border-amber-400 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-black text-xl">
                02
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">SIGNATURE</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Eye className="w-5 h-5 text-orange-400" />
              <span>NOTICE</span>
            </h3>
            <p className="text-zinc-200 text-sm leading-relaxed">
              Get a real-world <strong className="text-amber-400">Local Detective challenge</strong> to physically inspect details most visitors walk right past.
            </p>
          </div>

          {/* UNDERSTAND */}
          <div className="p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 relative group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xl">
                03
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">STAGE 3</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>UNDERSTAND</span>
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Reveal the verified backstory and oral tradition behind what you just uncovered.
            </p>
          </div>

        </div>
      </section>

      {/* 3. "WHY KHOJ?" COMPARISON SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-8">

          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">The Distinction</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Why KHOJ AI is Different</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Standard Tourism */}
            <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">1. Normal Tourism</span>
              <div className="text-lg font-bold text-zinc-300">"Go here."</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generic lists, crowded top-10 sights, commercial ads, and superficial photo ops.
              </p>
            </div>

            {/* AI Travel Planner */}
            <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">2. AI Travel Planner</span>
              <div className="text-lg font-bold text-zinc-300">"Go here because you like history."</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Chatbot-generated generic itineraries that often invent opening hours or hallucinate facts.
              </p>
            </div>

            {/* KHOJ AI */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 space-y-3 shadow-lg shadow-amber-500/5">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">3. KHOJ AI</span>
              <div className="text-lg font-black text-white">"Go here, look for this, discover this, and understand why it matters."</div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Physical observation challenges, verified local knowledge base, and real discovery.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. ONLY HAVE 30 MINUTES? (MAJOR FEATURE FOR STUDENTS) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/35 shadow-2xl relative overflow-hidden">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>Micro-Discovery For Students & Busy Locals</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ONLY HAVE 30 MINUTES?
              </h2>

              <p className="text-zinc-300 text-base leading-relaxed">
                You don't need a whole day or weekend to discover somewhere new. In 30 minutes, explore a single deep, overlooked local gem right around you on a ₹200 student budget.
              </p>

              {quickError && (
                <p className="text-red-400 text-xs font-semibold bg-red-950/50 p-2.5 rounded-lg border border-red-800">
                  {quickError}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start md:items-end">
              <button
                onClick={handleThirtyMinuteKhoj}
                disabled={loadingQuick}
                className="px-7 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-black text-base shadow-xl shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center space-x-2"
              >
                {loadingQuick ? (
                  <>
                    <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>BUILDING YOUR KHOJ...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-zinc-950 fill-zinc-950" />
                    <span>FIND MY 30-MINUTE KHOJ</span>
                  </>
                )}
              </button>
              <span className="text-zinc-400 text-xs mt-2 font-medium">Real time: 30 min • Budget: ₹200</span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. TRUSTWORTHY PILLARS (Section 12) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Real Local Knowledge</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Destination information comes from the KHOJ local knowledge base, curated with verified histories, architectural details, and local coordinates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI With Boundaries</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Gemini personalizes the experience using supplied destination data. It is constrained from inventing places, prices, or false claims.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>Works With Limited Time</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              30 minutes is enough to start discovering. Our matching algorithm guarantees stops that fit into your exact schedule.
            </p>
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER */}
      <section className="max-w-3xl mx-auto px-4 text-center space-y-6 pt-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Your city is waiting.
        </h2>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          Start exploring today with a personalized discovery quest tailored to your pace.
        </p>
        <div>
          <Link
            to="/explore"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-black text-base shadow-xl shadow-orange-600/25 transition-all hover:scale-105"
          >
            <span>BUILD MY KHOJ</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>

    </div>
  );
};

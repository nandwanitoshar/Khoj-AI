import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Gem, Clock, MapPin, Eye, ArrowRight, Sparkles } from 'lucide-react';
import type { Destination } from '../types';
import { getHiddenGems, generateQuest } from '../services/api';
import { getSessionId, addKhojScore } from '../utils/session';

export const HiddenGems: React.FC = () => {
  const navigate = useNavigate();
  const [gems, setGems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGems() {
      setLoading(true);
      const res = await getHiddenGems();
      if (res.success && res.data) {
        setGems(res.data);
      } else {
        setError('KHOJ HIT A DETOUR. TRY AGAIN.');
      }
      setLoading(false);
    }
    loadGems();
  }, []);

  const handleBuildAroundGem = async (gem: Destination) => {
    setGeneratingId(gem._id);
    try {
      const sessionId = getSessionId();
      const res = await generateQuest({
        location: gem.city,
        timeAvailable: Math.max(gem.visitTimeMinutes + 30, 60),
        budget: Math.max(gem.estimatedCost + 200, 500),
        interests: [gem.category, 'Hidden Gems', ...(gem.tags || []).slice(0, 2)],
        explorationStyle: 'Curious',
        hiddenGemMode: true,
        sessionId
      });

      if (res.success && res.data) {
        addKhojScore(15, `Built Khoj Around ${gem.name}`);
        sessionStorage.setItem('current_quest', JSON.stringify(res.data));
        navigate('/quest/preview');
      } else {
        alert(res.error || 'KHOJ HIT A DETOUR. TRY AGAIN.');
      }
    } catch (err: any) {
      alert('KHOJ HIT A DETOUR. TRY AGAIN.');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Section 9 Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Gem className="w-3.5 h-3.5" />
          <span>Curated Local Secret Knowledge</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          WHAT DO MOST PEOPLE <span className="text-gradient">MISS?</span>
        </h1>
        <p className="text-zinc-300 text-base sm:text-lg font-medium italic">
          "Some places aren't hidden. They're just overlooked."
        </p>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          These aren't overcrowded commercial attractions. These are forgotten Victorian cemeteries, secret gardens, and generational food corners scored by their hidden gem value.
        </p>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-300 text-sm font-bold">QUERYING LOCAL KNOWLEDGE BASE...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-950/30 border border-red-800 text-center text-red-300">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gems.map((gem) => {
            const isGenerating = generatingId === gem._id;
            return (
              <div
                key={gem._id}
                className="rounded-3xl bg-zinc-900/50 border border-zinc-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group shadow-lg"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="aspect-[16/9] relative overflow-hidden bg-zinc-950">
                    <img
                      src={gem.imageUrl}
                      alt={gem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1548625361-195fe5787e95?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-950/90 backdrop-blur-md text-amber-400 font-black text-xs border border-zinc-800 flex items-center space-x-1">
                        <Gem className="w-3.5 h-3.5" />
                        <span>Gem Score: {gem.hiddenGemScore}/10</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-950/90 backdrop-blur-md text-zinc-300 font-bold text-xs border border-zinc-800">
                        {gem.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white font-extrabold text-lg">
                      {gem.name}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-4 text-xs text-zinc-400">
                      <span className="flex items-center space-x-1 text-white font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{gem.city}, {gem.state}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{gem.visitTimeMinutes} mins</span>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">
                        {gem.estimatedCost === 0 ? 'Free Entry' : `₹${gem.estimatedCost}`}
                      </span>
                    </div>

                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {gem.description}
                    </p>

                    {/* Hidden Detail Callout */}
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                      <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-bold uppercase">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Hidden Detail:</span>
                      </div>
                      <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                        {gem.hiddenDetails}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="p-6 pt-0 border-t border-zinc-800/80 flex items-center justify-between gap-3 mt-4">
                  <Link
                    to={`/destination/${gem._id}`}
                    className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                  >
                    View History
                  </Link>

                  <button
                    onClick={() => handleBuildAroundGem(gem)}
                    disabled={isGenerating}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/15 transition-all flex items-center space-x-1.5 disabled:opacity-50 min-h-[44px]"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                        <span>BUILDING YOUR KHOJ...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                        <span>BUILD A KHOJ AROUND THIS</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

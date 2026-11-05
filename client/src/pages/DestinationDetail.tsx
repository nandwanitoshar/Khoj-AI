import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, Gem, Eye, BookOpen, Navigation, ArrowLeft, Sparkles, Check } from 'lucide-react';
import type { Destination } from '../types';
import { getDestinationById, generateQuest, getAiStory } from '../services/api';
import { getSessionId, addKhojScore } from '../utils/session';

export const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [dest, setDest] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(false);
  const [story, setStory] = useState<{ loading: boolean; text?: string; source?: string }>({ loading: false });

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const res = await getDestinationById(id);
      if (res.success && res.data) {
        setDest(res.data);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleBuildKhoj = async () => {
    if (!dest) return;
    setBuilding(true);
    try {
      const sessionId = getSessionId();
      const res = await generateQuest({
        location: dest.city,
        timeAvailable: Math.max(dest.visitTimeMinutes + 30, 60),
        budget: Math.max(dest.estimatedCost + 200, 500),
        interests: [dest.category, ...(dest.tags || []).slice(0, 2)],
        explorationStyle: 'Curious',
        hiddenGemMode: dest.hiddenGemScore >= 7,
        sessionId
      });

      if (res.success && res.data) {
        addKhojScore(15, `Trail Initiated at ${dest.name}`);
        sessionStorage.setItem('current_quest', JSON.stringify(res.data));
        navigate('/quest/preview');
      } else {
        alert(res.error || 'Could not build quest');
      }
    } catch (err: any) {
      alert(err.message || 'Error communicating with engine');
    } finally {
      setBuilding(false);
    }
  };

  const handleTriggerStory = async () => {
    if (!dest) return;
    setStory({ loading: true });
    try {
      const res = await getAiStory({ destinationId: dest._id, destination: dest });
      if (res.success && res.story) {
        setStory({ loading: false, text: res.story, source: res.source });
        addKhojScore(20, 'Unlocked Archive Story');
      } else {
        setStory({ loading: false, text: dest.localStory });
      }
    } catch (e) {
      setStory({ loading: false, text: dest.localStory });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Loading verified destination knowledge...</p>
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Destination not found</h2>
        <Link to="/hidden-gems" className="text-amber-400 text-sm">Back to Hidden Gems</Link>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.name + ' ' + dest.city)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>Google Maps Directions</span>
        </a>
      </div>

      {/* Main Image Header */}
      <div className="rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] relative bg-zinc-950 border border-zinc-800">
        <img
          src={dest.imageUrl}
          alt={dest.name}
          className="w-full h-full object-cover"
          onError={(e: any) => {
            e.target.src = 'https://images.unsplash.com/photo-1548625361-195fe5787e95?auto=format&fit=crop&w=1000&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-amber-500/20 backdrop-blur-md text-amber-400 font-extrabold text-xs border border-amber-500/30">
                {dest.category}
              </span>
              <span className="px-3 py-1 rounded-lg bg-zinc-900/80 backdrop-blur-md text-zinc-300 font-bold text-xs border border-zinc-800 flex items-center space-x-1">
                <Gem className="w-3.5 h-3.5 text-amber-400" />
                <span>Hidden Gem Score: {dest.hiddenGemScore}/10</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{dest.name}</h1>
            <p className="text-zinc-300 text-xs sm:text-sm flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{dest.city}, {dest.state}, {dest.country}</span>
            </p>
          </div>

          <button
            onClick={handleBuildKhoj}
            disabled={building}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 shrink-0 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{building ? 'ASSEMBLING...' : 'START KHOJ HERE'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <div>
          <span className="text-[11px] text-zinc-400 block">Est. Cost</span>
          <span className="text-base font-bold text-emerald-400">
            {dest.estimatedCost === 0 ? 'Free Entry' : `₹${dest.estimatedCost}`}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-zinc-400 block">Visit Time</span>
          <span className="text-base font-bold text-white">{dest.visitTimeMinutes} Minutes</span>
        </div>
        <div>
          <span className="text-[11px] text-zinc-400 block">Optimal Time</span>
          <span className="text-base font-bold text-amber-300">{dest.bestTime}</span>
        </div>
        <div>
          <span className="text-[11px] text-zinc-400 block">GPS Coordinates</span>
          <span className="text-base font-mono text-xs text-zinc-300">
            {dest.coordinates.latitude.toFixed(4)}, {dest.coordinates.longitude.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-6">
        
        {/* Description */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide">Overview</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">{dest.description}</p>
        </div>

        {/* Local Detective / Hidden Detail */}
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 text-sm font-bold uppercase tracking-wide">
            <Eye className="w-4 h-4" />
            <span>The Hidden Detail Most People Walk Past</span>
          </div>
          <p className="text-amber-200 text-sm leading-relaxed font-medium">
            {dest.hiddenDetails}
          </p>
        </div>

        {/* History */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide">Historical Archive</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">{dest.history}</p>
        </div>

        {/* Local Story & AI Story Button */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Local Oral Tradition & Backstory</span>
            </h3>
            <button
              onClick={handleTriggerStory}
              disabled={story.loading}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold border border-zinc-700 transition-colors"
            >
              {story.loading ? 'Generating Story...' : 'Gemini Story Hook'}
            </button>
          </div>
          
          <p className="text-zinc-300 text-sm leading-relaxed">{dest.localStory}</p>

          {story.text && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/40 text-xs sm:text-sm text-zinc-200 leading-relaxed italic">
              "{story.text}"
            </div>
          )}
        </div>

        {/* Cultural Significance & Local Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wide">Cultural Significance</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{dest.culturalSignificance}</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wide">Practical Explorer Tips</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{dest.localTips}</p>
          </div>
        </div>

      </div>

    </div>
  );
};

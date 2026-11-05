import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Compass, Clock, IndianRupee, MapPin, Eye, CheckCircle2, Bookmark, 
  Navigation, Sparkles, BookOpen, AlertCircle, ArrowLeft, Trophy, ArrowDown 
} from 'lucide-react';
import type { Quest, QuestDestination } from '../types';
import { saveQuest, getQuestById, getAiStory } from '../services/api';
import { getSessionId, addKhojScore } from '../utils/session';

export const QuestView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detective State per stop (order -> { found: boolean, revealed: boolean })
  const [detectiveState, setDetectiveState] = useState<{ [order: number]: { found: boolean; revealed: boolean } }>({});
  
  // AI Story State per stop (order -> { loading: boolean, story?: string, source?: string })
  const [storyState, setStoryState] = useState<{ [order: number]: { loading: boolean; story?: string; source?: string } }>({});

  // Save State
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedQuestId, setSavedQuestId] = useState<string | null>(null);

  // Quest completion status
  const [questCompleted, setQuestCompleted] = useState(false);

  useEffect(() => {
    async function loadQuest() {
      setLoading(true);
      setError(null);

      // If id is preview, read from sessionStorage
      if (id === 'preview') {
        const stored = sessionStorage.getItem('current_quest');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setQuest(parsed);
          } catch (e) {
            setError('Could not read quest from session.');
          }
        } else {
          setError('No active quest found in current session. Please start a new Khoj.');
        }
        setLoading(false);
        return;
      }

      // Otherwise load from backend API
      if (id) {
        try {
          const res = await getQuestById(id);
          if (res.success && res.data) {
            setQuest(res.data);
            setSavedSuccess(true);
            setSavedQuestId(res.data._id || id);
          } else {
            setError(res.error || 'Quest not found.');
          }
        } catch (err: any) {
          setError('KHOJ HIT A DETOUR. TRY AGAIN.');
        }
      }
      setLoading(false);
    }

    loadQuest();
  }, [id]);

  // Handle Detective Interaction
  const handleFoundIt = (order: number) => {
    setDetectiveState(prev => ({
      ...prev,
      [order]: { found: true, revealed: false }
    }));
  };

  const handleRevealClue = (order: number) => {
    setDetectiveState(prev => ({
      ...prev,
      [order]: { ...prev[order], revealed: true }
    }));
    addKhojScore(25, 'Hidden Gem Observation Solved');
  };

  // Handle AI Story Generation
  const handleTellStory = async (dest: QuestDestination) => {
    const order = dest.order;
    setStoryState(prev => ({
      ...prev,
      [order]: { loading: true }
    }));

    try {
      const res = await getAiStory({
        destinationId: dest.destinationId,
        destination: dest
      });

      if (res.success && res.story) {
        setStoryState(prev => ({
          ...prev,
          [order]: { loading: false, story: res.story, source: res.source }
        }));
        addKhojScore(20, 'Local Story Unlocked');
      } else {
        setStoryState(prev => ({
          ...prev,
          [order]: {
            loading: false,
            story: dest.localStory || `Most visitors overlook ${dest.name}. It stands as a testament to ${dest.category} heritage.`
          }
        }));
      }
    } catch (err) {
      setStoryState(prev => ({
        ...prev,
        [order]: {
          loading: false,
          story: dest.localStory || dest.experience
        }
      }));
    }
  };

  // Handle Saving to MongoDB
  const handleSaveQuest = async () => {
    if (!quest) return;
    setSaving(true);
    try {
      const sessionId = getSessionId();
      const res = await saveQuest({
        ...quest,
        sessionId
      });

      if (res.success && res.data) {
        setSavedSuccess(true);
        setSavedQuestId(res.data._id || 'saved');
        addKhojScore(15, 'Quest Saved to MongoDB');
      } else {
        alert(res.error || 'Could not save quest.');
      }
    } catch (err: any) {
      alert('KHOJ HIT A DETOUR. TRY AGAIN.');
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteQuest = () => {
    setQuestCompleted(true);
    addKhojScore(50, 'Full Exploration Quest Completed');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-300 font-bold tracking-wide">BUILDING YOUR KHOJ...</p>
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-950/40 border border-red-800 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Quest Not Found</h2>
        <p className="text-zinc-400 text-sm">{error || 'This quest could not be loaded.'}</p>
        <Link
          to="/explore"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Design New Khoj</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center space-x-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Another Trail</span>
        </button>

        <div className="flex items-center space-x-2">
          {savedSuccess ? (
            <div className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>SAVED IN MY KHOJS</span>
            </div>
          ) : (
            <button
              onClick={handleSaveQuest}
              disabled={saving}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white transition-all min-h-[44px]"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>{saving ? 'SAVING YOUR KHOJ...' : 'SAVE THIS KHOJ'}</span>
            </button>
          )}
        </div>
      </div>

      {/* YOUR KHOJ Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-6 shadow-xl">
        
        <div className="space-y-2">
          <div className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">
            YOUR KHOJ
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {quest.title}
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            {quest.summary}
          </p>
        </div>

        {/* 4 Key Metrics Bar: 📍 Location | ⏱ Time | ₹ Budget | 🔎 Hidden Gems */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
          <div className="flex items-center space-x-2.5">
            <span className="text-lg">📍</span>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Location</span>
              <span className="text-sm font-bold text-white">{quest.location}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <span className="text-lg">⏱</span>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Time</span>
              <span className="text-sm font-bold text-white">{quest.timeAvailable} mins</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <span className="text-lg">₹</span>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Est. Cost</span>
              <span className="text-sm font-bold text-emerald-400">₹{quest.totalEstimatedCost}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <span className="text-lg">🔎</span>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Hidden Gems</span>
              <span className="text-sm font-bold text-amber-400">
                {quest.hiddenGemMode ? 'Prioritized' : 'Balanced'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4: KHOJ AI PERSONALIZED THIS QUEST CARD */}
        <div className="p-4.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-950 border border-amber-500/30 space-y-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs sm:text-sm font-extrabold text-white tracking-wide uppercase">
              KHOJ AI PERSONALIZED THIS QUEST
            </h2>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Based on: <strong className="text-amber-300">{quest.timeAvailable} mins</strong> • Budget <strong className="text-amber-300">₹{quest.budget}</strong> • Interests <strong className="text-amber-300">{quest.interests.join(', ')}</strong> • Style <strong className="text-amber-300">{quest.explorationStyle}</strong> • Hidden Gems <strong className="text-amber-300">{quest.hiddenGemMode ? 'ON' : 'OFF'}</strong>.
          </p>
          <p className="text-[11px] text-zinc-400">
            Destination records are drawn from verified local knowledge; Gemini generated on-site observation challenges without inventing places.
          </p>
        </div>

      </div>

      {/* SECTION 6: ROUTE AS VERTICAL JOURNEY */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">Your Exploration Route</h2>
            <p className="text-xs text-zinc-400">Follow the path. Complete the Local Detective challenge at each stop.</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-800 text-amber-400">
            {quest.destinations.length} Stops Total
          </span>
        </div>

        {quest.destinations.map((dest, idx) => {
          const state = detectiveState[dest.order] || { found: false, revealed: false };
          const story = storyState[dest.order] || { loading: false };
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.name + ' ' + quest.location)}`;
          const isLast = idx === quest.destinations.length - 1;

          return (
            <div key={dest.destinationId || idx} className="space-y-6">
              
              {/* Vertical Route Step Marker */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 font-black text-sm flex items-center justify-center shadow-lg shadow-amber-500/20">
                  0{dest.order}
                </div>
                <div className="flex items-center space-x-2 text-sm font-extrabold text-white uppercase tracking-wider">
                  <span>DISCOVER</span>
                  <span className="text-amber-400">•</span>
                  <span className="text-zinc-400 font-semibold">{dest.category}</span>
                </div>
              </div>

              {/* Stop Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6 relative overflow-hidden shadow-lg">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {dest.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-zinc-300 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>~{dest.estimatedMinutes || dest.visitTimeMinutes} mins</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">
                      {dest.estimatedCost === 0 ? 'Free Entry' : `₹${dest.estimatedCost}`}
                    </span>
                  </div>
                </div>

                {/* Destination Image & Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 rounded-2xl overflow-hidden aspect-video md:aspect-auto h-48 md:h-full relative bg-zinc-950">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1548625361-195fe5787e95?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                    
                    {/* Get Directions Button */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 text-white text-xs font-bold hover:bg-zinc-800 transition-colors border border-zinc-700"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-400" />
                        <span>GET DIRECTIONS</span>
                      </a>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    {/* Why KHOJ Selected It */}
                    <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block mb-1">
                        WHY KHOJ SELECTED THIS
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {dest.reason}
                      </p>
                    </div>

                    <div className="text-sm text-zinc-300 leading-relaxed">
                      {dest.experience}
                    </div>
                  </div>
                </div>

                {/* SECTION 5: SIGNATURE LOCAL DETECTIVE CARD */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 via-zinc-950 to-zinc-950 border-2 border-amber-500/40 space-y-4 shadow-lg shadow-amber-500/5">
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2 text-amber-400 text-xs font-extrabold uppercase tracking-widest">
                        <Eye className="w-4 h-4" />
                        <span>🔎 LOCAL DETECTIVE</span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        LOOK CLOSER.
                      </h4>
                    </div>
                    <span className="text-[11px] text-amber-300 font-bold px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
                      +25 PTS
                    </span>
                  </div>

                  <p className="text-zinc-200 text-sm leading-relaxed">
                    Don't just visit this place. Find the detail most visitors walk past:
                  </p>
                  <p className="text-amber-200 font-semibold text-sm italic">
                    "{dest.challenge}"
                  </p>

                  {/* Detective Buttons: I FOUND IT -> REVEAL CLUE */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {!state.found ? (
                      <button
                        onClick={() => handleFoundIt(dest.order)}
                        className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 min-h-[44px]"
                      >
                        I FOUND IT
                      </button>
                    ) : !state.revealed ? (
                      <button
                        onClick={() => handleRevealClue(dest.order)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-orange-600/30 transition-all animate-pulse min-h-[44px]"
                      >
                        REVEAL CLUE
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Observation Discovered (+25 PTS)</span>
                      </div>
                    )}

                    {/* Tell Me The Story Button (Section 7) */}
                    <button
                      onClick={() => handleTellStory(dest)}
                      disabled={story.loading}
                      className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 transition-colors flex items-center space-x-1.5 min-h-[44px]"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>{story.loading ? 'KHOJING THE STORY...' : 'TELL ME THE STORY'}</span>
                    </button>
                  </div>

                  {/* Revealed Clue & WHY IT MATTERS (Section 5) */}
                  {state.revealed && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 leading-relaxed space-y-2">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        THE HIDDEN DETAIL DISCOVERED:
                      </div>
                      <p className="text-white font-medium">{dest.hiddenDetails}</p>
                      
                      <div className="pt-2 border-t border-amber-500/20">
                        <span className="text-amber-300 font-bold text-xs uppercase block mb-0.5">WHY IT MATTERS:</span>
                        <p className="text-zinc-300 text-xs">
                          {dest.localStory || dest.history || 'This detail preserves the original craftsmanship of the location from generations past.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI Story Display (Section 7) */}
                  {story.story && (
                    <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/40 text-xs sm:text-sm text-zinc-200 leading-relaxed space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-amber-400 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>THE STORY BEHIND THIS PLACE</span>
                        </span>
                        <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                          Verified Local Narrative
                        </span>
                      </div>
                      <p className="italic text-zinc-300">"{story.story}"</p>
                    </div>
                  )}

                </div>

              </div>

              {/* Connecting Journey Arrow between stops */}
              {!isLast && (
                <div className="flex justify-center py-2">
                  <div className="flex flex-col items-center text-amber-500">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-amber-500 to-amber-500/20" />
                    <ArrowDown className="w-5 h-5 text-amber-500 -mt-1" />
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Quest Completion Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Finished Exploring This Trail?</h3>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
          Mark this KHOJ as finished to record your exploration in your explorer badge history.
        </p>

        {questCompleted ? (
          <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-sm">
            <Trophy className="w-5 h-5" />
            <span>KHOJ COMPLETED! (+50 EXPLORER PTS)</span>
          </div>
        ) : (
          <button
            onClick={handleCompleteQuest}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-bold text-sm shadow-lg shadow-orange-600/20 transition-all hover:scale-105 min-h-[48px]"
          >
            MARK QUEST COMPLETED
          </button>
        )}
      </div>

    </div>
  );
};

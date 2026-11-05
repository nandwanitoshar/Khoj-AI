import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Clock, IndianRupee, MapPin, Trash2, ArrowRight, Compass } from 'lucide-react';
import type { Quest } from '../types';
import { getSavedQuests, deleteQuest } from '../services/api';
import { getSessionId } from '../utils/session';

export const MyQuests: React.FC = () => {
  const navigate = useNavigate();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = getSessionId();

  const fetchQuests = async () => {
    setLoading(true);
    try {
      const res = await getSavedQuests(sessionId);
      if (res.success && res.data) {
        setQuests(res.data);
      } else {
        setError('KHOJ HIT A DETOUR. TRY AGAIN.');
      }
    } catch (err: any) {
      setError('KHOJ HIT A DETOUR. TRY AGAIN.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [sessionId]);

  const handleDelete = async (questId: string) => {
    if (!confirm('Are you sure you want to remove this quest from your collection?')) {
      return;
    }

    setDeletingId(questId);
    try {
      const res = await deleteQuest(questId);
      if (res.success) {
        setQuests(prev => prev.filter(q => q._id !== questId));
      } else {
        alert(res.error || 'KHOJ HIT A DETOUR. TRY AGAIN.');
      }
    } catch (err: any) {
      alert('KHOJ HIT A DETOUR. TRY AGAIN.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpen = (quest: Quest) => {
    sessionStorage.setItem('current_quest', JSON.stringify(quest));
    navigate(`/quest/${quest._id || 'saved'}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" />
            <span>MongoDB Persisted Collection</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">MY KHOJS</h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Saved exploration journeys tied to your anonymous session <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded text-[11px]">{sessionId.substring(0, 14)}...</code>
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all min-h-[44px]"
        >
          <Compass className="w-4 h-4 text-zinc-950" />
          <span>START NEW KHOJ</span>
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-300 text-sm font-bold">RETRIEVING SAVED KHOJS...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-950/30 border border-red-800 text-center text-red-300 space-y-3">
          <p className="font-bold">{error}</p>
          <button
            onClick={fetchQuests}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700"
          >
            Retry
          </button>
        </div>
      ) : quests.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center space-y-6 max-w-lg mx-auto shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Compass className="w-8 h-8 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">No KHOJs yet.</h2>
            <p className="text-zinc-400 text-sm">
              Your city is waiting. Create your first exploration quest tailored to your time and budget.
            </p>
          </div>
          <div>
            <Link
              to="/explore"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-black text-sm shadow-xl shadow-orange-600/25 transition-all min-h-[48px]"
            >
              <span>START YOUR FIRST KHOJ</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      ) : (
        /* List of Saved Quests */
        <div className="grid grid-cols-1 gap-6">
          {quests.map((q) => {
            const isDeleting = deletingId === q._id;
            const dateStr = q.createdAt ? new Date(q.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }) : 'Recent';

            return (
              <div
                key={q._id}
                className="p-6 sm:p-7 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all space-y-5 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {q.explorationStyle || 'Curious'}
                      </span>
                      {q.hiddenGemMode && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          Hidden Gems
                        </span>
                      )}
                      <span className="text-xs text-zinc-400">{dateStr}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {q.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpen(q)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-colors flex items-center space-x-1.5 min-h-[44px]"
                    >
                      <span>OPEN</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => q._id && handleDelete(q._id)}
                      disabled={isDeleting}
                      className="p-2.5 rounded-xl bg-zinc-950/80 hover:bg-red-950/50 border border-zinc-800 hover:border-red-800 text-zinc-400 hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Permanently Delete From MongoDB"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  {q.summary}
                </p>

                {/* Stops Mini Preview */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-zinc-400 font-semibold mr-1">Stops:</span>
                  {q.destinations.map((d, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-zinc-950 text-xs text-zinc-300 border border-zinc-800"
                    >
                      {i + 1}. {d.name}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-3">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{q.location}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{q.timeAvailable} mins</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">
                      ₹{q.totalEstimatedCost} Est. Cost
                    </span>
                  </div>

                  <span className="text-[11px] text-zinc-400 font-mono">
                    ID: {q._id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

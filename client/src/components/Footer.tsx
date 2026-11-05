import React from 'react';
import { Compass, Heart, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0c10] border-t border-zinc-900 py-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <Compass className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-bold text-xl text-white">KHOJ AI</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
              KHOJ AI converts local exploration into an authentic discovery quest. Instead of generic itineraries, we give you specific architectural, historical, and culinary details to physically find and notice.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-500/80 font-medium">
              <MapPin className="w-4 h-4" />
              <span>Current Knowledge Zones: Ambala • Chandigarh • Kurukshetra • Pinjore</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/explore" className="hover:text-amber-400 transition-colors">Start Exploration Form</Link>
              </li>
              <li>
                <Link to="/hidden-gems" className="hover:text-amber-400 transition-colors">Curated Hidden Gems</Link>
              </li>
              <li>
                <Link to="/my-quests" className="hover:text-amber-400 transition-colors">My Saved KHOJs</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">The Problem We Solve</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Problem-First Engine</h4>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">Local Detective</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Every stop features real observation clues, encouraging you to look closer at what most tourists walk past.
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} KHOJ AI. Real Data • Real Discovery • Powered by Gemini & MongoDB.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Crafted for curious travelers and local explorers.
          </p>
        </div>
      </div>
    </footer>
  );
};


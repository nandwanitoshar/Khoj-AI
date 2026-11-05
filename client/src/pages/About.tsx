import React from 'react';
import { Compass, Eye, BookOpen, Database, Sparkles, MapPin, ArrowDown, Cpu, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Product Manifesto & Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          WHY WE BUILT <span className="text-gradient">KHOJ AI</span>
        </h1>
        <p className="text-zinc-300 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
          "KHOJ AI doesn't just tell you where to go. It tells you what to discover when you get there."
        </p>
      </div>

      {/* The Core Problem */}
      <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <span className="text-amber-400 font-black">#1</span>
          <span>The Problem We Are Solving</span>
        </h2>
        
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
          People often live in or visit a city without discovering its smaller local experiences, overlooked places, cultural details and stories.
        </p>

        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Most travel products answer: <strong className="text-zinc-200">"Where should I go?"</strong> with popular lists, ratings, and itineraries. But they don't solve the deeper discovery problem:
        </p>

        <blockquote className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 text-amber-200 text-base font-semibold italic">
          "What should I actually notice, experience or discover when I get there?"
        </blockquote>

        <p className="text-zinc-400 text-sm leading-relaxed">
          Students and young people especially have limited time, limited budgets, and curiosity about hidden places. KHOJ AI converts local exploration into an authentic discovery quest.
        </p>
      </div>

      {/* SECTION 8: TECHNICAL ARCHITECTURE PIPELINE */}
      <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-amber-400">Technical Foundation</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">How KHOJ AI Processes Local Knowledge</h2>
        </div>

        {/* Pipeline Diagram */}
        <div className="space-y-4 max-w-xl mx-auto">
          
          {/* Step 1: MONGODB */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-center shadow-lg">
            <div className="inline-flex items-center space-x-2 text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>MONGODB</span>
            </div>
            <div className="text-white font-bold text-base">Local Knowledge Base</div>
            <p className="text-xs text-zinc-400">
              Stores real destination knowledge: verified descriptions, local stories, hidden details, costs, durations, and coordinates.
            </p>
          </div>

          <div className="flex justify-center text-amber-500">
            <ArrowDown className="w-5 h-5 text-amber-500" />
          </div>

          {/* Step 2: KHOJ ENGINE */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-center shadow-lg">
            <div className="inline-flex items-center space-x-2 text-amber-400 font-extrabold text-sm uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>KHOJ ENGINE</span>
            </div>
            <div className="text-white font-bold text-base">Destination Matching Engine</div>
            <p className="text-xs text-zinc-400">
              Intelligently filters and matches verified places to user: time • budget • interests • exploration style • hidden-gem preference.
            </p>
          </div>

          <div className="flex justify-center text-amber-500">
            <ArrowDown className="w-5 h-5 text-amber-500" />
          </div>

          {/* Step 3: GEMINI */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-center shadow-lg">
            <div className="inline-flex items-center space-x-2 text-blue-400 font-extrabold text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>GEMINI</span>
            </div>
            <div className="text-white font-bold text-base">Personalization + Storytelling Engine</div>
            <p className="text-xs text-zinc-400">
              Personalizes quests, observation challenges, and local stories using supplied knowledge without hallucinating places.
            </p>
          </div>

          <div className="flex justify-center text-amber-500">
            <ArrowDown className="w-5 h-5 text-amber-500" />
          </div>

          {/* Step 4: KHOJ AI */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-500/50 space-y-2 text-center shadow-xl shadow-amber-500/10">
            <div className="inline-flex items-center space-x-2 text-amber-300 font-black text-sm uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>KHOJ AI</span>
            </div>
            <div className="text-white font-black text-lg">Real-World Exploration Experience</div>
            <p className="text-xs text-zinc-200">
              Turns local information into a real-world exploration experience: Look → Notice → Discover → Understand.
            </p>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/explore"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-black text-base shadow-xl shadow-orange-600/25 transition-all hover:scale-105"
        >
          <Compass className="w-5 h-5 text-zinc-950" />
          <span>START YOUR KHOJ</span>
        </Link>
      </div>

    </div>
  );
};

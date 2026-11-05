import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, Bookmark, Gem, Info, Menu, X, Award } from 'lucide-react';
import { getKhojScore } from '../utils/session';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setScore(getKhojScore());
    const interval = setInterval(() => {
      setScore(getKhojScore());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { to: '/explore', label: 'Start Khoj', icon: Sparkles },
    { to: '/hidden-gems', label: 'Hidden Gems', icon: Gem },
    { to: '/my-quests', label: 'My Quests', icon: Bookmark },
    { to: '/about', label: 'Our Philosophy', icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0f1015]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">KHOJ</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">AI</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">Your City Is Hiding Stories</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Gamification Score & Quick Khoj */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-amber-400">{score}</span>
              <span className="text-zinc-400">PTS</span>
            </div>

            <Link
              to="/explore"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-bold text-sm shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Khoj
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium ${
                  active
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-amber-400' : 'text-zinc-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
            <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Khoj Explorer Score: <strong className="text-amber-400">{score} PTS</strong></span>
            </div>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs"
            >
              Generate Quest
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};


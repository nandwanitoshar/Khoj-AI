import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { QuestView } from './pages/QuestView';
import { DestinationDetail } from './pages/DestinationDetail';
import { HiddenGems } from './pages/HiddenGems';
import { MyQuests } from './pages/MyQuests';
import { About } from './pages/About';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#0b0c10] text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/quest/:id" element={<QuestView />} />
            <Route path="/destination/:id" element={<DestinationDetail />} />
            <Route path="/hidden-gems" element={<HiddenGems />} />
            <Route path="/my-quests" element={<MyQuests />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

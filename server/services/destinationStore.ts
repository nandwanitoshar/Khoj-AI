import { Destination, IDestination } from '../models/Destination.js';
import { Quest, IQuest } from '../models/Quest.js';
import { seedDestinations } from '../data/seedData.js';
import { isDbConnected } from '../config/db.js';
import fs from 'fs';
import path from 'path';

// Local storage backup file if MongoDB server isn't running on the developer's laptop
const DATA_DIR = path.resolve(process.cwd(), 'data_cache');
const QUESTS_FILE = path.join(DATA_DIR, 'saved_quests.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let inMemoryDestinations: any[] = seedDestinations.map((d, index) => ({
  ...d,
  _id: `dest_${index + 1}`,
  createdAt: new Date(),
  updatedAt: new Date()
}));

function getPersistedQuests(): any[] {
  try {
    if (fs.existsSync(QUESTS_FILE)) {
      const data = fs.readFileSync(QUESTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading persisted quests:', e);
  }
  return [];
}

function persistQuests(quests: any[]) {
  try {
    fs.writeFileSync(QUESTS_FILE, JSON.stringify(quests, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error persisting quests:', e);
  }
}

export class DestinationStore {
  static async getAll(filter: { city?: string; category?: string; search?: string } = {}): Promise<any[]> {
    if (isDbConnected()) {
      try {
        const query: any = {};
        if (filter.city) query.city = new RegExp(filter.city, 'i');
        if (filter.category) query.category = filter.category;
        if (filter.search) {
          query.$or = [
            { name: new RegExp(filter.search, 'i') },
            { description: new RegExp(filter.search, 'i') },
            { tags: new RegExp(filter.search, 'i') }
          ];
        }
        return await (Destination as any).find(query).sort({ hiddenGemScore: -1 });
      } catch (err) {
        console.error('MongoDB query error, falling back to memory store:', err);
      }
    }

    // Memory / Seed store
    let results = [...inMemoryDestinations];
    if (filter.city) {
      const cityRegex = new RegExp(filter.city, 'i');
      results = results.filter(d => cityRegex.test(d.city));
    }
    if (filter.category) {
      results = results.filter(d => d.category.toLowerCase() === filter.category?.toLowerCase());
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      results = results.filter(d =>
        d.name.toLowerCase().includes(s) ||
        d.description.toLowerCase().includes(s) ||
        (d.tags && d.tags.some((t: string) => t.toLowerCase().includes(s)))
      );
    }
    return results.sort((a, b) => b.hiddenGemScore - a.hiddenGemScore);
  }

  static async getById(id: string): Promise<any | null> {
    if (isDbConnected()) {
      try {
        const dest = await (Destination as any).findById(id);
        if (dest) return dest;
      } catch (err) {
        // ID might not be a valid ObjectId
      }
    }
    return inMemoryDestinations.find(d => d._id === id || d.slug === id) || null;
  }

  static async getHiddenGems(minScore = 7): Promise<any[]> {
    if (isDbConnected()) {
      try {
        return await (Destination as any).find({ hiddenGemScore: { $gte: minScore } }).sort({ hiddenGemScore: -1 });
      } catch (err) {
        console.error('MongoDB query error, falling back:', err);
      }
    }
    return inMemoryDestinations
      .filter(d => d.hiddenGemScore >= minScore)
      .sort((a, b) => b.hiddenGemScore - a.hiddenGemScore);
  }
}

export class QuestStore {
  static async save(questData: any): Promise<any> {
    if (isDbConnected()) {
      try {
        const newQuest = new Quest(questData);
        return await newQuest.save();
      } catch (err) {
        console.error('MongoDB save error, falling back to persistent file store:', err);
      }
    }

    // Fallback file persistence
    const quests = getPersistedQuests();
    const id = questData._id || `quest_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const saved = {
      ...questData,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    quests.unshift(saved);
    persistQuests(quests);
    return saved;
  }

  static async getBySession(sessionId: string): Promise<any[]> {
    if (isDbConnected()) {
      try {
        return await (Quest as any).find({ sessionId }).sort({ createdAt: -1 });
      } catch (err) {
        console.error('MongoDB getBySession error, falling back:', err);
      }
    }

    const quests = getPersistedQuests();
    return quests.filter(q => q.sessionId === sessionId);
  }

  static async getById(id: string): Promise<any | null> {
    if (isDbConnected()) {
      try {
        const quest = await (Quest as any).findById(id);
        if (quest) return quest;
      } catch (err) {
        // ID might not be a valid ObjectId
      }
    }

    const quests = getPersistedQuests();
    return quests.find(q => q._id === id || q.id === id) || null;
  }

  static async deleteById(id: string): Promise<boolean> {
    if (isDbConnected()) {
      try {
        const result = await (Quest as any).findByIdAndDelete(id);
        if (result) return true;
      } catch (err) {
        console.error('MongoDB delete error:', err);
      }
    }

    const quests = getPersistedQuests();
    const initialLen = quests.length;
    const filtered = quests.filter(q => q._id !== id && q.id !== id);
    if (filtered.length !== initialLen) {
      persistQuests(filtered);
      return true;
    }
    return false;
  }
}


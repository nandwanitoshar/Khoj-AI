import type { Quest, Destination } from '../types';

const API_BASE = '/api';

export async function generateQuest(params: {
  location: string;
  timeAvailable: number;
  budget: number;
  interests: string[];
  explorationStyle: string;
  hiddenGemMode: boolean;
  sessionId: string;
}): Promise<{ success: boolean; data?: Quest; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/quests/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network connection failed' };
  }
}

export async function saveQuest(quest: Quest): Promise<{ success: boolean; data?: Quest; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/quests/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quest)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save quest' };
  }
}

export async function getSavedQuests(sessionId: string): Promise<{ success: boolean; data?: Quest[]; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/quests/${sessionId}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to retrieve saved quests' };
  }
}

export async function getQuestById(id: string): Promise<{ success: boolean; data?: Quest; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/quests/detail/${id}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to load quest' };
  }
}

export async function deleteQuest(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/quests/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete quest' };
  }
}

export async function getDestinations(filters?: { city?: string; category?: string; search?: string }): Promise<{ success: boolean; data?: Destination[]; error?: string }> {
  try {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/destinations?${params.toString()}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to load destinations' };
  }
}

export async function getDestinationById(id: string): Promise<{ success: boolean; data?: Destination; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/destinations/${id}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch destination' };
  }
}

export async function getHiddenGems(): Promise<{ success: boolean; data?: Destination[]; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/destinations/hidden`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch hidden gems' };
  }
}

export async function getAiStory(payload: { destinationId?: string; destination?: any }): Promise<{ success: boolean; story?: string; source?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/ai/story`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to generate AI story' };
  }
}

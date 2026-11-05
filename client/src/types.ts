export interface Destination {
  _id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  country: string;
  category: string;
  description: string;
  history: string;
  culturalSignificance: string;
  localStory: string;
  hiddenDetails: string;
  localTips: string;
  estimatedCost: number;
  visitTimeMinutes: number;
  bestTime: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  imageUrl: string;
  tags: string[];
  hiddenGemScore: number;
}

export interface QuestDestination {
  destinationId: string;
  order: number;
  name: string;
  category: string;
  imageUrl: string;
  estimatedCost: number;
  visitTimeMinutes: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  hiddenDetails: string;
  localStory: string;
  reason: string;
  challenge: string;
  experience: string;
  estimatedMinutes: number;
}

export interface Quest {
  _id?: string;
  sessionId: string;
  title: string;
  location: string;
  budget: number;
  timeAvailable: number;
  interests: string[];
  explorationStyle: string;
  hiddenGemMode: boolean;
  destinations: QuestDestination[];
  summary: string;
  totalEstimatedCost: number;
  isAiGenerated?: boolean;
  note?: string;
  createdAt?: string;
}

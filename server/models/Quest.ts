import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestDestination {
  destinationId: string;
  destination?: mongoose.Types.ObjectId;
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
  order: number;
  reason: string;
  challenge: string;
  experience: string;
  estimatedMinutes: number;
}

export interface IQuest extends Document {
  sessionId: string;
  title: string;
  location: string;
  budget: number;
  timeAvailable: number;
  interests: string[];
  explorationStyle: string;
  hiddenGemMode: boolean;
  destinations: IQuestDestination[];
  summary: string;
  totalEstimatedCost: number;
  isAiGenerated: boolean;
  completedStops?: number[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestDestinationSchema = new Schema(
  {
    destinationId: { type: String, required: true },
    destination: { type: Schema.Types.ObjectId, ref: 'Destination' },
    name: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    estimatedCost: { type: Number, default: 0 },
    visitTimeMinutes: { type: Number, default: 30 },
    coordinates: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 }
    },
    hiddenDetails: { type: String, default: '' },
    localStory: { type: String, default: '' },
    order: { type: Number, required: true },
    reason: { type: String, required: true },
    challenge: { type: String, required: true },
    experience: { type: String, required: true },
    estimatedMinutes: { type: Number, required: true }
  },
  { _id: false }
);

const QuestSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    location: { type: String, required: true, index: true },
    budget: { type: Number, required: true },
    timeAvailable: { type: Number, required: true },
    interests: [{ type: String }],
    explorationStyle: { type: String, default: 'Curious' },
    hiddenGemMode: { type: Boolean, default: false },
    destinations: [QuestDestinationSchema],
    summary: { type: String, required: true },
    totalEstimatedCost: { type: Number, default: 0 },
    isAiGenerated: { type: Boolean, default: true },
    completedStops: [{ type: Number }]
  },
  {
    timestamps: true
  }
);

export const Quest = mongoose.models.Quest || mongoose.model<IQuest>('Quest', QuestSchema);


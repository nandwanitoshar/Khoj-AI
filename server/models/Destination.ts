import mongoose, { Document, Schema } from 'mongoose';

export interface IDestination extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    city: { type: String, required: true, index: true },
    state: { type: String, default: 'Haryana' },
    country: { type: String, default: 'India' },
    category: {
      type: String,
      required: true,
      enum: [
        'History',
        'Food',
        'Architecture',
        'Culture',
        'Nature',
        'Art',
        'Markets',
        'Spiritual',
        'Photography',
        'Hidden Gems'
      ],
      index: true
    },
    description: { type: String, required: true },
    history: { type: String, required: true },
    culturalSignificance: { type: String, required: true },
    localStory: { type: String, required: true },
    hiddenDetails: { type: String, required: true },
    localTips: { type: String, required: true },
    estimatedCost: { type: Number, default: 0 },
    visitTimeMinutes: { type: Number, required: true },
    bestTime: { type: String, default: 'Morning or Sunset' },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    imageUrl: { type: String, required: true },
    tags: [{ type: String, index: true }],
    hiddenGemScore: { type: Number, min: 1, max: 10, default: 5, index: true }
  },
  {
    timestamps: true
  }
);

export const Destination = mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);


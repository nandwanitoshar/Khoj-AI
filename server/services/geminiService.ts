import { GoogleGenerativeAI } from '@google/generative-ai';
import { FallbackEngine, FallbackQuestResult } from './fallbackEngine.js';

export interface GeminiQuestParams {
  location: string;
  timeAvailable: number;
  budget: number;
  interests: string[];
  explorationStyle: string;
  hiddenGemMode: boolean;
  destinations: any[];
}

export class GeminiService {
  private static getClient(): GoogleGenerativeAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
      return null;
    }
    return new GoogleGenerativeAI(apiKey);
  }

  static async generatePersonalizedQuest(params: GeminiQuestParams): Promise<FallbackQuestResult> {
    const { location, timeAvailable, budget, interests, explorationStyle, hiddenGemMode, destinations } = params;

    // If no destinations matched
    if (!destinations || destinations.length === 0) {
      return FallbackEngine.generateFallbackQuest({
        location,
        timeAvailable,
        budget,
        interests,
        explorationStyle,
        hiddenGemMode,
        matchedDestinations: []
      });
    }

    const client = this.getClient();
    if (!client) {
      console.log('ℹ️ [GeminiService] GEMINI_API_KEY not configured. Using deterministic verification engine.');
      return FallbackEngine.generateFallbackQuest({
        location,
        timeAvailable,
        budget,
        interests,
        explorationStyle,
        hiddenGemMode,
        matchedDestinations: destinations
      });
    }

    try {
      // Use gemini-1.5-flash or gemini-2.5-flash or gemini-pro
      const model = client.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });

      const prompt = `You are the KHOJ AI local exploration engine.

Create a personalized real-world exploration quest.
Use ONLY the destination information supplied to you below.
Do not invent destinations.
Do not invent historical facts.
Do not invent prices.
Do not invent opening hours.
Do not invent cultural claims.

USER PREFERENCES:
- Location: ${location}
- Available Time: ${timeAvailable} minutes
- Budget: ₹${budget}
- Interests: ${interests.join(', ')}
- Exploration Style: ${explorationStyle}
- Hidden Gem Mode: ${hiddenGemMode ? 'YES - PRIORITIZE OVERLOOKED DETAILS' : 'NO'}

VERIFIED DESTINATIONS PROVIDED:
${JSON.stringify(
  destinations.map(d => ({
    destinationId: d._id?.toString() || d.slug,
    name: d.name,
    category: d.category,
    description: d.description,
    history: d.history,
    hiddenDetails: d.hiddenDetails,
    localTips: d.localTips,
    estimatedCost: d.estimatedCost,
    visitTimeMinutes: d.visitTimeMinutes
  })),
  null,
  2
)}

Generate a response adhering strictly to this JSON format:
{
  "title": "A compelling title for this discovery quest",
  "summary": "2-3 concise sentences summarizing why this quest was built specifically for this explorer",
  "totalEstimatedCost": number,
  "destinations": [
    {
      "destinationId": "exact string matching destinationId provided",
      "order": 1,
      "reason": "Specific reason this fits user interests, style and budget",
      "challenge": "An observation challenge encouraging the user to physically look at a specific feature or detail at the site",
      "experience": "What to do and how to experience this place authentically",
      "estimatedMinutes": number
    }
  ]
}

Return valid structured JSON only.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      // Validate parsed JSON
      if (!parsed.title || !Array.isArray(parsed.destinations) || parsed.destinations.length === 0) {
        throw new Error('Invalid JSON structure returned by Gemini');
      }

      // Merge Gemini's personalized narrative with verified destination metadata
      const enrichedDestinations = parsed.destinations.map((aiDest: any, idx: number) => {
        const original = destinations.find(
          d => (d._id?.toString() === aiDest.destinationId) || (d.slug === aiDest.destinationId)
        ) || destinations[idx] || destinations[0];

        return {
          destinationId: original._id?.toString() || original.slug || `dest_${idx + 1}`,
          order: aiDest.order || (idx + 1),
          name: original.name,
          category: original.category,
          imageUrl: original.imageUrl,
          estimatedCost: original.estimatedCost || 0,
          visitTimeMinutes: original.visitTimeMinutes || 30,
          coordinates: original.coordinates || { latitude: 30.34, longitude: 76.84 },
          hiddenDetails: original.hiddenDetails,
          localStory: original.localStory,
          reason: aiDest.reason || `Chosen for its ${original.category} significance.`,
          challenge: aiDest.challenge || `Find the small detail most visitors walk past: ${original.hiddenDetails}`,
          experience: aiDest.experience || original.description,
          estimatedMinutes: aiDest.estimatedMinutes || original.visitTimeMinutes || 30
        };
      });

      return {
        title: parsed.title,
        summary: parsed.summary,
        totalEstimatedCost: parsed.totalEstimatedCost ?? enrichedDestinations.reduce((acc: number, d: any) => acc + d.estimatedCost, 0),
        isAiGenerated: true,
        destinations: enrichedDestinations
      };
    } catch (err: any) {
      console.warn('⚠️ [GeminiService] Gemini API call failed or timed out:', err.message);
      console.log('ℹ️ [KHOJ AI] Activating deterministic verification engine fallback.');
      return FallbackEngine.generateFallbackQuest({
        location,
        timeAvailable,
        budget,
        interests,
        explorationStyle,
        hiddenGemMode,
        matchedDestinations: destinations
      });
    }
  }

  static async generateLocalStory(destination: any): Promise<{ story: string; source: string }> {
    const client = this.getClient();
    if (!client) {
      return {
        story: `Most people pass ${destination.name} without realizing its backstory. ${destination.localStory || destination.history} Look for this: ${destination.hiddenDetails || 'the subtle marks left by artisans generations ago.'}`,
        source: 'verified_knowledge_base'
      };
    }

    try {
      const model = client.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { temperature: 0.3 }
      });

      const prompt = `You are the KHOJ AI Local Storyteller.
Using ONLY the verified facts below, write a short, vivid, captivating story (under 120 words) answering:
"Why should I care about this place and what is the hidden story behind it?"

Tone:
"Most people pass this spot without noticing..."
Do not invent any facts, characters, or dates. Use only the provided information.

PLACE: ${destination.name} (${destination.category}, ${destination.city})
HISTORY: ${destination.history}
LOCAL STORY: ${destination.localStory}
CULTURAL SIGNIFICANCE: ${destination.culturalSignificance}
HIDDEN DETAILS: ${destination.hiddenDetails}

Keep it concise, authentic, and evocative.`;

      const result = await model.generateContent(prompt);
      return {
        story: result.response.text().trim(),
        source: 'gemini_personalized'
      };
    } catch (err) {
      return {
        story: `Most people pass ${destination.name} without realizing its deep local roots. ${destination.localStory || destination.history} When you stand there, notice: ${destination.hiddenDetails}`,
        source: 'verified_knowledge_base'
      };
    }
  }
}


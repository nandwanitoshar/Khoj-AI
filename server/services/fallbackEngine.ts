export interface FallbackQuestResult {
  title: string;
  summary: string;
  totalEstimatedCost: number;
  isAiGenerated: boolean;
  note?: string;
  destinations: {
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
  }[];
}

export class FallbackEngine {
  static generateFallbackQuest(params: {
    location: string;
    timeAvailable: number;
    budget: number;
    interests: string[];
    explorationStyle: string;
    hiddenGemMode: boolean;
    matchedDestinations: any[];
  }): FallbackQuestResult {
    const { location, timeAvailable, budget, interests, explorationStyle, hiddenGemMode, matchedDestinations } = params;

    const interestStr = (interests && interests.length > 0) ? interests.join(' & ') : 'Local Culture';
    const styleStr = explorationStyle || 'Curious';

    let title = `${location} ${styleStr} Trail: ${interestStr}`;
    if (hiddenGemMode) {
      title = `Unseen ${location}: Secret ${interestStr} Quest`;
    }

    const totalEstimatedCost = matchedDestinations.reduce((acc, d) => acc + (d.estimatedCost || 0), 0);

    const formattedDestinations = matchedDestinations.map((dest, idx) => {
      const order = idx + 1;
      
      // Real challenge derived directly from the verified destination hiddenDetails & localTips
      let challenge = `Look closely before leaving: ${dest.hiddenDetails || 'Inspect the main architectural entrance and note the oldest masonry mark.'}`;
      
      let reason = dest.matchReasons && dest.matchReasons.length > 0 
        ? dest.matchReasons.join('. ') 
        : `Handpicked for its authentic ${dest.category} heritage and verified local significance.`;

      let experience = `${dest.description} Don't rush; take in the atmosphere. Local tip: ${dest.localTips || 'Take a moment to absorb the historical context.'}`;

      return {
        destinationId: dest._id?.toString() || dest.slug || `dest_${order}`,
        order,
        name: dest.name,
        category: dest.category,
        imageUrl: dest.imageUrl,
        estimatedCost: dest.estimatedCost || 0,
        visitTimeMinutes: dest.visitTimeMinutes || 30,
        coordinates: dest.coordinates || { latitude: 30.34, longitude: 76.84 },
        hiddenDetails: dest.hiddenDetails,
        localStory: dest.localStory,
        reason,
        challenge,
        experience,
        estimatedMinutes: dest.visitTimeMinutes || 30
      };
    });

    const summary = `Tailored ${timeAvailable}-minute exploration through ${matchedDestinations.length} authentic discovery stop${matchedDestinations.length > 1 ? 's' : ''} in ${location}. Designed for a ${styleStr} explorer on a ₹${budget} budget looking for ${interestStr}.`;

    return {
      title,
      summary,
      totalEstimatedCost,
      isAiGenerated: false,
      note: 'AI took a detour. We built your local KHOJ using verified destination data.',
      destinations: formattedDestinations
    };
  }
}


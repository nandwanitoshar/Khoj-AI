import { DestinationStore } from './destinationStore.js';

export interface MatchingParams {
  location: string;
  timeAvailable: number; // in minutes (e.g. 30, 60, 90, 120, 240, 480)
  budget: number; // in INR (e.g. 0, 200, 500, 800, 1500, 2500)
  interests: string[];
  explorationStyle: string;
  hiddenGemMode: boolean;
}

export interface ScoredDestination {
  destination: any;
  score: number;
  matchReasons: string[];
}

export class MatchingEngine {
  static async matchDestinations(params: MatchingParams): Promise<any[]> {
    const { location, timeAvailable, budget, interests, explorationStyle, hiddenGemMode } = params;

    // 1. Fetch destinations matching location / nearby
    let candidates = await DestinationStore.getAll({ city: location });

    // If no exact match for city, fetch all to allow nearby fallback
    if (candidates.length === 0) {
      candidates = await DestinationStore.getAll();
    }

    if (candidates.length === 0) {
      return [];
    }

    // 2. Score each candidate
    const scored: ScoredDestination[] = candidates.map(dest => {
      let score = 0;
      const matchReasons: string[] = [];

      // A. Location matching
      if (dest.city.toLowerCase() === location.toLowerCase()) {
        score += 30;
      } else {
        score += 10;
      }

      // B. Interest matching
      const userInterestsLower = (interests || []).map(i => i.toLowerCase());
      const destCategoryLower = dest.category.toLowerCase();
      const destTagsLower = (dest.tags || []).map((t: string) => t.toLowerCase());

      const matchedCategory = userInterestsLower.includes(destCategoryLower);
      const matchedTags = destTagsLower.filter((tag: string) => userInterestsLower.includes(tag));

      if (matchedCategory) {
        score += 35;
        matchReasons.push(`Matches your interest in ${dest.category}`);
      }

      if (matchedTags.length > 0) {
        score += matchedTags.length * 15;
        matchReasons.push(`Touches on ${matchedTags.join(', ')}`);
      }

      // C. Hidden Gem Mode
      if (hiddenGemMode) {
        if (dest.hiddenGemScore >= 8) {
          score += 40;
          matchReasons.push(`Exceptional hidden gem (Score: ${dest.hiddenGemScore}/10)`);
        } else if (dest.hiddenGemScore >= 6) {
          score += 20;
        }
      } else {
        // Standard exploration
        score += dest.hiddenGemScore * 3;
      }

      // D. Exploration style alignment
      const style = (explorationStyle || 'Curious').toLowerCase();
      if (style === 'foodie' && (destCategoryLower === 'food' || destTagsLower.includes('food'))) {
        score += 30;
        matchReasons.push('Prime spot for authentic culinary exploration');
      } else if (style === 'history hunter' && (destCategoryLower === 'history' || destTagsLower.includes('history'))) {
        score += 30;
        matchReasons.push('Deep historical archive with rich archival heritage');
      } else if (style === 'photographer' && (destCategoryLower === 'photography' || destTagsLower.includes('photography') || destCategoryLower === 'architecture')) {
        score += 30;
        matchReasons.push('Incredible visual perspective and lighting angles');
      } else if (style === 'curious' && dest.hiddenDetails) {
        score += 25;
        matchReasons.push('High concentration of overlooked architectural details');
      } else if (style === 'adventurous' && dest.hiddenGemScore >= 7) {
        score += 25;
        matchReasons.push('Off the beaten track discovery');
      } else if (style === 'relaxed' && dest.visitTimeMinutes <= 45) {
        score += 20;
        matchReasons.push('Tranquil pace with unhurried ambiance');
      }

      // E. Budget check
      if (dest.estimatedCost <= budget) {
        score += 15;
      } else {
        score -= 20; // Penalize if above individual budget
      }

      // F. Visit time check
      if (dest.visitTimeMinutes <= timeAvailable) {
        score += 15;
      } else {
        score -= 30; // Penalize if it exceeds entire available time
      }

      return {
        destination: dest,
        score,
        matchReasons
      };
    });

    // 3. Sort by descending score
    scored.sort((a, b) => b.score - a.score);

    // 4. Select cohesive sequence fitting total time and budget
    // Determine target number of stops based on timeAvailable
    let maxStops = 1;
    if (timeAvailable <= 35) {
      maxStops = 1; // 30-min khoj is strictly 1 deep discovery stop
    } else if (timeAvailable <= 75) {
      maxStops = 2; // ~1 hour
    } else if (timeAvailable <= 120) {
      maxStops = 2; // 90 min - 2 hours
    } else if (timeAvailable <= 240) {
      maxStops = 3; // Half day
    } else {
      maxStops = 4; // Full day
    }

    const selectedDestinations: any[] = [];
    let accumulatedTime = 0;
    let accumulatedCost = 0;
    const transitBufferMinutes = 15; // Realistic buffer for transit between stops

    for (const item of scored) {
      const dest = item.destination;
      const additionalTime = (selectedDestinations.length > 0 ? transitBufferMinutes : 0) + (dest.visitTimeMinutes || 30);
      const additionalCost = dest.estimatedCost || 0;

      // Allow slight flexibility on budget if budget is very small (₹0 - ₹200)
      const fitsTime = (accumulatedTime + additionalTime) <= (timeAvailable + 10);
      const fitsBudget = (accumulatedCost + additionalCost) <= Math.max(budget, 100);

      if (fitsTime && fitsBudget && selectedDestinations.length < maxStops) {
        selectedDestinations.push({
          ...dest,
          matchReasons: item.matchReasons
        });
        accumulatedTime += additionalTime;
        accumulatedCost += additionalCost;
      }

      if (selectedDestinations.length >= maxStops) {
        break;
      }
    }

    // Fallback: If strict time/budget excluded everything, pick the highest scoring single destination
    if (selectedDestinations.length === 0 && scored.length > 0) {
      selectedDestinations.push({
        ...scored[0].destination,
        matchReasons: scored[0].matchReasons
      });
    }

    return selectedDestinations;
  }
}


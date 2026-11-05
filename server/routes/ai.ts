import { Router, Request, Response } from 'express';
import { GeminiService } from '../services/geminiService.js';
import { DestinationStore } from '../services/destinationStore.js';

const router = Router();

// POST /api/ai/story
router.post('/story', async (req: Request, res: Response) => {
  try {
    const { destinationId, destination } = req.body;

    let targetDest = destination;
    if (!targetDest && destinationId) {
      targetDest = await DestinationStore.getById(destinationId);
    }

    if (!targetDest) {
      return res.status(400).json({
        success: false,
        error: 'Please provide destination data or a valid destinationId'
      });
    }

    const storyResult = await GeminiService.generateLocalStory(targetDest);

    res.json({
      success: true,
      story: storyResult.story,
      source: storyResult.source,
      destinationName: targetDest.name
    });
  } catch (err: any) {
    console.error('[AI Story Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate local story'
    });
  }
});

export default router;


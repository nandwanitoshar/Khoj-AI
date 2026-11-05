import { Router, Request, Response } from 'express';
import { MatchingEngine } from '../services/matchingEngine.js';
import { GeminiService } from '../services/geminiService.js';
import { QuestStore } from '../services/destinationStore.js';

const router = Router();

// POST /api/quests/generate
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const {
      location = 'Ambala',
      timeAvailable = 90,
      budget = 800,
      interests = ['History', 'Food'],
      explorationStyle = 'Curious',
      hiddenGemMode = false,
      sessionId
    } = req.body;

    // Validate input types
    const parsedTime = Number(timeAvailable) || 90;
    const parsedBudget = Number(budget) ?? 800;
    const cleanInterests = Array.isArray(interests) && interests.length > 0 ? interests : ['History', 'Food'];
    const cleanLocation = String(location).trim() || 'Ambala';

    console.log(`[Quest Engine] Generating quest for ${cleanLocation} (${parsedTime}m, ₹${parsedBudget}, style: ${explorationStyle})`);

    // 1. Destination Matching
    const matchedDestinations = await MatchingEngine.matchDestinations({
      location: cleanLocation,
      timeAvailable: parsedTime,
      budget: parsedBudget,
      interests: cleanInterests,
      explorationStyle: String(explorationStyle),
      hiddenGemMode: Boolean(hiddenGemMode)
    });

    if (matchedDestinations.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No suitable destinations found for ${cleanLocation} with your preferences. Try broadening your interests or increasing your time.`
      });
    }

    // 2. Gemini Personalization Engine (with automated resilient fallback)
    const questResult = await GeminiService.generatePersonalizedQuest({
      location: cleanLocation,
      timeAvailable: parsedTime,
      budget: parsedBudget,
      interests: cleanInterests,
      explorationStyle: String(explorationStyle),
      hiddenGemMode: Boolean(hiddenGemMode),
      destinations: matchedDestinations
    });

    const completeQuest = {
      sessionId: sessionId || `session_${Date.now()}`,
      title: questResult.title,
      location: cleanLocation,
      budget: parsedBudget,
      timeAvailable: parsedTime,
      interests: cleanInterests,
      explorationStyle: String(explorationStyle),
      hiddenGemMode: Boolean(hiddenGemMode),
      destinations: questResult.destinations,
      summary: questResult.summary,
      totalEstimatedCost: questResult.totalEstimatedCost,
      isAiGenerated: questResult.isAiGenerated,
      note: (questResult as any).note
    };

    res.json({
      success: true,
      data: completeQuest
    });
  } catch (err: any) {
    console.error('[Quest Engine Error]:', err);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while generating your exploration quest.'
    });
  }
});

// POST /api/quests/save
router.post('/save', async (req: Request, res: Response) => {
  try {
    const questData = req.body;
    if (!questData.title || !questData.destinations || !questData.sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required quest fields or sessionId'
      });
    }

    const savedQuest = await QuestStore.save(questData);
    res.json({
      success: true,
      message: 'KHOJ successfully saved to your explorer collection.',
      data: savedQuest
    });
  } catch (err: any) {
    console.error('[Quest Save Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Could not save this quest to the database.'
    });
  }
});

// GET /api/quests/:sessionId - Retrieve saved quests for a user
router.get('/:sessionId', async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.sessionId);
    const quests = await QuestStore.getBySession(sessionId);
    res.json({
      success: true,
      count: quests.length,
      data: quests
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve your saved quests'
    });
  }
});

// GET /api/quests/detail/:id - Retrieve specific quest by id
router.get('/detail/:id', async (req: Request, res: Response) => {
  try {
    const questId = String(req.params.id);
    const quest = await QuestStore.getById(questId);
    if (!quest) {
      return res.status(404).json({ success: false, error: 'Quest not found' });
    }
    res.json({ success: true, data: quest });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve quest' });
  }
});

// DELETE /api/quests/:id - Actually delete quest document from MongoDB
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const questId = String(req.params.id);
    const success = await QuestStore.deleteById(questId);
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Quest not found or already deleted'
      });
    }
    res.json({
      success: true,
      message: 'KHOJ quest permanently removed from database.'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete quest'
    });
  }
});

export default router;


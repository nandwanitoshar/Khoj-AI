import { Router, Request, Response } from 'express';
import { DestinationStore } from '../services/destinationStore.js';

const router = Router();

// GET /api/destinations/hidden - Must be declared BEFORE /:id
router.get('/hidden', async (req: Request, res: Response) => {
  try {
    const minScore = req.query.minScore ? parseInt(req.query.minScore as string, 10) : 7;
    const gems = await DestinationStore.getHiddenGems(minScore);
    res.json({ success: true, count: gems.length, data: gems });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch hidden gems' });
  }
});

// GET /api/destinations
router.get('/', async (req: Request, res: Response) => {
  try {
    const { city, category, search } = req.query;
    const destinations = await DestinationStore.getAll({
      city: city as string,
      category: category as string,
      search: search as string
    });
    res.json({ success: true, count: destinations.length, data: destinations });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch destinations' });
  }
});

// GET /api/destinations/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const destId = String(req.params.id);
    const dest = await DestinationStore.getById(destId);
    if (!dest) {
      return res.status(404).json({ success: false, error: 'Destination not found' });
    }
    res.json({ success: true, data: dest });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch destination details' });
  }
});

export default router;


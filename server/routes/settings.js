import { Router } from 'express';
import { readJSON, writeJSON } from '../lib/store.js';
import { DEFAULT_SETTINGS } from '../lib/defaults.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const FILE = 'settings.json';

router.get('/', (req, res) => res.json(readJSON(FILE, DEFAULT_SETTINGS)));

router.put('/', requireAuth, (req, res) => {
  const current = readJSON(FILE, DEFAULT_SETTINGS);
  const merged = { ...current, ...req.body, social: { ...current.social, ...(req.body.social || {}) } };
  writeJSON(FILE, merged);
  res.json(merged);
});

export default router;

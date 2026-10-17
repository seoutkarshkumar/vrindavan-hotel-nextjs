import { Router } from 'express';
import { readJSON, writeJSON, nextId } from '../lib/store.js';
import { DEFAULT_PAGES } from '../lib/defaults.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const FILE = 'pages.json';

router.get('/', (req, res) => res.json(readJSON(FILE, DEFAULT_PAGES)));

router.get('/:slug', (req, res) => {
  const item = readJSON(FILE, DEFAULT_PAGES).find(
    p => p.slug === req.params.slug || String(p.id) === req.params.slug
  );
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.post('/', requireAuth, (req, res) => {
  const list = readJSON(FILE, DEFAULT_PAGES);
  const item = { published: true, ...req.body, id: nextId(list) };
  list.push(item); writeJSON(FILE, list); res.json(item);
});

router.put('/:id', requireAuth, (req, res) => {
  const list = readJSON(FILE, DEFAULT_PAGES);
  const idx = list.findIndex(x => String(x.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  list[idx] = { ...list[idx], ...req.body, id: list[idx].id };
  writeJSON(FILE, list); res.json(list[idx]);
});

router.delete('/:id', requireAuth, (req, res) => {
  const list = readJSON(FILE, DEFAULT_PAGES).filter(x => String(x.id) !== req.params.id);
  writeJSON(FILE, list); res.json({ ok: true });
});

export default router;

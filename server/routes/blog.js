import { Router } from 'express';
import { readJSON, writeJSON, nextId } from '../lib/store.js';
import { DEFAULT_BLOG } from '../lib/defaults.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const FILE = 'blog.json';

router.get('/', (req, res) => res.json(readJSON(FILE, DEFAULT_BLOG)));

router.get('/:slug', (req, res) => {
  const item = readJSON(FILE, DEFAULT_BLOG).find(
    b => b.slug === req.params.slug || String(b.id) === req.params.slug
  );
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.post('/', requireAuth, (req, res) => {
  const list = readJSON(FILE, DEFAULT_BLOG);
  const item = { date: new Date().toISOString().split('T')[0], ...req.body, id: nextId(list) };
  list.push(item); writeJSON(FILE, list); res.json(item);
});

router.put('/:id', requireAuth, (req, res) => {
  const list = readJSON(FILE, DEFAULT_BLOG);
  const idx = list.findIndex(x => String(x.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  list[idx] = { ...list[idx], ...req.body, id: list[idx].id };
  writeJSON(FILE, list); res.json(list[idx]);
});

router.delete('/:id', requireAuth, (req, res) => {
  const list = readJSON(FILE, DEFAULT_BLOG).filter(x => String(x.id) !== req.params.id);
  writeJSON(FILE, list); res.json({ ok: true });
});

export default router;

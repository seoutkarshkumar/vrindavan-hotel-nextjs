import { Router } from 'express';
import { readJSON, writeJSON, nextId } from '../lib/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const FILE = 'bookings.json';

router.get('/', requireAuth, (req, res) => res.json(readJSON(FILE, [])));

router.post('/', (req, res) => {
  const list = readJSON(FILE, []);
  const item = {
    id: nextId(list),
    createdAt: new Date().toISOString(),
    status: 'new',
    ...req.body,
  };
  list.unshift(item);
  writeJSON(FILE, list);
  // TODO: send SMTP email if configured
  res.json({ ok: true, id: item.id });
});

router.put('/:id', requireAuth, (req, res) => {
  const list = readJSON(FILE, []);
  const idx = list.findIndex(x => String(x.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  list[idx] = { ...list[idx], ...req.body, id: list[idx].id };
  writeJSON(FILE, list); res.json(list[idx]);
});

router.delete('/:id', requireAuth, (req, res) => {
  const list = readJSON(FILE, []).filter(x => String(x.id) !== req.params.id);
  writeJSON(FILE, list); res.json({ ok: true });
});

export default router;

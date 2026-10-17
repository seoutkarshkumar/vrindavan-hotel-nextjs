import { Router } from 'express';
import { readJSON, writeJSON, nextId } from '../lib/store.js';
import { DEFAULT_ROOMS } from '../lib/defaults.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const FILE = 'rooms.json';

router.get('/', (req, res) => res.json(readJSON(FILE, DEFAULT_ROOMS)));

router.get('/:slug', (req, res) => {
  const rooms = readJSON(FILE, DEFAULT_ROOMS);
  const room = rooms.find(r => r.slug === req.params.slug || String(r.id) === req.params.slug);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
});

router.post('/', requireAuth, (req, res) => {
  const rooms = readJSON(FILE, DEFAULT_ROOMS);
  const room = { ...req.body, id: nextId(rooms) };
  rooms.push(room);
  writeJSON(FILE, rooms);
  res.json(room);
});

router.put('/:id', requireAuth, (req, res) => {
  const rooms = readJSON(FILE, DEFAULT_ROOMS);
  const idx = rooms.findIndex(r => String(r.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  rooms[idx] = { ...rooms[idx], ...req.body, id: rooms[idx].id };
  writeJSON(FILE, rooms);
  res.json(rooms[idx]);
});

router.delete('/:id', requireAuth, (req, res) => {
  const rooms = readJSON(FILE, DEFAULT_ROOMS).filter(r => String(r.id) !== req.params.id);
  writeJSON(FILE, rooms);
  res.json({ ok: true });
});

export default router;

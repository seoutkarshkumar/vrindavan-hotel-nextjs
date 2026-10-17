import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import roomsRoutes from './routes/rooms.js';
import servicesRoutes from './routes/services.js';
import pagesRoutes from './routes/pages.js';
import blogRoutes from './routes/blog.js';
import bookingsRoutes from './routes/bookings.js';
import settingsRoutes from './routes/settings.js';
import seoRoutes from './routes/seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// Block admin/api from search engines
app.use((req, res, next) => {
  if (req.path.startsWith('/admin') || req.path.startsWith('/api')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }
  next();
});

// SEO endpoints (must come BEFORE static)
app.use('/', seoRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/settings', settingsRoutes);

// Serve built React app in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.json({
    ok: true,
    message: 'Vrindavan Hotel API. Run "npm run dev:client" for UI on :5173',
  }));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🏨 Vrindavan Hotel server running on http://localhost:${PORT}`);
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}\n`);
});

/**
 * Sanitizes strings and HTML to prevent XSS while preserving safe formatting tags
 * needed for the visual Rich-Text Editor (headings, bold, lists, links, tables, images).
 */

export function sanitizePlainText(input = '') {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .trim();
}

export function sanitizeHtmlContent(html = '') {
  if (typeof html !== 'string') return '';
  return html
    // Remove <script>, <iframe> (except google maps), <object>, <embed>
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    // Strip inline event handlers like onclick=, onerror=, onload=
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    // Strip javascript: URLs
    .replace(/href\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'href="#"')
    .replace(/src\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'src=""');
}

export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function safeJsonParse(str, fallback = []) {
  if (!str) return fallback;
  if (typeof str !== 'string') return str;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

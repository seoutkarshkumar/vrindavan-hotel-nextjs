'use client';

import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

/**
 * Live SEO Checklist & Score Panel beside the Page/Blog/Room Editor.
 * Checks:
 * 1. SEO Title length (ideal 20–60 chars)
 * 2. Meta Description length (ideal 70–155 chars)
 * 3. H1 Page Title present
 * 4. Focus Keyword included in SEO Title or H1
 * 5. Featured Image + Descriptive Alt Text present
 * 6. At least 1 FAQ Question + Answer pair present (for FAQPage Google Rich Results)
 */
export default function SeoChecklist({
  h1Title = '',
  seoTitle = '',
  metaDescription = '',
  focusKeyword = '',
  featuredImage = '',
  featuredImageAlt = '',
  faqs = [],
  canonicalUrl = '',
}) {
  const effectiveSeoTitle = (seoTitle || h1Title || '').trim();
  const titleLen = effectiveSeoTitle.length;
  const descLen = (metaDescription || '').trim().length;
  const kw = (focusKeyword || '').trim().toLowerCase();

  const validFaqs = (Array.isArray(faqs) ? faqs : []).filter(
    (f) => f && f.question?.trim() && f.answer?.trim()
  );

  const checks = [
    {
      label: `SEO Title length (${titleLen}/60 chars — ideal under 60)`,
      passed: titleLen >= 15 && titleLen <= 60,
      tip:
        titleLen === 0
          ? 'Add an SEO Title.'
          : titleLen > 60
          ? 'Shorten title under 60 characters so Google does not cut it off.'
          : 'Great title length!',
    },
    {
      label: `Meta Description length (${descLen}/155 chars — ideal under 155)`,
      passed: descLen >= 50 && descLen <= 155,
      tip:
        descLen === 0
          ? 'Write a 1–2 line summary inviting guests to book.'
          : descLen > 155
          ? 'Shorten under 155 characters.'
          : 'Ideal description length!',
    },
    {
      label: 'H1 Page Heading is present',
      passed: h1Title.trim().length >= 5,
      tip: 'Every page must have a clear main heading (H1).',
    },
    {
      label: 'Focus Keyword appears in Title',
      passed:
        kw.length > 0 &&
        (effectiveSeoTitle.toLowerCase().includes(kw) ||
          h1Title.toLowerCase().includes(kw)),
      tip: kw
        ? `Include "${focusKeyword}" inside your SEO Title.`
        : 'Enter a Focus Keyword (e.g. "Hotel near Banke Bihari Temple").',
    },
    {
      label: 'Featured Photo + Image Alt Text present',
      passed: Boolean(featuredImage?.trim() && featuredImageAlt?.trim().length >= 4),
      tip: 'Add a Featured Image and describe it in Alt Text for Google Images.',
    },
    {
      label: `FAQs added (${validFaqs.length} Q&A pairs for Google Rich Results)`,
      passed: validFaqs.length >= 1,
      tip: 'Add at least 2–3 FAQs so Google & AI bots show your Q&A in search results.',
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sticky top-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-700" />
          <h3 className="font-serif font-bold text-stone-900 text-lg">
            Live SEO Score
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold ${
            score >= 80
              ? 'bg-emerald-100 text-emerald-800'
              : score >= 50
              ? 'bg-amber-100 text-amber-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {score} / 100
        </span>
      </div>

      {/* Google Search Snippet Live Preview */}
      <div className="mb-5 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
          Google Search Preview
        </div>
        <div className="text-xs text-emerald-700 truncate">
          {canonicalUrl || 'https://vrindavanhotel.com/your-page/'}
        </div>
        <div className="text-base font-semibold text-blue-700 leading-snug mt-0.5 line-clamp-1">
          {effectiveSeoTitle || 'Page Title | [naam]'}
        </div>
        <div className="text-xs text-stone-600 mt-1 line-clamp-2">
          {metaDescription ||
            'Book direct and save 10% at [naam], located near Banke Bihari Temple in Vrindavan.'}
        </div>
      </div>

      {/* Checklist items */}
      <ul className="space-y-3">
        {checks.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm">
            {item.passed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            )}
            <div>
              <div
                className={`font-medium ${
                  item.passed ? 'text-stone-800' : 'text-stone-900'
                }`}
              >
                {item.label}
              </div>
              {!item.passed && (
                <div className="text-xs text-stone-500 mt-0.5">{item.tip}</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

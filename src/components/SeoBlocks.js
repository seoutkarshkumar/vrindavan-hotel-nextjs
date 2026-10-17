import Link from 'next/link';
import { ChevronRight, HelpCircle } from 'lucide-react';

export function JsonLdScript({ schemas = [] }) {
  if (!schemas || schemas.length === 0) return null;
  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

export function Breadcrumbs({ items = [] }) {
  if (!items || items.length <= 1) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-stone-100 border-b border-stone-200 py-2.5 px-4"
    >
      <ol className="max-w-7xl mx-auto flex items-center flex-wrap gap-1.5 text-xs text-stone-600">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-stone-400" />}
              {isLast ? (
                <span className="font-semibold text-brand-800" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-brand-700 underline">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function FaqSection({ faqs = [], title = 'Frequently Asked Questions (FAQs)' }) {
  const valid = (Array.isArray(faqs) ? faqs : []).filter(
    (f) => f && f.question?.trim() && f.answer?.trim()
  );
  if (valid.length === 0) return null;

  return (
    <section className="py-12 border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-6 h-6 text-brand-700" />
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
            {title}
          </h2>
        </div>
        <div className="space-y-4">
          {valid.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm"
            >
              <h3 className="font-serif font-bold text-base md:text-lg text-stone-900">
                Q{idx + 1}. {faq.question}
              </h3>
              <p className="text-sm md:text-base text-stone-700 mt-2 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

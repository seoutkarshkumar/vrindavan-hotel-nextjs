'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';

/**
 * Unlimited FAQ Builder: Add, Edit, Delete, and Reorder Question + Answer pairs.
 * Automatically feeds into the JSON-LD FAQPage Schema on the public website.
 */
export default function FaqBuilder({ faqs = [], onChange }) {
  const list = Array.isArray(faqs) ? faqs : [];

  function addFaq() {
    onChange([...list, { question: '', answer: '' }]);
  }

  function updateFaq(index, field, val) {
    const next = list.map((item, idx) =>
      idx === index ? { ...item, [field]: val } : item
    );
    onChange(next);
  }

  function removeFaq(index) {
    onChange(list.filter((_, idx) => idx !== index));
  }

  function moveFaq(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-700" />
          <div>
            <h4 className="font-semibold text-stone-900 text-sm">
              Page FAQs (Auto-generates Google FAQ Schema)
            </h4>
            <p className="text-xs text-stone-500">
              Add questions guests ask on phone/WhatsApp. Google &amp; AI tools love these!
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addFaq}
          className="px-3.5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Question
        </button>
      </div>

      {list.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-stone-300 text-center text-stone-500 text-sm">
          No FAQs added yet. Click <strong>&ldquo;+ Add Question&rdquo;</strong> to add your first Q&amp;A.
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
                  FAQ #{idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveFaq(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg hover:bg-stone-200 disabled:opacity-30 text-stone-600"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFaq(idx, 1)}
                    disabled={idx === list.length - 1}
                    className="p-1.5 rounded-lg hover:bg-stone-200 disabled:opacity-30 text-stone-600"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFaq(idx)}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Question (Sawaal)
                </label>
                <input
                  type="text"
                  value={faq.question || ''}
                  onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                  placeholder="e.g. How far is the hotel from Banke Bihari Temple?"
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-brand-600 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Answer (Jawaab)
                </label>
                <textarea
                  rows={2}
                  value={faq.answer || ''}
                  onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                  placeholder="e.g. Our hotel is located at [full address], just [e.g. 600 m] from Banke Bihari Temple."
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-brand-600 outline-none bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

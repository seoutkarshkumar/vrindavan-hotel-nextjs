'use client';

import { useRef } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table,
  FileText,
} from 'lucide-react';

/**
 * Word-like Visual Editor for Zero-Coding Hotel Owner.
 * Supports Headings (H2/H3), Bold, Italic, Bullet List, Numbered List, Links, Images, and Tables.
 */
export default function RichTextEditor({ value = '', onChange }) {
  const textareaRef = useRef(null);

  function insertSnippet(before, after = '', placeholder = '') {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const selected = value.substring(start, end) || placeholder;
    const updated =
      value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(updated);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 10);
  }

  function handleAddLink() {
    const url = window.prompt('Enter Link URL (e.g. https://vrindavanhotel.com/rooms/):', '/rooms/');
    if (!url) return;
    const text = window.prompt('Enter Link Text:', 'View Our Rooms');
    insertSnippet(`<a href="${url}">`, '</a>', text || 'Click Here');
  }

  function handleAddImage() {
    const url = window.prompt('Paste Image URL (from Media Library or web):', 'https://');
    if (!url) return;
    const alt = window.prompt(
      'Describe this photo for Google SEO (Alt Text):',
      'Clean AC Room at Hotel in Vrindavan'
    );
    insertSnippet(`<img src="${url}" alt="${alt || 'Vrindavan Hotel Photo'}" />`, '', '');
  }

  function handleAddTable() {
    const tableHtml = `\n<table>
  <thead>
    <tr>
      <th>Room Type</th>
      <th>Tariff</th>
      <th>Capacity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Deluxe Room</td>
      <td>₹__</td>
      <td>2 Adults</td>
    </tr>
    <tr>
      <td>Family Room</td>
      <td>₹__</td>
      <td>4 Adults</td>
    </tr>
  </tbody>
</table>\n`;
    insertSnippet(tableHtml, '', '');
  }

  return (
    <div className="border border-stone-300 rounded-xl overflow-hidden bg-white">
      {/* Word-style Toolbar */}
      <div className="bg-stone-100 border-b border-stone-200 px-3 py-2 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => insertSnippet('<h2>', '</h2>', 'Main Section Heading')}
          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-stone-200 text-xs font-semibold flex items-center gap-1 text-stone-700"
          title="Add Large Heading (H2)"
        >
          <Heading2 className="w-4 h-4 text-brand-700" /> Heading 2
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('<h3>', '</h3>', 'Sub Heading')}
          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-stone-200 text-xs font-semibold flex items-center gap-1 text-stone-700"
          title="Add Sub-Heading (H3)"
        >
          <Heading3 className="w-4 h-4 text-brand-700" /> Heading 3
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('<p>', '</p>', 'Write your paragraph here...')}
          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-stone-200 text-xs font-semibold flex items-center gap-1 text-stone-700"
          title="Add Paragraph"
        >
          <FileText className="w-4 h-4" /> Paragraph
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('<strong>', '</strong>', 'Bold Text')}
          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-stone-200 text-xs font-semibold flex items-center gap-1 text-stone-700"
          title="Bold"
        >
          <Bold className="w-4 h-4" /> Bold
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('<em>', '</em>', 'Italic Text')}
          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-stone-200 text-xs font-semibold flex items-center gap-1 text-stone-700"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            insertSnippet(
              '\n<ul>\n  <li>First point</li>\n  <li>Second point</li>\n</ul>\n',
              '',
              ''
            )
          }
          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-stone-200 text-xs font-semibold flex items-center gap-1 text-stone-700"
          title="Bullet List"
        >
          <List className="w-4 h-4" /> List
        </button>
        <button
          type="button"
          onClick={() =>
            insertSnippet(
              '\n<ol>\n  <li>Step 1</li>\n  <li>Step 2</li>\n</ol>\n',
              '',
              ''
            )
          }
          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-stone-200 text-xs font-semibold flex items-center gap-1 text-stone-700"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" /> Numbered
        </button>
        <button
          type="button"
          onClick={handleAddLink}
          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-stone-200 text-xs font-semibold flex items-center gap-1 text-stone-700"
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4 text-brand-700" /> Link
        </button>
        <button
          type="button"
          onClick={handleAddImage}
          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-stone-200 text-xs font-semibold flex items-center gap-1 text-stone-700"
          title="Insert Image with SEO Alt Text"
        >
          <ImageIcon className="w-4 h-4 text-brand-700" /> Photo
        </button>
        <button
          type="button"
          onClick={handleAddTable}
          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-brand-50 border border-stone-200 text-xs font-semibold flex items-center gap-1 text-stone-700"
          title="Insert Tariff / Info Table"
        >
          <Table className="w-4 h-4 text-brand-700" /> Table
        </button>
      </div>

      {/* Editor & Live Visual Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
        <div className="p-3">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
            Write / Edit Content (Click toolbar buttons above to format)
          </div>
          <textarea
            ref={textareaRef}
            rows={12}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Click Heading 2, Paragraph, or List above and write your page content..."
            className="w-full p-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-brand-600 outline-none text-sm font-sans text-stone-800"
          />
        </div>
        <div className="p-4 bg-cream-50/60 max-h-[340px] overflow-y-auto">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
            Live Page Preview (How Guests &amp; Google See It)
          </div>
          <div
            className="prose-vrindavan text-sm"
            dangerouslySetInnerHTML={{
              __html: value || '<p class="text-stone-400 italic">Preview will appear here...</p>',
            }}
          />
        </div>
      </div>
    </div>
  );
}

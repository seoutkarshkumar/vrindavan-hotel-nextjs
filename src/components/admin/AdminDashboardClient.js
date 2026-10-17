'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  BedDouble,
  BookOpen,
  MessageSquare,
  Settings,
  Image as ImageIcon,
  ArrowRightLeft,
  Shield,
  LogOut,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Lock,
  Unlock,
  Download,
  Search,
  Send,
  CheckCircle2,
  Sparkles,
  Copy,
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import SeoChecklist from './SeoChecklist';
import FaqBuilder from './FaqBuilder';

function safeParse(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val !== 'string') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function slugifyClient(str = '') {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminDashboardClient({
  initialSettings,
  initialPages = [],
  initialRooms = [],
  initialEnquiries = [],
  initialMedia = [],
  initialRedirects = [],
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [settings, setSettings] = useState(initialSettings || {});
  const [pages, setPages] = useState(initialPages);
  const [rooms, setRooms] = useState(initialRooms);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [media, setMedia] = useState(initialMedia);
  const [redirects, setRedirects] = useState(initialRedirects);

  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [gscModalUrl, setGscModalUrl] = useState('');

  // Page / Blog Editor state
  const [editingPage, setEditingPage] = useState(null);
  // Room Editor state
  const [editingRoom, setEditingRoom] = useState(null);

  // Enquiries filters
  const [enquiryFilter, setEnquiryFilter] = useState('All');
  const [enquirySearch, setEnquirySearch] = useState('');

  // Media upload state
  const [mediaAlt, setMediaAlt] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');

  // Redirects form state
  const [fromPath, setFromPath] = useState('');
  const [toPath, setToPath] = useState('');

  // Account password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const domain = (settings?.domain || 'https://vrindavanhotel.com').replace(/\/+$/, '');

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 4500);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout/', { method: 'POST' });
    router.push('/admin/login/');
  }

  // Start creating or editing a Page / Location Page / Blog Post
  function openPageEditor(item = null, defaultType = 'page') {
    if (item) {
      setEditingPage({
        ...item,
        faqs: safeParse(item.faqs, []),
        tagsList: safeParse(item.tags, []).join(', '),
      });
    } else {
      setEditingPage({
        id: null,
        type: defaultType,
        title: '',
        slug: '',
        slugTouched: false,
        excerpt: '',
        content: '<h2>Heading</h2>\n<p>Write your content here...</p>',
        category: defaultType === 'blog' ? 'Vrindavan Darshan Guide' : 'General',
        tagsList: 'Vrindavan, Banke Bihari Temple, Family Hotel',
        author: settings?.hotelName || 'Hotel Team',
        seoTitle: '',
        metaDescription: '',
        focusKeyword: '',
        canonicalUrl: `${domain}/`,
        canonicalOverride: false,
        featuredImage: settings?.defaultOgImage || '',
        featuredImageAlt: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        isIndexed: true,
        faqs: [
          {
            question: `How far is ${settings?.hotelName || '[naam]'} from Banke Bihari Temple?`,
            answer: `We are located at ${settings?.address || '[full address]'}, just ${
              settings?.distanceFromBankeBihari || '[e.g. 600 m]'
            } from Banke Bihari Temple.`,
          },
        ],
        landmarkName: '',
        distanceFromHotel: settings?.distanceFromBankeBihari || '[e.g. 600 m]',
        status: 'published',
        publishedAt: new Date().toISOString().slice(0, 10),
      });
    }
  }

  // Compute live self-canonical URL for the Page Editor
  const computedPageCanonical = useMemo(() => {
    if (!editingPage) return '';
    if (editingPage.canonicalOverride && editingPage.canonicalUrl) {
      return editingPage.canonicalUrl;
    }
    const cleanSlug =
      editingPage.slug === 'home'
        ? ''
        : editingPage.type === 'blog'
        ? `blog/${editingPage.slug || 'post-slug'}`
        : editingPage.slug || 'page-slug';
    return cleanSlug ? `${domain}/${cleanSlug}/` : `${domain}/`;
  }, [editingPage, domain]);

  async function savePage(e) {
    e.preventDefault();
    if (!editingPage) return;
    setSaving(true);
    try {
      const payload = {
        ...editingPage,
        canonicalUrl: computedPageCanonical,
        tags: editingPage.tagsList
          ? editingPage.tagsList
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      const isEdit = Boolean(editingPage.id);
      const url = isEdit ? `/api/pages/${editingPage.id}/` : '/api/pages/';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      if (isEdit) {
        setPages(pages.map((p) => (p.id === data.page.id ? data.page : p)));
      } else {
        setPages([data.page, ...pages]);
      }

      if (data.autoRedirectCreated) {
        const redRes = await fetch('/api/redirects/');
        const redData = await redRes.json();
        if (redData.redirects) setRedirects(redData.redirects);
        notify(
          `Saved! Auto 301 Redirect created: ${data.autoRedirectCreated.fromPath} → ${data.autoRedirectCreated.toPath} & IndexNow pinged!`
        );
      } else {
        notify('Saved & published! Sitemap updated & IndexNow notified.');
      }

      setEditingPage(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deletePage(id) {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    const res = await fetch(`/api/pages/${id}/`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Could not delete');
      return;
    }
    setPages(pages.filter((p) => p.id !== id));
    notify('Page deleted and removed from sitemap.');
  }

  // Open Room Editor
  function openRoomEditor(room = null) {
    if (room) {
      const parsedImages = safeParse(room.images, []);
      setEditingRoom({
        ...room,
        amenitiesText: safeParse(room.amenities, []).join(', '),
        imagesList:
          parsedImages.length > 0
            ? parsedImages
            : [{ url: room.featuredImage || '', alt: room.featuredImageAlt || room.name }],
        faqs: safeParse(room.faqs, []),
      });
    } else {
      setEditingRoom({
        id: null,
        name: '',
        slug: '',
        slugTouched: false,
        pricePlaceholder: '₹__',
        priceNumeric: 0,
        capacity: 2,
        bedType: '1 King Bed',
        roomSize: '[Room Size sq ft]',
        shortDescription: '',
        description: '<h2>Room Overview</h2>\n<p>Describe this room...</p>',
        amenitiesText: 'Air Conditioning, Free Wi-Fi, 24x7 Hot Water, LED TV, Room Service',
        imagesList: [
          {
            url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
            alt: 'Room at Hotel in Vrindavan',
          },
        ],
        featured: true,
        isPublished: true,
        sortOrder: rooms.length + 1,
        seoTitle: '',
        metaDescription: '',
        focusKeyword: '',
        canonicalUrl: `${domain}/rooms/new-room/`,
        canonicalOverride: false,
        featuredImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
        featuredImageAlt: 'Clean AC Room in Vrindavan',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        isIndexed: true,
        faqs: [
          {
            question: 'What is the tariff for this room?',
            answer: 'The room tariff is ₹__ per night. Book directly to save 10%.',
          },
        ],
      });
    }
  }

  const computedRoomCanonical = useMemo(() => {
    if (!editingRoom) return '';
    if (editingRoom.canonicalOverride && editingRoom.canonicalUrl) {
      return editingRoom.canonicalUrl;
    }
    return `${domain}/rooms/${editingRoom.slug || 'room-slug'}/`;
  }, [editingRoom, domain]);

  async function saveRoom(e) {
    e.preventDefault();
    if (!editingRoom) return;
    setSaving(true);
    try {
      const payload = {
        ...editingRoom,
        canonicalUrl: computedRoomCanonical,
        amenities: editingRoom.amenitiesText
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
        images: editingRoom.imagesList.filter((i) => i.url && i.url.trim()),
      };
      const isEdit = Boolean(editingRoom.id);
      const res = await fetch(isEdit ? `/api/rooms/${editingRoom.id}/` : '/api/rooms/', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save room');

      if (isEdit) {
        setRooms(rooms.map((r) => (r.id === data.room.id ? data.room : r)));
      } else {
        setRooms([...rooms, data.room]);
      }
      setEditingRoom(null);
      notify('Room saved! Schema & Sitemap updated automatically.');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteRoom(id) {
    if (!window.confirm('Delete this room?')) return;
    const res = await fetch(`/api/rooms/${id}/`, { method: 'DELETE' });
    if (res.ok) {
      setRooms(rooms.filter((r) => r.id !== id));
      notify('Room deleted.');
    }
  }

  // Enquiries actions & CSV Export
  async function updateEnquiryStatus(id, status) {
    const res = await fetch('/api/enquiries/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (res.ok) {
      setEnquiries(enquiries.map((e) => (e.id === id ? data.enquiry : e)));
      notify(`Enquiry marked as ${status}`);
    }
  }

  function exportEnquiriesCsv() {
    const headers = [
      'ID',
      'Date',
      'Guest Name',
      'Phone',
      'Email',
      'CheckIn',
      'CheckOut',
      'Guests',
      'RoomType',
      'Type',
      'Status',
      'Message',
    ];
    const rows = filteredEnquiries.map((e) => [
      e.id,
      new Date(e.createdAt).toLocaleDateString('en-IN'),
      `"${(e.name || '').replace(/"/g, '""')}"`,
      `"${(e.phone || '').replace(/"/g, '""')}"`,
      `"${(e.email || '').replace(/"/g, '""')}"`,
      `"${e.checkIn || ''}"`,
      `"${e.checkOut || ''}"`,
      `"${e.guests || ''}"`,
      `"${e.roomType || ''}"`,
      `"${e.enquiryType || ''}"`,
      e.status,
      `"${(e.message || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hotel-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      if (enquiryFilter !== 'All' && e.status !== enquiryFilter) return false;
      if (enquirySearch.trim()) {
        const q = enquirySearch.toLowerCase();
        return (
          (e.name || '').toLowerCase().includes(q) ||
          (e.phone || '').toLowerCase().includes(q) ||
          (e.roomType || '').toLowerCase().includes(q) ||
          (e.message || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [enquiries, enquiryFilter, enquirySearch]);

  // Client-side WebP conversion & upload for Media Library
  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      // Compress and convert image to WebP in browser canvas before uploading
      const bitmap = await createImageBitmap(file);
      const maxDim = 1600;
      let width = bitmap.width;
      let height = bitmap.height;
      if (width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0, width, height);

      const webpBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/webp', 0.82)
      );

      const formData = new FormData();
      const baseName = file.name.replace(/\.[^.]+$/, '');
      formData.append('file', webpBlob, `${baseName}.webp`);
      formData.append('altText', mediaAlt || baseName);

      const res = await fetch('/api/media/', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setMedia([data.media, ...media]);
      setMediaAlt('');
      notify('Photo auto-compressed to WebP & saved to Media Library!');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddExternalMedia(e) {
    e.preventDefault();
    if (!mediaUrlInput.trim()) return;
    const res = await fetch('/api/media/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: mediaUrlInput.trim(),
        altText: mediaAlt || 'Hotel Photo Vrindavan',
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMedia([data.media, ...media]);
      setMediaUrlInput('');
      setMediaAlt('');
      notify('Image added to Media Library!');
    }
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');
      setSettings(data.settings);
      notify('Site Settings saved! All pages, schemas & robots.txt updated.');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddRedirect(e) {
    e.preventDefault();
    const res = await fetch('/api/redirects/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromPath, toPath }),
    });
    const data = await res.json();
    if (res.ok) {
      setRedirects([
        data.redirect,
        ...redirects.filter((r) => r.id !== data.redirect.id),
      ]);
      setFromPath('');
      setToPath('');
      notify('301 Redirect added!');
    } else {
      alert(data.error || 'Failed to add redirect');
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    const res = await fetch('/api/auth/password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword, newEmail }),
    });
    const data = await res.json();
    if (res.ok) {
      setCurrentPassword('');
      setNewPassword('');
      notify('Password updated successfully!');
    } else {
      alert(data.error || 'Could not update password');
    }
  }

  async function triggerIndexNow(urlToPing) {
    await fetch('/api/backup/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: [urlToPing] }),
    });
    setGscModalUrl(urlToPing);
  }

  const navItems = [
    { id: 'overview', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'pages', label: '2. Pages & Locations', icon: FileText },
    { id: 'rooms', label: '3. Rooms & Prices', icon: BedDouble },
    { id: 'blog', label: '4. Blog Manager', icon: BookOpen },
    {
      id: 'enquiries',
      label: `5. Leads / Enquiries (${enquiries.filter((e) => e.status === 'New').length})`,
      icon: MessageSquare,
    },
    { id: 'settings', label: '6. Hotel & SEO Settings', icon: Settings },
    { id: 'media', label: '7. Media / Photos (WebP)', icon: ImageIcon },
    { id: 'redirects', label: '8. 301 Redirects', icon: ArrowRightLeft },
    { id: 'account', label: '9. Password & Backup', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-brand-950 text-white shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
                Zero-Code Admin
              </span>
              <h1 className="text-lg font-serif font-bold text-white truncate">
                {settings?.hotelName || '[naam]'}
              </h1>
            </div>
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-600 text-xs font-semibold flex items-center gap-1"
            >
              View Site <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <nav className="p-3 space-y-1 flex lg:flex-col overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setEditingPage(null);
                    setEditingRoom(null);
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition w-full text-left ${
                    active
                      ? 'bg-brand-700 text-white shadow'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 hidden lg:block">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-red-600 text-sm font-semibold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {toast && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-800 text-white font-medium shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <span>{toast}</span>
            </div>
            <button onClick={() => setToast('')} className="text-xs underline">
              Close
            </button>
          </div>
        )}

        {/* Request Indexing Modal */}
        {gscModalUrl && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                IndexNow Pinged + Google Search Console Steps
              </h3>
              <p className="text-sm text-stone-600">
                <strong>Automatic Done:</strong> Bing, Yandex &amp; IndexNow engines have been notified automatically!
              </p>
              <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-xs space-y-2 text-stone-800">
                <div className="font-bold text-brand-900">
                  How to Request Instant Google Indexing (30 Seconds):
                </div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Copy this page URL below.</li>
                  <li>Open <strong>Google Search Console</strong>.</li>
                  <li>Paste the URL in the top search bar (<strong>&ldquo;Inspect any URL&rdquo;</strong>).</li>
                  <li>Click <strong>&ldquo;Request Indexing&rdquo;</strong>.</li>
                </ol>
              </div>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={gscModalUrl}
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-xs bg-stone-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(gscModalUrl);
                    notify('URL copied!');
                  }}
                  className="px-3 py-2 rounded-lg bg-brand-700 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-brand-700 text-white text-sm font-semibold"
                >
                  Open Google Search Console
                </a>
                <button
                  type="button"
                  onClick={() => setGscModalUrl('')}
                  className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 text-sm font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  Radhe Radhe! Welcome to Your Hotel Admin Panel
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  Edit your hotel details, rooms, pages, FAQs, and bookings as easily as Microsoft Word. All Technical SEO happens automatically!
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setActiveTab('pages');
                    openPageEditor(null, 'page');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" /> New Page
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-sm font-semibold"
                >
                  Edit Hotel Details ([naam])
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="text-xs font-bold uppercase text-stone-400">
                  New Booking Enquiries
                </div>
                <div className="text-3xl font-bold text-brand-700 mt-1">
                  {enquiries.filter((e) => e.status === 'New').length}
                </div>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs text-brand-700 font-semibold mt-2 underline"
                >
                  View all {enquiries.length} leads →
                </button>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="text-xs font-bold uppercase text-stone-400">
                  Published Rooms
                </div>
                <div className="text-3xl font-bold text-stone-900 mt-1">
                  {rooms.length}
                </div>
                <button
                  onClick={() => setActiveTab('rooms')}
                  className="text-xs text-brand-700 font-semibold mt-2 underline"
                >
                  Manage rooms &amp; prices →
                </button>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="text-xs font-bold uppercase text-stone-400">
                  Pages &amp; Location Guides
                </div>
                <div className="text-3xl font-bold text-stone-900 mt-1">
                  {pages.filter((p) => p.type !== 'blog').length}
                </div>
                <button
                  onClick={() => setActiveTab('pages')}
                  className="text-xs text-brand-700 font-semibold mt-2 underline"
                >
                  Edit pages &amp; FAQs →
                </button>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="text-xs font-bold uppercase text-stone-400">
                  Live SEO &amp; AI Endpoints
                </div>
                <div className="flex flex-col gap-1 mt-2 text-xs font-medium text-brand-700">
                  <a href="/sitemap.xml" target="_blank" className="underline">
                    ✓ /sitemap.xml (Dynamic)
                  </a>
                  <a href="/robots.txt" target="_blank" className="underline">
                    ✓ /robots.txt (AI Ready)
                  </a>
                  <a href="/llms.txt" target="_blank" className="underline">
                    ✓ /llms.txt (ChatGPT/Claude)
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2 & TAB 4: PAGES / LOCATION PAGES / BLOG MANAGER */}
        {(activeTab === 'pages' || activeTab === 'blog') && (
          <div className="space-y-6">
            {!editingPage ? (
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-stone-900">
                      {activeTab === 'blog'
                        ? 'Blog Posts Manager'
                        : 'Pages & Temple Location Pages Manager'}
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Every published page automatically gets a self-canonical URL, JSON-LD Schema, and appears in /sitemap.xml.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {activeTab === 'pages' ? (
                      <>
                        <button
                          onClick={() => openPageEditor(null, 'page')}
                          className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add Standard Page
                        </button>
                        <button
                          onClick={() => openPageEditor(null, 'location')}
                          className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add Location Page (e.g. Near Temple)
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => openPageEditor(null, 'blog')}
                        className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" /> Write New Blog Post
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-stone-200 mt-4">
                  {pages
                    .filter((p) =>
                      activeTab === 'blog' ? p.type === 'blog' : p.type !== 'blog'
                    )
                    .map((p) => {
                      const publicPath =
                        p.slug === 'home'
                          ? '/'
                          : p.type === 'blog'
                          ? `/blog/${p.slug}/`
                          : `/${p.slug}/`;
                      return (
                        <div
                          key={p.id}
                          className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-stone-900">
                                {p.title}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-50 text-brand-800 uppercase">
                                {p.type}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  p.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {p.status}
                              </span>
                              {!p.isIndexed && (
                                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-700">
                                  noindex
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-stone-500 mt-1">
                              Canonical:{' '}
                              <code className="text-stone-700">{p.canonicalUrl}</code> •{' '}
                              FAQs: {safeParse(p.faqs, []).length}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() =>
                                triggerIndexNow(`${domain}${publicPath}`)
                              }
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 border border-emerald-200"
                            >
                              <Send className="w-3.5 h-3.5" /> Request Indexing
                            </button>
                            <Link
                              href={publicPath}
                              target="_blank"
                              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1"
                            >
                              View <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => openPageEditor(p)}
                              className="px-3 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            {p.slug !== 'home' && (
                              <button
                                onClick={() => deletePage(p.id)}
                                className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              /* VISUAL PAGE / BLOG EDITOR + LIVE SEO CHECKLIST */
              <form
                onSubmit={savePage}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
              >
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                    <h3 className="text-xl font-serif font-bold text-stone-900">
                      {editingPage.id ? `Editing: ${editingPage.title}` : 'Create New Page / Post'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingPage(null)}
                      className="text-sm text-stone-500 hover:text-stone-800 font-semibold"
                    >
                      ← Back to List
                    </button>
                  </div>

                  {/* Page Title (H1) & Auto Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                        Page Title (Main H1 Heading shown on page) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingPage.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingPage((prev) => ({
                            ...prev,
                            title: val,
                            slug:
                              !prev.id && !prev.slugTouched
                                ? slugifyClient(val)
                                : prev.slug,
                          }));
                        }}
                        placeholder="e.g. Best Family Hotel Near Banke Bihari Temple"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-base font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                        URL Slug (Changing slug auto-creates 301 Redirect)
                      </label>
                      <input
                        type="text"
                        disabled={editingPage.slug === 'home'}
                        value={editingPage.slug}
                        onChange={(e) =>
                          setEditingPage({
                            ...editingPage,
                            slug: slugifyClient(e.target.value),
                            slugTouched: true,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-stone-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                        Status &amp; Publishing
                      </label>
                      <select
                        value={editingPage.status}
                        onChange={(e) =>
                          setEditingPage({ ...editingPage, status: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                      >
                        <option value="published">Published (Live &amp; in Sitemap)</option>
                        <option value="draft">Draft (Hidden from Public &amp; Sitemap)</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>
                  </div>

                  {/* Blog / Location Specific Fields */}
                  {editingPage.type === 'blog' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-brand-50/50 border border-brand-100">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={editingPage.category || ''}
                          onChange={(e) =>
                            setEditingPage({ ...editingPage, category: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editingPage.tagsList || ''}
                          onChange={(e) =>
                            setEditingPage({ ...editingPage, tagsList: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Publish Date
                        </label>
                        <input
                          type="date"
                          value={(editingPage.publishedAt || '').slice(0, 10)}
                          onChange={(e) =>
                            setEditingPage({
                              ...editingPage,
                              publishedAt: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Word-like Rich Text Editor */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-2">
                      Page Content (Visual Word-Like Editor)
                    </label>
                    <RichTextEditor
                      value={editingPage.content}
                      onChange={(html) =>
                        setEditingPage({ ...editingPage, content: html })
                      }
                    />
                  </div>

                  {/* Unlimited FAQs Builder */}
                  <div className="pt-4 border-t border-stone-200">
                    <FaqBuilder
                      faqs={editingPage.faqs}
                      onChange={(nextFaqs) =>
                        setEditingPage({ ...editingPage, faqs: nextFaqs })
                      }
                    />
                  </div>

                  {/* Complete Technical SEO Panel */}
                  <div className="pt-6 border-t border-stone-200 space-y-4">
                    <h4 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-700" />
                      Search Engine Optimization (SEO) &amp; Self-Canonical Settings
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Focus Keyword (Main phrase people search on Google)
                        </label>
                        <input
                          type="text"
                          value={editingPage.focusKeyword || ''}
                          onChange={(e) =>
                            setEditingPage({
                              ...editingPage,
                              focusKeyword: e.target.value,
                            })
                          }
                          placeholder="e.g. Hotel near Banke Bihari Temple"
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-5">
                        <input
                          type="checkbox"
                          id="isIndexedToggle"
                          checked={editingPage.isIndexed}
                          onChange={(e) =>
                            setEditingPage({
                              ...editingPage,
                              isIndexed: e.target.checked,
                            })
                          }
                          className="w-4 h-4 accent-brand-700"
                        />
                        <label
                          htmlFor="isIndexedToggle"
                          className="text-sm font-semibold text-stone-800"
                        >
                          Allow Google &amp; AI Bots to Index this Page (Index / Noindex)
                        </label>
                      </div>
                    </div>

                    {/* SEO Title with Live Counter */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-stone-700">SEO Title (Ideal under 60 chars)</span>
                        <span
                          className={
                            (editingPage.seoTitle || '').length > 60
                              ? 'text-red-600 font-bold'
                              : 'text-emerald-700'
                          }
                        >
                          {(editingPage.seoTitle || '').length} / 60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={editingPage.seoTitle || ''}
                        onChange={(e) =>
                          setEditingPage({ ...editingPage, seoTitle: e.target.value })
                        }
                        placeholder="Leave blank to auto-generate from Page Title"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>

                    {/* Meta Description with Live Counter */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-stone-700">
                          Meta Description (Ideal under 155 chars)
                        </span>
                        <span
                          className={
                            (editingPage.metaDescription || '').length > 155
                              ? 'text-red-600 font-bold'
                              : 'text-emerald-700'
                          }
                        >
                          {(editingPage.metaDescription || '').length} / 155 chars
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={editingPage.metaDescription || ''}
                        onChange={(e) =>
                          setEditingPage({
                            ...editingPage,
                            metaDescription: e.target.value,
                          })
                        }
                        placeholder="1–2 sentence summary inviting devotees to book direct & save 10%"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>

                    {/* SELF-REFERENCING CANONICAL (Pre-filled & Locked by default + Override toggle) */}
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase text-stone-700 flex items-center gap-1.5">
                          {editingPage.canonicalOverride ? (
                            <Unlock className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-emerald-700" />
                          )}
                          Self-Referencing Canonical URL (Auto-Filled &amp; Locked)
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingPage({
                              ...editingPage,
                              canonicalOverride: !editingPage.canonicalOverride,
                            })
                          }
                          className="text-xs font-semibold text-brand-700 underline"
                        >
                          {editingPage.canonicalOverride
                            ? 'Lock to Auto Self-Canonical'
                            : 'Advanced: Override Canonical'}
                        </button>
                      </div>
                      <input
                        type="text"
                        readOnly={!editingPage.canonicalOverride}
                        value={computedPageCanonical}
                        onChange={(e) =>
                          setEditingPage({
                            ...editingPage,
                            canonicalUrl: e.target.value,
                          })
                        }
                        className={`w-full px-3.5 py-2 rounded-lg border text-sm font-mono ${
                          editingPage.canonicalOverride
                            ? 'bg-white border-amber-400'
                            : 'bg-stone-100 border-stone-300 text-stone-600 cursor-not-allowed'
                        }`}
                      />
                    </div>

                    {/* Featured Image + Alt Text + Open Graph */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Featured Image URL (Also used for WhatsApp/Facebook Share)
                        </label>
                        <input
                          type="text"
                          value={editingPage.featuredImage || ''}
                          onChange={(e) =>
                            setEditingPage({
                              ...editingPage,
                              featuredImage: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Featured Image Alt Text (Describe photo for Google Images) *
                        </label>
                        <input
                          type="text"
                          value={editingPage.featuredImageAlt || ''}
                          onChange={(e) =>
                            setEditingPage({
                              ...editingPage,
                              featuredImageAlt: e.target.value,
                            })
                          }
                          placeholder="e.g. Clean Deluxe Room at [naam] Vrindavan"
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setEditingPage(null)}
                      className="px-5 py-2.5 rounded-xl bg-stone-200 text-stone-800 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold shadow-lg"
                    >
                      {saving ? 'Saving...' : 'Save & Publish Page'}
                    </button>
                  </div>
                </div>

                {/* Live SEO Score Checklist Sidebar */}
                <div>
                  <SeoChecklist
                    h1Title={editingPage.title}
                    seoTitle={editingPage.seoTitle}
                    metaDescription={editingPage.metaDescription}
                    focusKeyword={editingPage.focusKeyword}
                    featuredImage={editingPage.featuredImage}
                    featuredImageAlt={editingPage.featuredImageAlt}
                    faqs={editingPage.faqs}
                    canonicalUrl={computedPageCanonical}
                  />
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: ROOMS MANAGER */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            {!editingRoom ? (
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-stone-900">
                      Hotel Rooms Manager (Deluxe, Family, Suite)
                    </h2>
                    <p className="text-xs text-stone-500">
                      Update tariffs (currently set to ₹__ placeholders), photos, amenities, and room FAQs.
                    </p>
                  </div>
                  <button
                    onClick={() => openRoomEditor(null)}
                    className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add New Room
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 flex flex-col justify-between"
                    >
                      <div>
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif font-bold text-lg text-stone-900">
                              {room.name}
                            </h3>
                            <span className="px-2.5 py-1 rounded-lg bg-brand-100 text-brand-800 font-bold text-sm">
                              {room.priceNumeric > 0
                                ? `₹${room.priceNumeric}`
                                : room.pricePlaceholder}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                            {room.shortDescription}
                          </p>
                          <div className="text-[11px] text-stone-500 mt-2">
                            URL: <code>/rooms/{room.slug}/</code> • Capacity: {room.capacity} Guests
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between">
                        <Link
                          href={`/rooms/${room.slug}/`}
                          target="_blank"
                          className="text-xs text-stone-600 hover:text-brand-700 font-semibold flex items-center gap-1"
                        >
                          View Room <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openRoomEditor(room)}
                            className="px-3 py-1.5 rounded-lg bg-brand-700 text-white text-xs font-semibold"
                          >
                            Edit Room &amp; Price
                          </button>
                          <button
                            onClick={() => deleteRoom(room.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form
                onSubmit={saveRoom}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
              >
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                    <h3 className="text-xl font-serif font-bold text-stone-900">
                      {editingRoom.id ? `Edit Room: ${editingRoom.name}` : 'Add New Room'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingRoom(null)}
                      className="text-sm text-stone-500 font-semibold"
                    >
                      ← Back to Rooms
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                        Room Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingRoom.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingRoom((prev) => ({
                            ...prev,
                            name: val,
                            slug:
                              !prev.id && !prev.slugTouched
                                ? slugifyClient(val)
                                : prev.slug,
                          }));
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                        Display Tariff (e.g. ₹__ or ₹2,499)
                      </label>
                      <input
                        type="text"
                        value={editingRoom.pricePlaceholder}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            pricePlaceholder: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                        Numeric Price in INR (0 = use placeholder)
                      </label>
                      <input
                        type="number"
                        value={editingRoom.priceNumeric}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            priceNumeric: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Room URL Slug
                      </label>
                      <input
                        type="text"
                        value={editingRoom.slug}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            slug: slugifyClient(e.target.value),
                            slugTouched: true,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-stone-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Max Guests Capacity
                      </label>
                      <input
                        type="number"
                        value={editingRoom.capacity}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            capacity: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Bed Configuration
                      </label>
                      <input
                        type="text"
                        value={editingRoom.bedType}
                        onChange={(e) =>
                          setEditingRoom({ ...editingRoom, bedType: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Room Amenities (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingRoom.amenitiesText}
                      onChange={(e) =>
                        setEditingRoom({
                          ...editingRoom,
                          amenitiesText: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-2">
                      Room Detailed Description
                    </label>
                    <RichTextEditor
                      value={editingRoom.description}
                      onChange={(html) =>
                        setEditingRoom({ ...editingRoom, description: html })
                      }
                    />
                  </div>

                  <FaqBuilder
                    faqs={editingRoom.faqs}
                    onChange={(nextFaqs) =>
                      setEditingRoom({ ...editingRoom, faqs: nextFaqs })
                    }
                  />

                  <div className="pt-4 border-t border-stone-200 space-y-3">
                    <h4 className="font-serif font-bold text-stone-900">
                      Room SEO &amp; Self-Canonical URL
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          SEO Title ({(editingRoom.seoTitle || '').length}/60)
                        </label>
                        <input
                          type="text"
                          value={editingRoom.seoTitle || ''}
                          onChange={(e) =>
                            setEditingRoom({ ...editingRoom, seoTitle: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Focus Keyword
                        </label>
                        <input
                          type="text"
                          value={editingRoom.focusKeyword || ''}
                          onChange={(e) =>
                            setEditingRoom({
                              ...editingRoom,
                              focusKeyword: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Meta Description ({(editingRoom.metaDescription || '').length}/155)
                      </label>
                      <textarea
                        rows={2}
                        value={editingRoom.metaDescription || ''}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            metaDescription: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingRoom(null)}
                      className="px-5 py-2.5 rounded-xl bg-stone-200 text-stone-800 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-semibold"
                    >
                      {saving ? 'Saving...' : 'Save Room'}
                    </button>
                  </div>
                </div>

                <div>
                  <SeoChecklist
                    h1Title={editingRoom.name}
                    seoTitle={editingRoom.seoTitle}
                    metaDescription={editingRoom.metaDescription}
                    focusKeyword={editingRoom.focusKeyword}
                    featuredImage={editingRoom.featuredImage}
                    featuredImageAlt={editingRoom.featuredImageAlt}
                    faqs={editingRoom.faqs}
                    canonicalUrl={computedRoomCanonical}
                  />
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 5: LEADS / ENQUIRIES DASHBOARD */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Guest Booking Enquiries &amp; Leads
                </h2>
                <p className="text-xs text-stone-500">
                  Track every guest inquiry, mark status as New / Contacted / Booked, or export to Excel CSV.
                </p>
              </div>
              <button
                onClick={exportEnquiriesCsv}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 self-start"
              >
                <Download className="w-4 h-4" /> Export Leads to CSV (Excel)
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {['All', 'New', 'Contacted', 'Booked', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
                      enquiryFilter === st
                        ? 'bg-brand-700 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  placeholder="Search name, phone, room..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-sm">
                No enquiries match your filter yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 text-xs uppercase text-stone-500">
                      <th className="py-3 px-3">Guest</th>
                      <th className="py-3 px-3">Dates &amp; Guests</th>
                      <th className="py-3 px-3">Room / Type</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredEnquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-stone-50">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-stone-900">{enq.name}</div>
                          <a
                            href={`tel:${enq.phone}`}
                            className="text-xs text-brand-700 font-medium underline"
                          >
                            {enq.phone}
                          </a>
                          <div className="text-[11px] text-stone-400">
                            {new Date(enq.createdAt).toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-xs text-stone-700">
                          <div>
                            <strong>In:</strong> {enq.checkIn} • <strong>Out:</strong>{' '}
                            {enq.checkOut}
                          </div>
                          <div>{enq.guests}</div>
                        </td>
                        <td className="py-3 px-3 text-xs">
                          <div className="font-semibold text-stone-800">
                            {enq.roomType}
                          </div>
                          {enq.message && (
                            <div className="text-stone-500 mt-0.5 max-w-xs">
                              &ldquo;{enq.message}&rdquo;
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={enq.status}
                            onChange={(e) =>
                              updateEnquiryStatus(enq.id, e.target.value)
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              enq.status === 'New'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : enq.status === 'Booked'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-stone-100 text-stone-700 border-stone-300'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Booked">Booked</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <a
                            href={`https://wa.me/${(enq.phone || '').replace(
                              /[^\d]/g,
                              ''
                            )}?text=${encodeURIComponent(
                              `Radhe Radhe ${enq.name} Ji! Thank you for your booking enquiry at ${
                                settings?.hotelName || 'our hotel'
                              } for ${enq.checkIn}.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                          >
                            Reply on WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SITE SETTINGS & ROBOTS.TXT EDITOR */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveSettings}
            className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6"
          >
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Hotel Details, Contact Info &amp; Global SEO Settings
              </h2>
              <p className="text-xs text-stone-500">
                Replace the default [placeholders] below with your real hotel details anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Hotel Name ([naam])
                </label>
                <input
                  type="text"
                  value={settings.hotelName || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, hotelName: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Official Website Domain (with https://)
                </label>
                <input
                  type="text"
                  value={settings.domain || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, domain: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Phone Number (For Call Buttons)
                </label>
                <input
                  type="text"
                  value={settings.phone || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  WhatsApp Number (With Country Code e.g. 919876543210)
                </label>
                <input
                  type="text"
                  value={settings.whatsapp || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Hotel Email
                </label>
                <input
                  type="text"
                  value={settings.email || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Distance from Banke Bihari Temple
                </label>
                <input
                  type="text"
                  value={settings.distanceFromBankeBihari || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      distanceFromBankeBihari: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Full Hotel Address
                </label>
                <input
                  type="text"
                  value={settings.address || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Check-in Time
                </label>
                <input
                  type="text"
                  value={settings.checkInTime || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, checkInTime: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Check-out Time
                </label>
                <input
                  type="text"
                  value={settings.checkOutTime || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, checkOutTime: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Google Analytics ID (e.g. G-XXXXXXXXXX)
                </label>
                <input
                  type="text"
                  value={settings.googleAnalyticsId || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      googleAnalyticsId: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Google Search Console Verification Code
                </label>
                <input
                  type="text"
                  value={settings.searchConsoleCode || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      searchConsoleCode: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Google Business Profile Link (Maps / Reviews Link)
                </label>
                <input
                  type="text"
                  value={settings.googleBusinessUrl || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      googleBusinessUrl: e.target.value,
                    })
                  }
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                  Custom robots.txt Override (Leave blank to use automatic AI-friendly rules)
                </label>
                <textarea
                  rows={4}
                  value={settings.robotsTxtCustom || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, robotsTxtCustom: e.target.value })
                  }
                  placeholder="Leave blank to automatically allow Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot and block /admin & /api"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-sm shadow"
            >
              {saving ? 'Saving...' : 'Save All Hotel & SEO Settings'}
            </button>
          </form>
        )}

        {/* TAB 7: MEDIA LIBRARY (AUTO WEBP COMPRESSION) */}
        {activeTab === 'media' && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Media Library (Auto WebP Image Compression)
              </h2>
              <p className="text-xs text-stone-500">
                Upload any room or hotel photo from your phone or computer — it automatically converts to fast WebP format!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-stone-700">
                  Step 1: Describe Photo (SEO Alt Text)
                </label>
                <input
                  type="text"
                  value={mediaAlt}
                  onChange={(e) => setMediaAlt(e.target.value)}
                  placeholder="e.g. Deluxe Room Bed at [naam] Vrindavan"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                />
                <label className="block text-xs font-bold uppercase text-stone-700 pt-2">
                  Step 2: Choose Photo File (Auto-converts to WebP)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-sm"
                />
              </div>

              <form onSubmit={handleAddExternalMedia} className="space-y-2">
                <label className="block text-xs font-bold uppercase text-stone-700">
                  Or Add External Image URL
                </label>
                <input
                  type="url"
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-700 text-white text-xs font-semibold"
                >
                  Save Image URL
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-stone-200 overflow-hidden bg-stone-50 flex flex-col justify-between"
                >
                  <img
                    src={item.url}
                    alt={item.altText}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-2.5 space-y-1">
                    <div className="text-xs font-medium text-stone-800 truncate">
                      {item.altText}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(item.url);
                          notify('Image URL copied!');
                        }}
                        className="text-[11px] font-semibold text-brand-700 underline"
                      >
                        Copy URL
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch(`/api/media/?id=${item.id}`, {
                            method: 'DELETE',
                          });
                          setMedia(media.filter((m) => m.id !== item.id));
                        }}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: 301 REDIRECTS MANAGER */}
        {activeTab === 'redirects' && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                301 Redirects Manager (Old URL → New URL)
              </h2>
              <p className="text-xs text-stone-500">
                Redirects are created automatically whenever you rename a page slug, or you can add custom 301 redirects below.
              </p>
            </div>

            <form
              onSubmit={handleAddRedirect}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200"
            >
              <input
                type="text"
                required
                value={fromPath}
                onChange={(e) => setFromPath(e.target.value)}
                placeholder="Old Path (e.g. /old-room-page/)"
                className="px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-white"
              />
              <input
                type="text"
                required
                value={toPath}
                onChange={(e) => setToPath(e.target.value)}
                placeholder="New Path (e.g. /rooms/deluxe-room/)"
                className="px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-700 text-white text-sm font-semibold"
              >
                + Add 301 Redirect
              </button>
            </form>

            <div className="divide-y divide-stone-200">
              {redirects.map((r) => (
                <div
                  key={r.id}
                  className="py-3 flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="px-2 py-1 rounded bg-stone-100 text-stone-800">
                      {r.fromPath}
                    </code>
                    <span className="text-brand-700 font-bold">→ 301 →</span>
                    <code className="px-2 py-1 rounded bg-emerald-50 text-emerald-800">
                      {r.toPath}
                    </code>
                    {r.isAuto && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-brand-50 text-brand-800 font-semibold">
                        Auto-created on slug change
                      </span>
                    )}
                  </div>
                  <button
                    onClick={async () => {
                      await fetch(`/api/redirects/?id=${r.id}`, {
                        method: 'DELETE',
                      });
                      setRedirects(redirects.filter((x) => x.id !== r.id));
                    }}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: PASSWORD & FULL BACKUP */}
        {activeTab === 'account' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form
              onSubmit={handleChangePassword}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4"
            >
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Change Admin Password
              </h3>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  New Admin Email (optional)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin@vrindavanhotel.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  New Password (min 6 chars) *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-semibold"
              >
                Update Password
              </button>
            </form>

            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                1-Click Complete Website Backup
              </h3>
              <p className="text-sm text-stone-600">
                Download a complete copy of all your pages, blog posts, rooms, FAQs, settings, and customer booking enquiries in a single safe file.
              </p>
              <a
                href="/api/backup/"
                download
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow"
              >
                <Download className="w-4 h-4" /> Download Full Data Backup (.json)
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

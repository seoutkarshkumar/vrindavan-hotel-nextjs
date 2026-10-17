'use client';

import { useState } from 'react';
import { CheckCircle2, MessageCircle, Send } from 'lucide-react';

export default function BookingEnquiryForm({
  hotelName = '[naam]',
  defaultRoomType = 'Deluxe Room (₹__)',
  enquiryType = 'Room Booking',
  sourcePage = '/',
}) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    guests: '2 Adults',
    roomType: defaultRoomType,
    message: '',
    website_url_honeypot: '', // Hidden anti-bot honeypot
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          enquiryType,
          sourcePage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not submit enquiry.');
      } else {
        setSubmittedData(data);
      }
    } catch {
      setError('Network error. Please call or WhatsApp us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedData) {
    return (
      <div className="p-6 md:p-8 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-4 shadow-md">
        <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-emerald-950">
          Radhe Radhe! Thank You, {form.name} Ji!
        </h3>
        <p className="text-sm text-emerald-900 max-w-md mx-auto">
          Your booking enquiry for <strong>{hotelName}</strong> has been saved in our reservation desk. Our team will call/WhatsApp you shortly with your <strong>10% Direct Booking Discount</strong>!
        </p>
        {submittedData.whatsappNotificationUrl && (
          <div className="pt-2">
            <a
              href={submittedData.whatsappNotificationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg transition"
            >
              <MessageCircle className="w-5 h-5" /> Also Send Instant WhatsApp to Hotel Desk
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 md:p-8 border border-brand-100 shadow-xl space-y-4"
    >
      <div className="border-b border-stone-100 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
          Direct Reservation Desk (Save 10%)
        </span>
        <h3 className="text-xl font-serif font-bold text-stone-900">
          Quick Booking Enquiry – {hotelName}
        </h3>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Honeypot hidden field */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website_url_honeypot}
          onChange={(e) =>
            setForm({ ...form, website_url_honeypot: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Your Full Name *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Amit Sharma"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-brand-600 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Mobile / WhatsApp Number *
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="e.g. +91 98765 43210"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-brand-600 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Check-In Date
          </label>
          <input
            type="date"
            value={form.checkIn}
            onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-brand-600 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Check-Out Date
          </label>
          <input
            type="date"
            value={form.checkOut}
            onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-brand-600 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Number of Guests
          </label>
          <select
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
          >
            <option>1 Adult</option>
            <option>2 Adults</option>
            <option>2 Adults + 1 Child</option>
            <option>3–4 Family Members</option>
            <option>5–10 Guests (Multiple Rooms)</option>
            <option>10+ Yatra Group</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Preferred Room Type
          </label>
          <select
            value={form.roomType}
            onChange={(e) => setForm({ ...form, roomType: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
          >
            <option>Deluxe Room (₹__)</option>
            <option>Family Room (₹__)</option>
            <option>Royal Vrindavan Suite (₹__)</option>
            <option>Group / Multiple Rooms</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-700 mb-1">
          Special Request (Early check-in, parking, temple cab, etc.)
        </label>
        <textarea
          rows={2}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Any special requirements for your family..."
          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-brand-600 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 px-6 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-60"
      >
        <Send className="w-4 h-4" />
        {submitting
          ? 'Sending Enquiry...'
          : 'Send Booking Enquiry & Claim 10% Discount'}
      </button>
    </form>
  );
}

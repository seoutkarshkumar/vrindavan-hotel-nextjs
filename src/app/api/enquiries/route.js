import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi, checkRateLimit } from '@/lib/auth';
import { sanitizePlainText } from '@/lib/sanitize';

export async function GET(request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const q = (searchParams.get('q') || '').trim();

  const where = {};
  if (status && status !== 'All') where.status = status;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { phone: { contains: q } },
      { email: { contains: q } },
      { roomType: { contains: q } },
      { message: { contains: q } },
    ];
  }

  const enquiries = await prisma.enquiry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ enquiries });
}

export async function POST(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'guest-ip';

    // Rate limit enquiry submissions (max 10 per 15 mins per IP)
    const rate = checkRateLimit(`enquiry:${ip}`, 10, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please call or WhatsApp us directly.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot anti-spam field check (must be empty)
    if (body.website_url_honeypot && body.website_url_honeypot.trim() !== '') {
      return NextResponse.json({ ok: true, spamFiltered: true });
    }

    const name = sanitizePlainText(body.name || '');
    const phone = sanitizePlainText(body.phone || '');
    const email = sanitizePlainText(body.email || '');
    const checkIn = sanitizePlainText(body.checkIn || '');
    const checkOut = sanitizePlainText(body.checkOut || '');
    const guests = sanitizePlainText(body.guests || '2 Adults');
    const roomType = sanitizePlainText(body.roomType || 'Deluxe Room');
    const enquiryType = sanitizePlainText(body.enquiryType || 'Room Booking');
    const message = sanitizePlainText(body.message || '');
    const sourcePage = sanitizePlainText(body.sourcePage || '/');

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Please enter your Name and Mobile/WhatsApp Number.' },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        phone,
        email,
        checkIn: checkIn || 'Flexible',
        checkOut: checkOut || 'Flexible',
        guests,
        roomType,
        enquiryType,
        message,
        sourcePage,
        status: 'New',
      },
    });

    const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    const rawWa = (settings?.whatsapp || '').replace(/[^\d]/g, '');
    const waText = encodeURIComponent(
      `Radhe Radhe! New Booking Enquiry for ${settings?.hotelName || 'Hotel'}:\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• Dates: ${checkIn || 'Flexible'} to ${checkOut || 'Flexible'}\n` +
        `• Guests: ${guests}\n` +
        `• Room: ${roomType}\n` +
        (message ? `• Note: ${message}` : '')
    );

    const whatsappNotificationUrl = rawWa
      ? `https://wa.me/${rawWa}?text=${waText}`
      : `https://wa.me/?text=${waText}`;

    // Optional Email Notification via Resend API if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY && settings?.email && !settings.email.includes('[')) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Bookings <onboarding@resend.dev>',
            to: [settings.email],
            subject: `New Booking Enquiry from ${name} (${phone})`,
            html: `<h3>New Booking Enquiry - ${settings.hotelName}</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Check-in:</strong> ${checkIn}</p>
              <p><strong>Check-out:</strong> ${checkOut}</p>
              <p><strong>Guests:</strong> ${guests}</p>
              <p><strong>Room Type:</strong> ${roomType}</p>
              <p><strong>Message:</strong> ${message}</p>`,
          }),
        });
      } catch (e) {
        console.warn('Optional Resend email error:', e.message);
      }
    }

    return NextResponse.json({
      ok: true,
      enquiry,
      whatsappNotificationUrl,
    });
  } catch (error) {
    console.error('Enquiry POST error:', error);
    return NextResponse.json(
      { error: 'Could not save enquiry. Please call us directly.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, status, notes } = await request.json();
    const updated = await prisma.enquiry.update({
      where: { id: Number(id) },
      data: {
        ...(status ? { status: sanitizePlainText(status) } : {}),
        ...(notes !== undefined ? { notes: sanitizePlainText(notes) } : {}),
      },
    });
    return NextResponse.json({ enquiry: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  await prisma.enquiry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

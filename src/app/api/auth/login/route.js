import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  checkRateLimit,
  resetRateLimit,
  verifyPassword,
  hashPassword,
  createSessionToken,
  SESSION_COOKIE_NAME,
} from '@/lib/auth';

export async function POST(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'local-ip';

    // Rate Limit: max 5 attempts per 15 minutes per IP
    const rate = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please wait ${Math.ceil(
            rate.retryAfterSec / 60
          )} minutes and try again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please enter both Email and Password.' },
        { status: 400 }
      );
    }

    // Ensure default admin exists if DB was just initialized
    let admin = await prisma.adminUser.findUnique({ where: { email } });
    const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@vrindavanhotel.com').toLowerCase();
    const defaultPass = process.env.ADMIN_DEFAULT_PASSWORD || 'Vrindavan@123';

    if (!admin && email === defaultEmail) {
      const count = await prisma.adminUser.count();
      if (count === 0) {
        const passwordHash = await hashPassword(defaultPass);
        admin = await prisma.adminUser.create({
          data: {
            email: defaultEmail,
            name: 'Hotel Owner (Admin)',
            passwordHash,
          },
        });
      }
    }

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        {
          error: `Invalid email or password. (${rate.remaining} attempts left)`,
        },
        { status: 401 }
      );
    }

    // Reset rate limit on successful login
    resetRateLimit(`login:${ip}`);

    const token = await createSessionToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: 'admin',
    });

    const response = NextResponse.json({
      ok: true,
      user: { id: admin.id, email: admin.email, name: admin.name },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}

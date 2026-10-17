import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi, verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword, newEmail } = await request.json();

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: Number(session.id) },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found.' }, { status: 404 });
    }

    const valid = await verifyPassword(currentPassword, admin.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);
    const updated = await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        passwordHash,
        ...(newEmail && newEmail.trim() ? { email: newEmail.trim().toLowerCase() } : {}),
      },
    });

    return NextResponse.json({
      ok: true,
      message: 'Password updated successfully!',
      email: updated.email,
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Failed to update password.' },
      { status: 500 }
    );
  }
}

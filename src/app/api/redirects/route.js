import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth';

export async function GET() {
  const redirects = await prisma.redirect.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ redirects });
}

export async function POST(request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    let fromPath = (body.fromPath || '').trim();
    let toPath = (body.toPath || '').trim();

    if (!fromPath || !toPath) {
      return NextResponse.json(
        { error: 'Both Old URL and New URL are required.' },
        { status: 400 }
      );
    }

    if (!fromPath.startsWith('/')) fromPath = `/${fromPath}`;
    if (!fromPath.endsWith('/')) fromPath = `${fromPath}/`;
    if (!toPath.startsWith('/') && !toPath.startsWith('http')) toPath = `/${toPath}`;
    if (toPath.startsWith('/') && !toPath.endsWith('/')) toPath = `${toPath}/`;

    const redirect = await prisma.redirect.upsert({
      where: { fromPath },
      update: { toPath, statusCode: 301, isAuto: false },
      create: { fromPath, toPath, statusCode: 301, isAuto: false },
    });

    return NextResponse.json({ redirect });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  await prisma.redirect.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

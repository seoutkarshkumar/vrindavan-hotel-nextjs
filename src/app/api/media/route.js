import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth';
import { sanitizePlainText, slugify } from '@/lib/sanitize';

export async function GET() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ media });
}

export async function POST(request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const contentType = request.headers.get('content-type') || '';

    // Support both multipart file upload and external URL / client-compressed WebP data URL
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      const altText = sanitizePlainText(formData.get('altText') || '');

      if (!file) {
        return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const ext = file.name.toLowerCase().endsWith('.webp') ? '.webp' : path.extname(file.name) || '.webp';
      const baseName = slugify(path.basename(file.name, path.extname(file.name))) || 'hotel-photo';
      const filename = `${baseName}-${Date.now()}${ext}`;
      const filePath = path.join(uploadDir, filename);

      await fs.writeFile(filePath, buffer);
      const url = `/uploads/${filename}`;

      const item = await prisma.media.create({
        data: {
          filename,
          url,
          altText: altText || baseName.replace(/-/g, ' '),
          mimeType: file.type || 'image/webp',
          sizeBytes: buffer.length,
        },
      });

      return NextResponse.json({ media: item });
    } else {
      const body = await request.json();
      const url = (body.url || '').trim();
      const altText = sanitizePlainText(body.altText || 'Vrindavan Hotel Photo');
      const filename = sanitizePlainText(body.filename || 'external-image.webp');

      if (!url) {
        return NextResponse.json({ error: 'Image URL is required.' }, { status: 400 });
      }

      const item = await prisma.media.create({
        data: {
          filename,
          url,
          altText,
          mimeType: 'image/webp',
          sizeBytes: Number(body.sizeBytes) || 0,
        },
      });

      return NextResponse.json({ media: item });
    }
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Media item not found.' }, { status: 404 });
    }

    if (existing.url.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), 'public', existing.url);
      try {
        await fs.unlink(localPath);
      } catch {
        // Ignore if file already removed
      }
    }

    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

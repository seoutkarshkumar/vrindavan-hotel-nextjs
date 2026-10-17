import prisma from '@/lib/prisma';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hotel Admin Panel | Manage Pages, Rooms, SEO & Enquiries',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [settings, pages, rooms, enquiries, media, redirects] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.page.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.room.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }),
    prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.media.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.redirect.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <AdminDashboardClient
      initialSettings={settings}
      initialPages={pages}
      initialRooms={rooms}
      initialEnquiries={enquiries}
      initialMedia={media}
      initialRedirects={redirects}
    />
  );
}

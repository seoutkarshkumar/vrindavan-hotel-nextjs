import { Suspense } from 'react';
import AdminLoginClient from './AdminLoginClient';

export const metadata = {
  title: 'Admin Login | Hotel Management Panel',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-950 flex items-center justify-center text-white">Loading...</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}

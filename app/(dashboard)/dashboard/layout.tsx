import Header from '@/components/layout/dashboard/header';
import Sidebar from '@/components/layout/dashboard/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen">
        <Sidebar />
        <main className="w-full pt-16">{children}</main>
      </div>
    </>
  );
}

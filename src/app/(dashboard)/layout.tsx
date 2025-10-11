"use client";

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useAppSelector } from '@/app/redux';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar />
      <div 
        className="flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0"
        style={{
          marginLeft: isSidebarCollapsed ? '0' : '256px', // 256px = w-64
        }}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 w-full">
          <div className="max-w-[1800px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

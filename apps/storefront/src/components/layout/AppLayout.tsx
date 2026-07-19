import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1 w-full px-4 lg:px-16 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}

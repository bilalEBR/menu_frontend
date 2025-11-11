import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * This layout applies a simple, centered structure to all pages within the (auth) group,
 * such as /signup and /signin. It intentionally excludes the global Header and Footer.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 return (
    // 1. Main container takes full vertical height
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      {/* 2. HEADER Placement */}
      <Header />

      {/* 3. Centered Content Wrapper (grows to fill space) */}
      {/* This div replaces the old root and handles vertical centering */}
      <main className="min-h-screen bg-gray-50 pt-17">
        <div>
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> Added max-w-md for better form width */}
          {children} {/* Renders user component */}
        </div>
      </main>

      {/* 4. FOOTER Placement */}
      <Footer />
      
    </div>
  );
}

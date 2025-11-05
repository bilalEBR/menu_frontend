import React from 'react';

// This is also a Server Component.
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Gourmet Hotel. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-indigo-400">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400">Terms of Service</a>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">
          Powered by Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
};

export default Footer;

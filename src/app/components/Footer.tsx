import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              {/* Hotel Icon SVG */}
              <svg
                className="w-7 h-7 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m2 0h-5m-9 0h5m-5 0v-4a2 2 0 012-2h2a2 2 0 012 2v4M10 10h.01M14 10h.01M10 14h.01M14 14h.01"
                />
              </svg>
              <h2 className="text-2xl font-bold text-white">Gourmet Hotel</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              Experience fine dining and unparalleled comfort. Your trusted luxury hotel 
              for memorable stays and exceptional culinary experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/about" 
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/rooms" 
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link 
                  href="/dining" 
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Dining
                </Link>
              </li>
              <li>
                <Link 
                  href="/amenities" 
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Amenities
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/contact" 
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-gray-500">
          <p>&copy; {currentYear} Gourmet Hotel. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <p>Powered by Menu Management System</p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="hover:text-indigo-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="hover:text-indigo-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="hover:text-indigo-400 transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.24 14.815 3.75 13.664 3.75 12.367s.49-2.448 1.376-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.886.875 1.376 2.026 1.376 3.323s-.49 2.448-1.376 3.323c-.875.808-2.026 1.297-3.323 1.297z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
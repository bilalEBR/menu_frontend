
'use client';
import React, { useState } from 'react';

// --- TYPE DEFINITIONS ---

/**
 * Defines the props for all SVG icon components.
 * It extends standard SVG attributes to allow passing className, onClick, etc.
 */
interface IconProps extends React.SVGProps<SVGSVGElement> {}

/**
 * Defines the props for the custom Link component.
 * 'href' is explicitly typed as string (fixing the original error).
 */
interface LinkProps {
    href: string;
    className?: string;
    children: React.ReactNode;
}

// NOTE: Since the development environment does not support Next.js, 
// we use a standard anchor tag (<a>) for navigation.
const Link = ({ href, children, className }: LinkProps) => (
    <a href={href} className={className}>
        {children}
    </a>
);

// --- INLINE SVG ICONS (FIXED PROPS TYPE) ---

const GlobeIcon = (props: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);

const DollarSignIcon = (props: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

const BellIcon = (props: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
);

const MenuIcon = (props: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
);

const CloseIcon = (props: IconProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);


function Header() {
    // State to manage the visibility of the mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        // The header is fixed, uses a strong shadow, and is on a high z-index
        <header className="fixed top-0 left-0 w-full bg-white shadow-xl z-[1000] border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                
                {/* 1. Logo/Title Area - Adaptive Text */}
                <Link
                    href="/"
                    className="flex items-center space-x-2 text-xl md:text-2xl font-extrabold tracking-tight text-indigo-700 hover:text-indigo-600 transition duration-150 flex-shrink-0"
                >
                    {/* Hotel Icon SVG */}
                    <svg 
                        className="w-6 h-6 md:w-7 md:h-7" 
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
                    
                    {/* Logo Text - Uses a shorter version on small screens for better space management */}
                    <span className="hidden sm:inline">Hotel Menu System</span>
                    <span className="sm:hidden">H. Menu</span>
                </Link>
                
                <div className="flex items-center space-x-4">
                    
                    {/* 2. Desktop Navigation Links - Visible only on medium screens and up */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/hotels" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150 text-sm lg:text-base">
                            Hotels
                        </Link>
                        <Link href="/menu" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150 text-sm lg:text-base">
                            Support
                        </Link>
                        <Link href="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150 text-sm lg:text-base">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150 text-sm lg:text-base">
                            Contact
                        </Link>
                        <Link href="/signup" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150 text-sm lg:text-base">
                            Sign up
                        </Link>
                        {/* Highlighted Sign-in button */}
                        <Link href="/signin" className="text-white bg-indigo-600 hover:bg-indigo-700 font-bold transition duration-150 px-4 py-2 rounded-lg shadow-md text-sm lg:text-base">
                            Sign in
                        </Link>
                    </nav>

                    {/* 3. Utility Icons - Language, Currency, Notification */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        
                        {/* Language Icon */}
                        <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition duration-150 group" title="Change Language">
                            <GlobeIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        
                        {/* Currency Icon */}
                        <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition duration-150" title="Change Currency">
                            <DollarSignIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* Notification Icon */}
                        <button className="relative p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition duration-150" title="Notifications">
                            <BellIcon className="w-5 h-5 md:w-6 md:h-6" />
                            {/* Notification Dot */}
                            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                        </button>
                    </div>

                    {/* 4. Mobile Menu Toggle Button - Visible only on Mobile */}
                    <button 
                        className="md:hidden p-2 text-gray-700 hover:text-indigo-600 transition duration-150"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <CloseIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
                    </button>
                </div>
            </div>

            {/* 5. Mobile Menu Dropdown - Toggles based on state */}
            {isMenuOpen && (
                <nav className="md:hidden bg-white border-t border-gray-100 shadow-inner">
                    <div className="py-2 px-4 sm:px-6 space-y-1">
                        <Link href="/hotels" className="block text-gray-700 hover:bg-gray-50 hover:text-indigo-600 font-medium py-3 px-2 rounded-lg transition duration-150">
                            Hotels
                        </Link>
                        <Link href="/menu" className="block text-gray-700 hover:bg-gray-50 hover:text-indigo-600 font-medium py-3 px-2 rounded-lg transition duration-150">
                            Support
                        </Link>
                        <Link href="/about" className="block text-gray-700 hover:bg-gray-50 hover:text-indigo-600 font-medium py-3 px-2 rounded-lg transition duration-150">
                            About Us
                        </Link>
                        <Link href="/contact" className="block text-gray-700 hover:bg-gray-50 hover:text-indigo-600 font-medium py-3 px-2 rounded-lg transition duration-150">
                            Contact
                        </Link>
                        <Link href="/signup" className="block text-gray-700 hover:bg-gray-50 hover:text-indigo-600 font-medium py-3 px-2 rounded-lg transition duration-150">
                            Sign up
                        </Link>
                        <Link href="/signin" className="block text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 font-bold py-3 px-2 rounded-lg transition duration-150">
                            Sign in
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
}

export default Header;

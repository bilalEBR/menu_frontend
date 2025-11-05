"use client";

import React, { useEffect, useState, ReactNode } from 'react';
import AdminSidebar from '../components/admin/AdminSideBar';
import AdminHeader from '../components/admin/AdminHeader';

// API Configuration (Pulled from previous files)
const API_BASE_URL = 'http://localhost:8000/api'; 

// CRITICAL: Simulated router replacement for environment compatibility
// This simulates the router.push functionality for redirects.
const useRouter = () => {
    return {
        push: (path: string) => {
            console.log(`Navigation requested to: ${path}. (Simulated router.push)`);
            // In a real browser environment, this would redirect the user.
            window.location.href = path;
        }
    }
}

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string; 
}

interface AdminLayoutContentProps {
    children: ReactNode;
}

// ----------------------------------------------------------------------
// 1. Authorization Component (Handles all client-side logic)
// ----------------------------------------------------------------------

function AdminLayoutContent({ children }: AdminLayoutContentProps) {
    const router = useRouter();
    const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        // 1. CLIENT-SIDE CHECK: Redirect if no token is found
        if (!token) {
            console.warn("Auth required: No token found. Redirecting to login.");
            router.push('/signin');
            return;
        }

        // 2. SERVER-SIDE TOKEN VALIDATION AND ROLE CHECK
        const verifyTokenAndFetchUser = async () => {
            try {
                // Fetch the current authenticated user details
                const response = await fetch(`${API_BASE_URL}/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Attach the token
                        'Accept': 'application/json',
                    },
                });

                if (response.ok) {
                    const user: UserData = await response.json();

                    // 3. ROLE CHECK: Ensure the user is an admin
                    if (user.role === 'admin') {
                        setIsAuthenticatedAdmin(true);
                        console.log("Admin role confirmed. Accessing layout.");
                    } else {
                        // User is logged in but is NOT an admin
                        console.error("Access Denied: Not an administrator. Redirecting to user dashboard.");
                        router.push('/'); 
                    }
                } else if (response.status === 401) {
                    // Failure: Token is invalid or expired
                    console.error("Token verification failed (401 Unauthorized). Redirecting to login.");
                    localStorage.removeItem('auth_token');
                    router.push('/signin');
                } else {
                    // Other server errors
                    console.error("API Error during token verification. Redirecting to login.");
                    router.push('/signin'); 
                }
            } catch (err) {
                // Network errors
                console.error("Network error during token verification:", err);
            } finally {
                setIsLoading(false);
            }
        };

        verifyTokenAndFetchUser();
    }, [router]);

    // Handle Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
                <div className="text-3xl font-semibold text-green-600">
                    <svg className="animate-spin h-6 w-6 mr-3 inline text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authorizing Admin Access...
                </div>
            </div>
        );
    }
    
    // Safety check - if not an admin after loading, do not render content
    if (!isAuthenticatedAdmin) {
        return null;
    }

    return (
        
        // Layout structure from your request, styled for admin
     <div>
        <div className='fixed top-0 w-full'>
<AdminHeader/>
        </div>

        
        
        <div className="flex mt-16 min-h-screen bg-gray-100 dark:bg-gray-900">
            <AdminSidebar/>
  

            <div className="flex  flex-col flex-1">
                

                {/* Main Content Area */}
                <main id="main-content" className="flex-1 p-6 lg:p-8 overflow-y-auto bg-gray-100 dark:bg-gray-900">
                    {children} {/* The specific page content */}
                </main>
                
            </div>
        </div>
    </div>
    );
}


// ----------------------------------------------------------------------
// 2. Exported Layout Function (Matches next.js layout signature)
// ----------------------------------------------------------------------

interface AdminLayoutProps {
    children: ReactNode;
}

// NOTE: We cannot use the 'metadata' export here in this environment.

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        // This wrapper is needed to contain the client-side logic (useEffect/useState)
        <AdminLayoutContent>
            {children}
        </AdminLayoutContent>
    );
}

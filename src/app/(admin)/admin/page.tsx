"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SecureLogoutButton from '@/app/components/admin/SecureLogOutButton';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api'; 

// CRITICAL FIX: Simulated router replacement for environment compatibility 
// This ensures the component is runnable outside a full Next.js setup.
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
    role?: string; // Assuming your user model includes a role
}

// NOTE: Since this is the general dashboard, we assume any authenticated user can access it.
export default function DashboardPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    
    // localStorage.removeItem('auth_token');
    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        // 1. CLIENT-SIDE CHECK: Redirect if no token is found
        if (!token) {
            console.warn("Authentication required: No token found. Redirecting to login.");
            router.push('/login');
            return;
        } 


        // 2. SERVER-SIDE TOKEN VALIDATION (Verify token validity with Laravel)
        const verifyTokenAndFetchUser = async () => {
            try {
                // This fetches the current authenticated user details using the Sanctum token
                const response = await fetch(`${API_BASE_URL}/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // MANDATORY: Attach the token
                        'Accept': 'application/json',
                    },
                });

                if (response.ok) {
                    // Success: Token is valid, and user data is returned
                    const user: UserData = await response.json();
                    setUserData(user);
                    console.log("Token validated successfully. User data loaded.");
                } else if (response.status === 401) {
                    // Failure: Token is invalid or expired
                    console.error("Token verification failed (401 Unauthorized). Redirecting.");
                    localStorage.removeItem('auth_token'); // Clean up invalid token
                    router.push('/login');
                } else {
                    // Other server errors
                    const errorData = await response.json();
                    setError(errorData.message || 'An unexpected error occurred.');
                    router.push('/login');
                }
            } catch (err) {
                // Network errors
                console.error("Network error during token verification:", err);
                setError('Cannot connect to the backend API.');
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };



         verifyTokenAndFetchUser();
    }, [router]);

    // Handle Loading State
    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center bg-gray-100 p-8">
                <div className="text-xl font-semibold text-indigo-600">
                    <svg className="animate-spin h-6 w-6 mr-3 inline text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Dashboard...
                </div>
            </div>
        );
    }
    
    // Fallback if userData is somehow null after loading (shouldn't happen with the redirects above)
    if (!userData) {
        return (
            <div className="p-8 text-center text-red-600">
                Authentication failed. Please log in again.
            </div>
        );
    }

    // Display the dashboard content once authenticated and data is loaded
    const userName = userData.name || userData.email || 'User';

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-inter">
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Welcome Back, {userName}!
            </h1>
            
            <p className="text-gray-600 mb-8">
                This is your personalized control center for hotel and menu operations.
            </p>
            
            {/* Quick Stats/Actions Section (Example) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-xl shadow-xl border border-indigo-200 hover:shadow-2xl transition duration-300">
                    <h2 className="text-xl font-semibold mb-2 text-indigo-700">My Profile</h2>
                    <p className="text-gray-500 mb-4">View and update your personal information and settings.</p>
                    <Link href="/profile" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                        Go to Profile 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {/* Hotels Card */}
                <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300">
                    <h2 className="text-xl font-semibold mb-2 text-gray-700">My Hotels</h2>
                    <p className="text-gray-500 mb-4">Manage the hotels and their details associated with your account.</p>
                    <Link href="/hotels" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                        Manage Hotels
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
                
                {/* Feedback Card */}
                <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300">
                    <h2 className="text-xl font-semibold mb-2 text-gray-700">Feedback</h2>
                    <p className="text-gray-500 mb-4">Review customer feedback and manage ratings.</p>
                    <Link href="/feedback" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                        View Feedback 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

            </div>
            
            {/* Logout Action */}
            <div className="mt-10 pt-6 border-t border-gray-200">
                {/* <button
                    onClick={() => {
                        localStorage.removeItem('auth_token');
                        // Clear role if it was stored
                        router.push('/signin');
                    }}
                    className="py-2 px-6 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-200"
                >
                    Log Out
                </button> */}
               
            </div>
            {/* Display error if present (for API fetch issues) */}
            {error && (
                <div className="mt-4 p-4 text-sm text-red-700 bg-red-50 rounded-lg font-medium border border-red-200" role="alert">
                    Dashboard Error: {error}
                </div>
            )}
        </div>
    );
}

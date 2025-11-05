"use client";
import React, { useState } from 'react';

// NOTE: Set your actual API base URL here. 
// This should point to your Laravel backend's /api endpoint.
const API_BASE_URL = 'http://127.0.0.1:8000/api'; 

// Minimal router simulation for environment compatibility (adjust if using next/router)
const useRouter = () => ({
    // For a real app, replace this with router.push('/signin')
    push: (path: string) => {
        window.location.href = path; 
    }
});

/**
 * A drop-in replacement for your button that handles secure, server-side token revocation.
 * This deletes the token from the personal_access_tokens table in Laravel.
 */
export default function SecureLogoutButton() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        setError(null);
        setIsLoggingOut(true);
        
        // 1. Retrieve the stored token
        const token = localStorage.getItem('auth_token');
        
        // If there's no token, just clear and redirect immediately.
        if (!token) {
            localStorage.clear();
            router.push('/signin');
            return;
        }

        try {
            // 2. Call the protected Laravel logout endpoint to revoke the token
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // The Authorization header is what Laravel Sanctum uses to identify and revoke the token
                    'Authorization': `Bearer ${token}`, 
                },
            });

            // If the token was already invalid (401), we proceed to client-side cleanup anyway.
            if (!response.ok && response.status !== 401) {
                const data = await response.json();
                // Optionally show error message, but we clear client token regardless
                console.error('Server Logout Error:', data.message); 
            }
            
        } catch (err) {
            // Handle network errors gracefully
            console.error('Logout API Network Error:', err);
        } finally {
            // 3. Client-side Cleanup: MANDATORY step to clear local state
            localStorage.removeItem('auth_token');
            // Remove other user-specific data if stored (e.g., user role)
            localStorage.removeItem('user_role'); 

            // 4. Redirect the user to the sign-in page
            router.push('/signin'); 
            setIsLoggingOut(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            // Using your requested Tailwind styles
            className="py-2 px-6 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
        >
            {isLoggingOut ? 'Signing Off...' : 'Log Out'}
        </button>
    );
}

"use client";
import React, { useState, FormEvent } from 'react';
//  import { useRouter } from 'next/router';

// IMPORTANT: In a real-world Next.js application, you would import 
// { useRouter } from 'next/navigation' (App Router) or 'next/router' (Pages Router).
// This simulated hook is used to make the component runnable outside a full Next.js environment.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Replace with your actual backend API URL

// Simulated router for environment compatibility (addresses NextRouter not mounted error)
const useRouter = () => {
    return {
        push: (path: string) => {
            console.log(`Navigation requested to: ${path}. (Simulated Next.js router.push)`);
            // In a browser environment, you might use: window.location.pathname = path;
             window.location.href = path;
        }
    }
}

export default function SignInPage() {
    const router = useRouter(); 
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            // CRITICAL FIX: Handle case where response is HTML (e.g., from a Laravel redirect or 404 page)
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("API response was not JSON:", text.substring(0, 100) + "...");

                // Suggest the most common root causes of receiving HTML (<!DOCTYPE) instead of JSON
                setError(`API Error (HTTP ${response.status}): Received HTML instead of JSON. 
                This usually means the API route failed validation and redirected to a default web page, 
                or there is a CORS issue. Check your Laravel CORS configuration and API routes.`);
                return;
            }

            const data = await response.json();

            if (response.ok) {
                // SUCCESS: Store the access token and redirect
                const accessToken = data.access_token;
                console.log(accessToken);
                console.log(data.user);
                 
                // Security Note: Use HTTP-only cookies in production for better security!
                localStorage.setItem('auth_token', accessToken); 
                
                setEmail('');
                setPassword('');
                if(data.user.role === 'admin'){
                    router.push('/admin'); 
                }
               else{
                const errorMessage = '  Invalid credential';
                 setError(errorMessage);
               }

            } else {
                // FAILURE: Display error message from the backend JSON payload
                const errorMessage = data.message || 'Authentication failed. Please check your credentials.';
                setError(errorMessage);
            }

        } catch (err) {
            // NETWORK ERROR: Handle issues like server downtime or connection failure
            console.error('Login error:', err);
            setError('A network error occurred. Check if the backend server is running and the API_BASE_URL is correct.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
            <div className="max-w-md w-full mx-auto p-8 bg-white shadow-2xl rounded-xl mt-10 border border-gray-200">
                <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Welcome Back</h1>
                
                {/* Display error message if present */}
                {error && (
                    <div className="p-4 mb-6 text-sm  text-red-700 bg-red-50 rounded-lg font-medium border border-red-200" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            // Enhanced Tailwind styles for input
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // Enhanced Tailwind styles for input
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 transform hover:scale-[1.01]"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account? 
                    <button 
                        // Note: Uses the simulated router.push
                        onClick={() => router.push('/signup')}
                        className="font-semibold text-indigo-600 hover:text-indigo-800 ml-1 transition duration-150"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
}

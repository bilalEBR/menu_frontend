// Must be a Client Component to use hooks like useRouter and useSession
"use client";

import { useSession } from 'next-auth/react'; // ⬅️ ASSUMPTION: Using NextAuth.js (Auth.js)
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

// You would likely have a simple loading screen component
const LoadingSpinner = () => (
    <div className="flex h-screen items-center justify-center text-xl text-gray-600">
        Loading Session...
    </div>
);

interface AuthGuardProps {
  children: ReactNode;
  // Defines the role required to view the nested content (e.g., 'admin' for the admin layout)
  requiredRole: 'admin' | 'user' | 'public'; 
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 1. Skip checks while the session is still being loaded
    if (status === 'loading') {
      return; 
    }

    // --- Authentication Check (Is the user logged in?) ---
    if (status === 'unauthenticated') {
      // If not logged in, redirect to the sign-in page
      router.replace('/signin'); 
      return;
    }

    // --- Authorization Check (Does the user have the required role?) ---
    const userRole = session?.user?.role || 'public';
    
    // Check if the user's role does NOT match the required role for this route group
    if (userRole !== requiredRole) {
      console.warn(`Access Denied: User role '${userRole}' does not match required role '${requiredRole}'.`);
      
      // Redirect to a safe route, like the main dashboard or home page
      router.replace(userRole === 'user' ? '/dashboard' : '/'); 
    }

  }, [status, router, requiredRole, session]);


  // 1. Render a loading spinner while the session status is unknown
  // 2. Or, if the session is loaded, but the role doesn't match, keep showing loading state
  //    until the redirect from useEffect kicks in.
  const userHasRequiredRole = session?.user?.role === requiredRole;
  if (status === 'loading' || !userHasRequiredRole) {
    return <LoadingSpinner />;
  }
  
  // If the user is authenticated AND authorized, render the protected content
  return <>{children}</>;
}
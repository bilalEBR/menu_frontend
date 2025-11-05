// src/app/hotels/error.tsx
'use client'; // This directive is essential for error boundaries

import { useEffect } from 'react';


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry or Datadog
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
      <h2 className="text-3xl font-bold text-red-700 mb-4">
        Something went wrong! 😔
      </h2>
      <p className="text-gray-600 mb-6">
        We couldn't load the hotel list due to an issue.
      </p>
      
      {/* The reset button attempts to re-render the segment */}
      <button
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        onClick={
          // Attempt to re-render the segment
          () => reset()
        }
      >
        Try Reloading the List
      </button>
      
      {/* Optional: Display error details during development */}
      {/* <p className="mt-4 text-sm text-gray-400">Error Details: {error.message}</p> */}
    </div>
  );
}



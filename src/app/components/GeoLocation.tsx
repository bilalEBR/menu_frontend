'use client';
import React, { useState } from "react";

// The base URL for your Laravel API, assumed to be set in your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// --- TypeScript Definitions ---
type Location = {
  lat: number | null;
  lng: number | null;
};

type Hotel = {
  id: number;
  name: string;
  address: string;
  phone: string;
  image: string;
  distance?: number; // Distance is provided by the Laravel query
};

// --- Component ---
export default function GetLocation() {
  const [location, setLocation] = useState<Location>({ lat: null, lng: null });
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the user's current location and then calls the Laravel API.
   */
  const getUserLocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    // Reset state before starting the process
    setIsLoading(true);
    setError(null);
    setLocation({ lat: null, lng: null });
    setHotels([]);

    navigator.geolocation.getCurrentPosition(
      // Success callback
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        // Fetch nearby hotels from Laravel
        try {
          const url = `${API_BASE_URL}/hotels/nearby?lat=${latitude}&lng=${longitude}`;
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          // Log response details for debugging
          console.log('Response status:', response.status);
          console.log('Response headers:', [...response.headers.entries()]);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Raw error response:', errorText.substring(0, 200));
            let errorMessage = `API error with status: ${response.status}`;
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.message || errorMessage;
            } catch {
              errorMessage += ' (Non-JSON response)';
            }
            throw new Error(errorMessage);
          }

          const data = await response.json();
          console.log('API response:', data);

          if (data.data && Array.isArray(data.data) && data.data.length === 0) {
            setError("No hotels found within 20 km.");
          }

          setHotels(data.data || []);
        } catch (fetchError) {
          console.error("Fetch Error:", fetchError);
          setError(`Failed to fetch nearby hotels: ${(fetchError as Error).message}`);
        } finally {
          setIsLoading(false);
        }
      },
      // Error callback (e.g., user denies permission, timeout)
      (geoError) => {
        setIsLoading(false);
        let errorMessage = "Could not retrieve location.";
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMessage = "Location access denied. Please allow geolocation permissions.";
        }
        console.error("Geolocation Error:", geoError);
        setError(errorMessage);
      }
    );
  };

  return (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-lg max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Find Nearby Hotels</h2>

      <button
        onClick={getUserLocation}
        disabled={isLoading}
        className={`w-full px-6 py-3 font-medium rounded-lg transition duration-200 ${
          isLoading
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
        }`}
      >
        {isLoading ? 'Searching...' : 'Get My Location & Find Hotels'}
      </button>

      {/* --- Feedback Section --- */}
      {error && (
        <p className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          🚨 {error}
        </p>
      )}
      {location.lat !== null && location.lng !== null && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
          <p className="text-sm font-medium text-indigo-800">Location Found:</p>
          <p className="text-xs text-indigo-600">
            Latitude: {location.lat.toFixed(5)}, Longitude: {location.lng.toFixed(5)}
          </p>
        </div>
      )}

      {/* --- Results Section --- */}
      {hotels.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2">
            Hotels Found ({hotels.length}):
          </h3>
          <ul className="space-y-3">
            {hotels.map((hotel) => (
              <li key={hotel.id} className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <img
                    src={hotel.image}
                    alt={`${hotel.name} image`}
                    className="w-16 h-16 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg'; // Fallback image
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{hotel.name}</p>
                    <p className="text-sm text-gray-500">{hotel.address}</p>
                    <p className="text-sm text-gray-500">{hotel.phone}</p>
                    {hotel.distance !== undefined && hotel.distance !== null && (
                      <span className="text-xs font-semibold text-indigo-500 mt-1 block">
                        {hotel.distance.toFixed(1)} km away
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
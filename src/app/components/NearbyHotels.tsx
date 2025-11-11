"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Hotel {
  id: number;
  name: string;
  address: string;
  phone: string;
  image: string;
  distance?: number;
}

export default function NearbyHotels() {
  const [radius, setRadius] = useState(5); // default 5 km
  const [location, setLocation] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });
  const [hotels, setHotels] = useState<Hotel[]>([]);

  // ✅ Get user location once on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // ✅ Fetch nearby hotels whenever location or radius changes
  useEffect(() => {
    const fetchNearbyHotels = async () => {
      if (location.lat && location.lng) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/hotels/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radius}`
          );
          if (!response.ok) throw new Error("Failed to fetch nearby hotels");
          const data = await response.json();
          setHotels(data.data || []);
        } catch (error) {
          console.error(error);
          setHotels([]);
        }
      }
    };

    fetchNearbyHotels();
  }, [location, radius]);

  return (
    <div className="mb-6">
      {/* Radius Selector */}
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm font-medium text-gray-700">Radius (km):</label>
        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={20}>20 km</option>
          <option value={50}>50 km</option>
        </select>
      </div>

      {/* Horizontal Scroll */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="min-w-[220px] bg-white rounded-lg shadow-md p-4 flex-shrink-0"
          >
            {hotel.image && (
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-28 object-cover rounded-md"
              />
            )}
            <h3 className="text-lg font-bold mt-2">{hotel.name}</h3>
            {hotel.distance && (
              <p className="text-sm text-gray-500">{hotel.distance.toFixed(1)} km away</p>
            )}
          </div>
        ))}
        {hotels.length === 0 && (
          <p className="text-gray-500 italic">No nearby hotels found.</p>
        )}
      </div>
    </div>
  );
}

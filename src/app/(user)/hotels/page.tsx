// server side component

// NO 'use client' directive

import GetLocation from "@/app/components/GeoLocation";
import NearbyHotels from "@/app/components/NearbyHotels";
import Link from "next/link";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const API_ENDPOINT = `${API_BASE_URL}/hotels`;

// Define the hotel type (still useful for TypeScript)
interface Hotel {
  id: number;
  name: string;
  address: string;
  phone: string;
  image: string;
  rating: number;
}

// Data fetching is now done directly on the server
const fetchHotels = async (): Promise<Hotel[]> => {
  // Data fetching happens on the server before the component renders
  try {
    // for SSR

    const response = await fetch(API_ENDPOINT, {
      // Add caching control if needed
      cache: "no-store",
    });

    // for SSG
    // const response = await fetch(API_ENDPOINT, {
    //    // KEY CHANGE for ISR:
    //   // Tells Next.js to regenerate the static page cache
    //   // no more frequently than every 3600 seconds (60 minutes).
    //   next: { revalidate: 3600 },
    // });

    // Check for bad response status (e.g., 404, 500)
    if (!response.ok) {
      throw new Error(`API fetch failed with status: ${response.status}`);
    }

    const data = await response.json();

    // Handle the deeply nested data structure
    if (data.message === "Hotels retrieved successfully.") {
      return data.data.data as Hotel[];
    }

    return []; // Return an empty array if data format is unexpected
  } catch (error) {
    console.error("Server Fetch Error:", error);
    // In a real application, you might redirect or show an error page
    return [];
  }
};

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating); // whole stars
  const halfStar = rating % 1 >= 0.5; // half star if needed
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {/* Full stars */}
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <svg
            key={`full-${i}`}
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        ))}

      {/* Half star */}
      {halfStar && (
        <svg
          className="w-5 h-5 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"
          />
        </svg>
      )}

      {/* Empty stars */}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <svg
            key={`empty-${i}`}
            className="w-5 h-5 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        ))}
    </div>
  );
};

export default async function HotelList() {
  // 1. Await the data directly
  const hotels = await fetchHotels();

  // 2. No more 'loading' state, as the Server Component waits for data
  //    (The loading state is handled by the loading.tsx file)

  if (hotels.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-center text-gray-500">
        No hotels found at this time.
      </div>
    );
  }

  // 3. Render the UI with the fetched data
  return (
  <div className="min-h-screen bg-gray-50 md:p-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-3">
      Available Hotels 🏨
    </h1>

    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className="bg-white rounded-2xl  shadow-md hover:shadow-xl transition duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1"
        >
          {/* Hotel Image */}
          {hotel.image && (
            <img
              src={hotel.image}
              alt={`Image of ${hotel.name}`}
              className="h-48 w-full object-cover"
            />
          )}

          {/* Hotel Details */}
          <div className="p-6">
            {/* Hotel Name */}
            <h2 className="text-lg font-bold text-blue-700 mb-3 truncate border-b">
              {hotel.name}
            </h2>

            {/* Star Rating */}
            <div className="flex items-center text-gray-600 mb-4">
              <svg
                className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
              <div className="flex items-center ">
                  <span className="font-semibold">Rating:</span>
                {renderStars(hotel.rating)}
                <span className="ml-2 text-sm text-gray-500">
                  {hotel.rating}/5
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start text-gray-600 mb-2">
              <svg
                className="w-5 h-5 mr-2 text-red-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="">
                <span className="font-semibold">Address:</span> {hotel.address}
              </p>
            </div>

            {/* Phone */}
            <div className="flex items-center text-gray-600 mb-4">
              <svg
                className="w-5 h-5 mr-2 text-green-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.109 6.109l.773-1.548a1 1 0 011.06-.54l4.435.74A1 1 0 0118 16.847V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <p className="">
                <span className="font-semibold">Phone:</span> {hotel.phone}
              </p>
            </div>

            {/* Menus Button */}
            <Link href={`hotels/${hotel.id}`}>
              <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
                View Menus
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}

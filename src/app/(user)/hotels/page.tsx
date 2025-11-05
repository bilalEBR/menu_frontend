// server side component

// NO 'use client' directive

import Link from "next/link";
const API_ENDPOINT = "http://127.0.0.1:8000/api/hotels";

// Define the hotel type (still useful for TypeScript)
interface Hotel {
  id: number;
  name: string;
  address: string;
  phone: string;
  image: string;
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Available Hotels 🏨
      </h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1"
          >
            {/* NEW: Image Placeholder 
            This div acts as the image, ensuring it has a fixed height 
            and covers the width of the card.
          */}

            <div className="h-40 bg-gray-300 w-full flex items-center justify-center text-gray-600 text-sm font-semibold"></div>

            {/* {hotel.image && (
                <img 
                  src={hotel.image} 
                  alt={`Image of ${hotel.name}`} 
                  className="h-40 w-full object-cover" // object-cover ensures the image fills the 160px height without stretching
                />
              )} */}

            <div className="p-5">
              {/* Hotel Name - Prominent and bold */}
              <h2 className="text-xl font-extrabold text-blue-700 mb-2 truncate">
                {hotel.name}
              </h2>

              <hr className="mb-3 border-gray-200" />

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
                <p className="text-sm">
                  <span className="font-semibold">Address:</span>{" "}
                  {hotel.address}
                </p>
              </div>

              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.109 6.109l.773-1.548a1 1 0 011.06-.54l4.435.74A1 1 0 0118 16.847V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <p className="text-sm">
                  <span className="font-semibold">Phone:</span> {hotel.phone}
                </p>
              </div>

              {/* NEW: Menus Button */}

              <Link href={`hotels/${hotel.id}`}>
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                  View {hotel.name} Menus
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; // Use this hook in Client Components for route params
import HotelQRCodeGenerator from "@/app/components/HotelQRCodeGenerator";

// --- INTERFACES MUST MATCH LARAVEL'S JSON RESPONSE ---
interface MenuItem {
  id: number;
  category_id: number;
  item_name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  hotel_id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
  menu_items: MenuItem[];
}

interface Hotel {
  id: number;
  name: string;
  address: string;
  phone: string;
  categories: Category[];
}

// Base URL for the Laravel API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Client Component for the Hotel Detail Page.
 * Handles state for category selection and synchronous data fetching.
 */
export default function HotelDetailPage() {
  // Correct way to access route params inside a client component page
  const params = useParams();
  // Ensures hotelId is treated as a string, using optional chaining for safety
  const hotelId = params.hotelId ? String(params.hotelId) : null;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  // State to track the currently selected category ID.
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  // Function to fetch hotel details
  const getHotelDetails = async (id: string) => {
    setLoading(true);
    const API_ENDPOINT = `${API_BASE_URL}/hotels/${id}`;

    try {
      const response = await fetch(API_ENDPOINT, {
        cache: "no-store",
      });

      if (!response.ok) {
        console.error(`API fetch failed with status: ${response.status}`);
        setHotel(null);
        return;
      }

      const result = await response.json();
      const fetchedHotel = result.data as Hotel;
      setHotel(fetchedHotel);

      // Set the first category as active when data is loaded
      if (fetchedHotel?.categories?.length > 0) {
        setActiveCategoryId(fetchedHotel.categories[0].id);
      }
    } catch (error) {
      console.error("Server Fetch Error:", error);
      setHotel(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (hotelId) {
      getHotelDetails(hotelId);
    }
  }, [hotelId]); // Dependency on hotelId ensures fetch runs when it's available

  // Handle Loading State
  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-screen flex justify-center items-center">
        <p className="text-xl text-blue-600 animate-pulse">
          Loading Hotel Menu...
        </p>
      </div>
    );
  }

  // Handle Error State (Hotel Not Found/API Failure or Missing ID)
  if (!hotel || !hotelId) {
    return (
      <div className="container mx-auto p-8 text-center min-h-screen bg-white rounded-xl shadow-lg m-4 md:m-8">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Error: Hotel Not Available
        </h1>
        <p className="text-gray-600">
          Could not retrieve hotel details for ID: {hotelId || "N/A"}. The
          server may be down or the ID may be invalid.
        </p>
        <Link
          href="/hotels"
          className="mt-6 inline-block text-blue-500 hover:text-blue-700 font-medium transition"
        >
          &larr; Back to All Hotels
        </Link>
      </div>
    );
  }

  // Find the currently active category object
  const activeCategory = hotel.categories.find(
    (cat) => cat.id === activeCategoryId
  );

  return (
    <div className=" w-full mx-auto p-4  bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-2xl p-3 lg:p-10">
        {/* Header Section */}
        <div className=" flex justify-between border-b pb-1 mb-2">
          <h2 className="text-2xl font-extrabold  text-indigo-700 mb-2">
            {hotel.name} Hotel
          </h2>
          <p className="text-xl text-gray-500">{hotel.address}</p>
        </div>
        <div className="text-xl font-bold ">
          <p> Categories</p>
        </div>
        {/* Menu Check */}
        {hotel.categories && hotel.categories.length > 0 ? (
          <div className="mt-2">
            {/* <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-4">
                            Dining Menus
                        </h2> */}

            {/* --- HORIZONTAL CATEGORY NAVIGATION BAR (TABS) --- */}
            {/* scrollbar-hide is a custom utility often needed for Tailwind, assuming it's configured or using browser defaults */}
            <div className="flex space-x-4 overflow-x-auto pb-4 mb-2 border-b border-gray-200">
              {hotel.categories.map((category) => {
                const isActive = category.id === activeCategoryId;
                return (
                  <div
                    key={category.id}
                    onClick={() => setActiveCategoryId(category.id)}
                    role="button"
                    tabIndex={0}
                    className={`flex-shrink-0 w-50 h-24  p-3 rounded-2xl text-center shadow-xl  ${
                      isActive
                        ? " bg-blue-900 text-white ring-4  shadow-2xl"
                        : "bg-gray-100 text-black "
                    }`}
                  >
                    {/* Category Icon Placeholder */}
                    <div
                      className={`w-full h-12 mb-2 flex items-center justify-center rounded-xl text-2xl font-black  ${
                        isActive
                          ? "bg-white  text-white shadow-inner"
                          : " text-blue-600 shadow-md"
                      }`}
                    >
                      {/* {category.category_name.substring(0, 1)} */}
                    </div>
                    {/* Category Name */}
                    <span className="text-sm font-bold block overflow-hidden whitespace-nowrap text-ellipsis px-1">
                      {category.category_name}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* ------------------------------------------------ */}

            {/* --- ACTIVE CATEGORY MENU ITEMS --- */}
            {activeCategory && (
              <div
                key={activeCategory.id}
                className="bg-white rounded-xl shadow-xl border border-gray-100"
              >
                {/* Active Category Title */}
                {/* <h3 className="text-3xl font-extrabold text-indigo-700  px-6 py-4 shadow-md rounded-t-xl">
                                    {activeCategory.category_name}
                                </h3> */}

                {/* Menu Items List */}
                <div className="space-y-4 p-6">
                  {activeCategory.menu_items &&
                    activeCategory.menu_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start py-4 border-b last:border-b-0"
                      >
                        {/* Item Image Placeholder */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg mr-4 flex items-center justify-center text-sm font-semibold text-gray-600 shadow-inner">
                          {item.item_name.substring(0, 3).toUpperCase()}
                        </div>

                        <div className="flex-grow min-w-0">
                          {/* Item Name & Description */}
                          <span className="text-xl font-bold text-gray-900 block truncate">
                            {item.item_name}
                          </span>
                          {item.description && (
                            <span className="text-sm text-gray-600 mt-1 block">
                              {item.description}
                            </span>
                          )}
                        </div>

                        {/* Price */}
                        <span className="text-xl font-bold text-green-600 ml-4 flex-shrink-0">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  {(!activeCategory.menu_items ||
                    activeCategory.menu_items.length === 0) && (
                    <p className="text-gray-500 italic text-center py-8 bg-gray-50 rounded-lg">
                      No items listed in the {activeCategory.category_name}{" "}
                      category yet.
                    </p>
                  )}
                </div>
              </div>
            )}
            {/* ------------------------------------------------- */}
          </div>
        ) : (
          <div className="p-6 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg">
            <p className="font-semibold">No menus available yet.</p>
            <p className="text-sm mt-1">
              Check back later or contact the hotel for dining options.
            </p>
          </div>
        )}


          <div>
            <HotelQRCodeGenerator hotelId={hotelId} />
          </div>

        <div className="mt-12 pt-6 border-t text-sm text-gray-500">
          <Link
            href="/hotels"
            className="text-blue-500 hover:text-blue-700 font-medium transition"
          >
            &larr; Back to All Hotels
          </Link>


          {/* <p className="mt-3">
                        Hotel ID: {hotelId}. Data fetched live from Laravel backend.
                    </p> */}
        </div>
      </div>
    </div>
  );
}

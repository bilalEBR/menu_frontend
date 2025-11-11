"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import HotelQRCodeGenerator from "@/app/components/HotelQRCodeGenerator";

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
  category_image:string;
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function HotelDetailPage() {
  const params = useParams();
  const hotelId = params.hotelId ? String(params.hotelId) : null;
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  useEffect(() => {
    if (hotelId) {
      getHotelDetails(hotelId);
    }
  }, [hotelId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-screen flex justify-center items-center">
        <p className="text-xl text-blue-600 animate-pulse">
          Loading Hotel Menu...
        </p>
      </div>
    );
  }

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

  const activeCategory = hotel.categories.find(
    (cat) => cat.id === activeCategoryId
  );

  return (
    <div className="w-full mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-2xl p-3 lg:p-10">
        <div className="flex justify-between border-b pb-1 mb-2">
          <h2 className="text-2xl font-extrabold text-indigo-700 mb-2">
            {hotel.name} Hotel
          </h2>
          <p className="text-xl text-gray-500">{hotel.address}</p>
        </div>

        <div className="flex justify-between">
          <div className=" mt-1 text-xl font-bold">
            <p>Categories</p>
          </div>
          <div>
 <button
  onClick={() => setIsDrawerOpen(true)}
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h6v6H3zm6 12H3v6h6zm12-12h-6v6h6zm-6 12h6v6h-6zm-6 0h6v6h-6zm12-6h-6v6h6zm-18 0h6v6H3zm6-6H3v6h6zm6-6h6v6h-6z"
    />
  </svg>
  Share via QR Code
</button>
          </div>
        </div>

        {hotel.categories && hotel.categories.length > 0 ? (
          <div className="mt-2">
            <div className="flex space-x-4 overflow-x-auto pb-4 mb-2 border-b border-gray-200">
              {hotel.categories.map((category) => {
                const isActive = category.id === activeCategoryId;
                return (
                  <div
                    key={category.id}
                    onClick={() => setActiveCategoryId(category.id)}
                    role="button"
                    tabIndex={0}
                    className={`flex-shrink-0 w-45 p-3 rounded-lg text-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-gray-200 text-gray-800 shadow-lg scale-105"
                        : "bg-white text-gray-800 hover:bg-gray-200"
                    }`}
                  >

<div className="w-40 h-25 mx-auto mb-3 rounded-full overflow-hidden shadow-md">
  <img
    src={category.category_image}
    alt={category.category_name}
    className="w-full h-full object-cover"
  />
</div>




                    <span className="text-sm font-semibold block">
                      {category.category_name}
                    </span>
                  </div>
                );
              })}
            </div>

            {activeCategory && (
              <div
                key={activeCategory.id}
                className="bg-white rounded-xl shadow-xl border border-gray-100"
              >
                <div className="space-y-4 p-6">
                  {activeCategory.menu_items &&
                    activeCategory.menu_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start py-4 border-b last:border-b-0"
                      >
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg mr-4 flex items-center justify-center text-sm font-semibold text-gray-600 shadow-inner">
                          {item.item_name.substring(0, 3).toUpperCase()}
                        </div>
                        <div className="flex-grow min-w-0">
                          <span className="text-xl font-bold text-gray-900 block truncate">
                            {item.item_name}
                          </span>
                          {item.description && (
                            <span className="text-sm text-gray-600 mt-1 block">
                              {item.description}
                            </span>
                          )}
                        </div>
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
          </div>
        ) : (
          <div className="p-6 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg">
            <p className="font-semibold">No menus available yet.</p>
            <p className="text-sm mt-1">
              Check back later or contact the hotel for dining options.
            </p>
          </div>
        )}
        {/* Drawer Button and Drawer */}
        <div className="mt-4">
          {/* Drawer */}
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 ${
              isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            } transition-opacity duration-300`}
          >
            <div className="w-150 bg-gray-200 rounded-xl shadow-2xl p-4 transform transition-transform duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-indigo-700">QR Code</h3>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <HotelQRCodeGenerator hotelId={hotelId} />
            </div>
          </div>
          {/* Overlay when drawer is open */}
          {isDrawerOpen && (
            <div
              className="fixed inset-0  bg-opacity-0 z-40"
              onClick={() => setIsDrawerOpen(false)}
            ></div>
          )}
        </div>
        <div className="mt-12 pt-6 border-t text-sm text-gray-500">
          <Link
            href="/hotels"
            className="text-blue-500 hover:text-blue-700 font-medium transition"
          >
            &larr; Back to All Hotels
          </Link>
        </div>
      </div>
    </div>
  );
}

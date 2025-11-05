// src/app/hotels/loading.tsx

// Component to represent the skeleton card
const HotelCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 animate-pulse">
        {/* Name Placeholder */}
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        
        <hr className="mb-3 border-gray-100" />
        
        {/* Address Placeholder */}
        <div className="flex items-center mb-2">
            <div className="w-5 h-5 mr-2 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
        
        {/* Phone Placeholder */}
        <div className="flex items-center">
            <div className="w-5 h-5 mr-2 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
    </div>
);

// The loading component automatically displayed while page.tsx is fetching data
export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                Available Hotels ⏳
            </h1>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Render three skeleton cards */}
                <HotelCardSkeleton />
                <HotelCardSkeleton />
                <HotelCardSkeleton />
            </div>
        </div>
    );
}
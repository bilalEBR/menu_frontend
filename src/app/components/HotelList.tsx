// import { useState, useEffect } from 'react';

// const API_BASE_URL = "http://127.0.0.1:8000";
// const API_ENDPOINT = `${API_BASE_URL}/api/hotels`;

// export default function HotelList() {
//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({});

//   useEffect(() => {
//     fetchHotels();
//   }, []);

//   const fetchHotels = async (url = API_ENDPOINT) => {
//     try {
//       setLoading(true);
//       const response = await fetch(url);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.message === 'Hotels retrieved successfully.') {
//         setHotels(data.data.data || data.data); // Handle both paginated and non-paginated responses
//         setPagination({
//           currentPage: data.data.current_page,
//           lastPage: data.data.last_page,
//           total: data.data.total,
//           links: data.data.links
//         });
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching hotels:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (url) => {
//     if (url) {
//       fetchHotels(url);
//     }
//   };

//   if (loading) return <div className="text-center py-4">Loading hotels...</div>;
  
//   if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Hotels</h1>
      
//       {hotels.length === 0 ? (
//         <div className="text-center py-4">No hotels found.</div>
//       ) : (
//         <>
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {hotels.map((hotel) => (
//               <div key={hotel.id} className="border rounded-lg p-4 shadow-sm">
//                 <h3 className="text-lg font-semibold mb-2">{hotel.name}</h3>
//                 <p className="text-gray-600 mb-2">
//                   <strong>Address:</strong> {hotel.address}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Phone:</strong> {hotel.phone}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {pagination.links && pagination.links.length > 3 && (
//             <div className="flex justify-center mt-6 space-x-2">
//               {pagination.links.map((link, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handlePageChange(link.url)}
//                   disabled={!link.url || link.active}
//                   className={`px-3 py-1 rounded ${
//                     link.active
//                       ? 'bg-blue-500 text-white'
//                       : link.url
//                       ? 'bg-gray-200 hover:bg-gray-300'
//                       : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   }`}
//                 >
//                   {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
//                 </button>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
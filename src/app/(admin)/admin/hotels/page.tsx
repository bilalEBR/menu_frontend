"use client";

import React, { useEffect, useState } from 'react';

// --- Configuration and Interfaces ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_ENDPOINT = `${API_BASE_URL}/hotels`;

interface Hotel {
    id: number;
    name: string;
    address: string; 
    phone: string;   
    image: string;   
}

interface NewHotelData {
    name: string;
    address: string;
    phone: string;
    image: string; 
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}


// --- Component: Main Hotel Management Page (Read + Create + Delete + Paginate) ---

export default function HotelManagementPage() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);

    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newHotel, setNewHotel] = useState<NewHotelData>({ name: '', address: '', phone: '', image: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Delete State
    const [isDeleting, setIsDeleting] = useState(false);

    // --- Data Fetching (Read & Paginate) ---
    const fetchHotels = async () => {
        setIsLoading(true);
        setError(null);
        
        // Use the current page state in the API call
        const fetchUrl = `${API_ENDPOINT}?page=${currentPage}`;

        try {
            const response = await fetch(fetchUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });

            if (response.ok) {
                const apiResponse = await response.json();
                
                // FIX: Access the nested 'data' from the paginated object, as per your controller logic
                const paginatedData = apiResponse.data; 

                if (paginatedData && Array.isArray(paginatedData.data)) {
                    setHotels(paginatedData.data);
                    // Extract and set pagination metadata
                    setPagination({
                        current_page: paginatedData.current_page,
                        last_page: paginatedData.last_page,
                        total: paginatedData.total,
                        per_page: paginatedData.per_page,
                    });
                } else if (paginatedData && typeof paginatedData === 'object' && Object.keys(paginatedData).length === 0) {
                     // Handles the case where the API returns {data: {}} for no results
                     setHotels([]);
                     setPagination(prev => prev ? { ...prev, current_page: 1, total: 0 } : null);
                } else {
                    console.error("Unexpected API response format: Paginated data array not found.", apiResponse);
                    setHotels([]); 
                    setError("Data received from API was not in the expected Laravel pagination format.");
                }

            } else {
                const errorData = await response.json();
                setError(errorData.message || `Failed to fetch hotels (Status: ${response.status}).`);
            }
        } catch (err) {
            console.error("Network Error:", err);
            setError('Could not connect to the API server.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Data Creation (Create) ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewHotel(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateHotel = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);

        if (!newHotel.name || !newHotel.address || !newHotel.phone) {
            setSaveError("Please fill out all required fields.");
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(newHotel),
            });

            if (response.ok) {
                setNewHotel({ name: '', address: '', phone: '', image: '' });
                setIsCreateModalOpen(false);
                // After creation, go to the last page where the new hotel will appear
                if (pagination) {
                    setCurrentPage(pagination.last_page);
                } else {
                    setCurrentPage(1); // Or just re-fetch page 1 if pagination meta is missing
                }
            } else {
                const errorData = await response.json();
                setSaveError(errorData.message || 'Failed to create hotel.');
            }
        } catch (err) {
            console.error("Network Error during creation:", err);
            setSaveError('Could not connect to the API server during save operation.');
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- Data Deletion (Delete) ---
    const handleDeleteHotel = async (hotelId: number) => {
        if (!window.confirm(`Are you sure you want to delete Hotel ID ${hotelId}?`)) {
            return;
        }
        
        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`${API_ENDPOINT}/${hotelId}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' },
            });

            if (response.ok || response.status === 204) {
                // If the current page is empty after deletion and it's not page 1, go back one page
                if (hotels.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                } else {
                    // Otherwise, just re-fetch the current page to update the list
                    setCurrentPage(prev => prev); // This triggers the useEffect due to dependency change
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || `Failed to delete hotel ID ${hotelId}.`);
            }
        } catch (err) {
            console.error("Network Error during deletion:", err);
            setError('Could not connect to the API server during delete operation.');
        } finally {
            setIsDeleting(false);
        }
    };


    // Effect hook to trigger data fetch whenever the current page changes
    useEffect(() => {
        fetchHotels();
    }, [currentPage]); 

    
    // --- Render Components ---

    const CreateHotelModal: React.FC = () => (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${isCreateModalOpen ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-center min-h-screen p-4">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                    onClick={() => setIsCreateModalOpen(false)}
                ></div>

                {/* Modal Content (omitted for brevity, same as previous, just adding the modal again) */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all sm:max-w-lg w-full z-10 p-6">
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">Add New Hotel</h3>
                    
                    <form onSubmit={handleCreateHotel} className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hotel Name *</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={newHotel.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                                placeholder="The Grand Hyatt"
                                required
                            />
                        </div>

                        {/* Address Input */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address *</label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                value={newHotel.address}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                                placeholder="123 Main St, Anytown"
                                required
                            />
                        </div>

                        {/* Phone Input */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone *</label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={newHotel.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                                placeholder="(555) 123-4567"
                                required
                            />
                        </div>

                        {/* Image URL Input (Optional) */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                            <input
                                type="url"
                                name="image"
                                id="image"
                                value={newHotel.image}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                                placeholder="https://placehold.co/600x400"
                            />
                        </div>
                        
                        {/* Save Error Display */}
                        {saveError && (
                            <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                                Error: {saveError}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-400"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Hotel"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
    
    // Pagination Controls Component
    const PaginationControls: React.FC = () => {
        if (!pagination || pagination.total === 0) return null;

        const { current_page, last_page, total, per_page } = pagination;
        const from = (current_page - 1) * per_page + 1;
        const to = Math.min(current_page * per_page, total);
        
        return (
            <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-xl shadow">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of <span className="font-medium">{total}</span> results
                </p>
                <nav className="flex space-x-2" aria-label="Pagination">
                    <button
                        onClick={() => setCurrentPage(current_page - 1)}
                        disabled={current_page === 1 || isDeleting}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage(current_page + 1)}
                        disabled={current_page === last_page || isDeleting}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                    >
                        Next
                    </button>
                </nav>
            </div>
        );
    };


    // --- Render Logic (Main Component) ---
    
    if (error) {
        // Display fatal API error
        return (
            <div className="p-8 bg-white m-4 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Hotels</h1>
                <p className="text-gray-700">{error}</p>
                <p className="text-sm text-gray-500 mt-2">Please ensure the API server is running and accessible at {API_ENDPOINT}.</p>
                <button 
                    onClick={() => setCurrentPage(1)} // Reset page to 1 and refetch
                    className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium border border-indigo-200 px-3 py-1 rounded transition duration-200"
                >
                    Try Refreshing Data
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-inter">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Hotel Management (CRUD Operations)</h1>
            
            {/* Table Header and Add Button */}
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                    Displaying hotels from the API, page {pagination?.current_page || 1}.
                </p>
                <button 
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                    onClick={() => {
                        setNewHotel({ name: '', address: '', phone: '', image: '' }); // Reset form
                        setSaveError(null); // Clear previous errors
                        setIsCreateModalOpen(true);
                    }}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add New Hotel
                </button>
            </div>

            {/* Hotel Table */}
            <div className="bg-white overflow-x-auto rounded-xl shadow-lg">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12 text-indigo-600">
                        <svg className="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading hotel data...
                    </div>
                ) : hotels.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No hotels found {pagination && pagination.total > 0 ? `on page ${currentPage}` : 'in the system'}. Click "Add New Hotel" to create one.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> 
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {hotels.map((hotel) => (
                                <tr key={hotel.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hotel.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">{hotel.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{hotel.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-bold">{hotel.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            {/* Edit Button */}
                                            <button 
                                                className="text-blue-600 hover:text-blue-900 font-medium disabled:opacity-50" 
                                                onClick={() => console.log(`Edit clicked for ID: ${hotel.id}`)}
                                                disabled={isDeleting}
                                            >
                                                Edit
                                            </button>
                                            
                                            {/* Delete Button */}
                                            <button 
                                                className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50 flex items-center" 
                                                onClick={() => handleDeleteHotel(hotel.id)}
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? (
                                                     <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : null}
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <PaginationControls />
            <CreateHotelModal />
        </div>
    );
}

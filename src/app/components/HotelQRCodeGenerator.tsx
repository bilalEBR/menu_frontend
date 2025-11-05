import React, { useState, useMemo } from 'react';

// --- Icon Components (Lucide Icons used as a standard practice) ---
interface IconProps extends React.SVGProps<SVGSVGElement> {}

const CopyIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
);

const PrinterIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14H3v6c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-6h-3"/>
    </svg>
);

const CheckIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);


// --- Typescript Interfaces ---

interface HotelQRCodeGeneratorProps {
    hotelId: string;
    onClose?: () => void;
}

interface QRCodeDisplayProps {
    value: string;
    size?: number;
}

/**
 * Component that generates a REAL, scannable QR code using the GoQR.me API.
 * This API is generally very reliable for simple, external image generation.
 */
const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 256 }) => {
    // GoQR.me API URL structure:
    // ?size={width}x{height}&data={encoded-content}
    const qrCodeUrl = useMemo(() => {
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
    }, [value, size]);

    return (
        <div className="flex flex-col items-center p-4 border-4 border-indigo-100 rounded-xl bg-white shadow-xl">
            {/* The actual image tag rendering the QR code */}
            <img 
                src={qrCodeUrl} 
                alt={`QR Code for ${value}`} 
                width={size} 
                height={size}
                className="rounded-lg shadow-inner"
                // Fallback in case the new API also fails.
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Switch to a placeholder on error
                    target.src = "https://placehold.co/256x256/f1f5f9/374151?text=QR+API+Failed";
                    console.error("Failed to load QR code image from the new API (api.qrserver.com). Check network policy.");
                }}
            />
             <p className="text-xs text-center text-gray-500 mt-2">
                Scan with any device camera
            </p>
        </div>
    );
};

/**
 * Main component to generate and display the unique QR code for a hotel menu.
 */
const HotelQRCodeGenerator: React.FC<HotelQRCodeGeneratorProps> = ({ hotelId, onClose }) => {
    // CRITICAL WARNING: THIS MUST BE YOUR PUBLIC, PRODUCTION DOMAIN! 
    const BASE_DOMAIN = "http://127.0.0.1:8000/api"; 

    // useMemo calculates the URL only when hotelId changes, optimizing performance.
    const menuUrl = useMemo(() => {
        console.log(hotelId);
        // Construct the complete, public URL for the hotel's menu page.
        return `${BASE_DOMAIN}/hotels/${hotelId}`;
        
    }, [hotelId]);

    // Simple state to confirm copying
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        // Reliable fallback implementation for clipboard copy that works in iframes
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = menuUrl;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        
        try {
            // Using the deprecated but functional execCommand for cross-browser/iframe compatibility
            document.execCommand('copy'); 
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Could not copy text using execCommand: ', err);
        } finally {
            document.body.removeChild(tempTextArea);
        }
    };
    
    // Function to handle printing the QR code area
    const handlePrint = () => {
        // Simple window print
        window.print();
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-2xl space-y-6 border border-gray-100 print:shadow-none print:max-w-full print:bg-white print:border-0">
            
            {onClose && (
                <div className="flex justify-end -mt-2 -mr-2 print:hidden">
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            )}
            
            {/* <h1 className="text-3xl font-extrabold text-indigo-700">
                Menu QR Code Generator
            </h1>
            <p className="text-gray-600">
                This code directs customers to the menu ID **{hotelId}**.
            </p>

            <div className="bg-gray-100 p-3 rounded-lg border border-indigo-200 shadow-inner">
                <span className="text-sm font-mono text-gray-800 break-all">{menuUrl}</span>
            </div> */}

            {/* QR Code Display Area */}
            <div className="flex justify-center py-6 border-t border-b border-gray-100">
                <div id="qr-code-to-print" className="print:p-12 print:shadow-none print:border print:border-gray-300">
                    <QRCodeDisplay value={menuUrl} size={150} />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
                <button
                    onClick={handleCopy}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold transition duration-200 flex items-center justify-center space-x-2 ${isCopied 
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-md' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                    }`}
                >
                    {isCopied ? <><CheckIcon className="w-5 h-5" /> <span>URL Copied!</span></> : <><CopyIcon className="w-5 h-5" /> <span>Copy Menu URL</span></>}
                </button>
                <button
                    onClick={handlePrint}
                    className="flex-1 py-3 px-4 rounded-lg font-bold transition duration-200 bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-md flex items-center justify-center space-x-2"
                >
                    <PrinterIcon className="w-5 h-5" />
                    <span>Print QR Code</span>
                </button>
            </div>
{/*             
            <p className="text-xs text-center text-red-500 font-semibold pt-2">
                **CRITICAL:** Change `BASE_DOMAIN` in the code to your actual public production domain for the QR code to work outside of your local machine!
            </p> */}
        </div>
    );
};

export default HotelQRCodeGenerator;

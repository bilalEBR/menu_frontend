import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Menu App",
  description: "Developed by Bilal Ebrahim",
    icons: {
    // This path is relative to the root URL (because it's in the /public folder)
    icon: '/menu_logo2.jpg', 
  },
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Reverted body structure to only contain the children */}
        
      
       
              {children}
       
      </body>
    </html>
  );
}

//  app/layout.tsx
"use client";
import { createContext, useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Metadata from "../app/metadata";
import Header from "./components/header";
import Footer from "./components/footer";
import { initializeAmplitude, logEvent, getAmplitudeInstance } from "../utils/analytics";
import { usePathname } from "next/navigation";  // Use usePathname to monitor route changes
import { AuthProvider } from "../lib/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";

// Use ReturnType to infer the type from initializeAmplitude
const AmplitudeContext = createContext<ReturnType<typeof initializeAmplitude> | null>(null);

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname(); // Use usePathname hook to track URL changes

  useEffect(() => {
    // Initialize Amplitude
    initializeAmplitude();
    const amplitudeInstance = getAmplitudeInstance();

    const handleRouteChange = (url:string) => {
      // Log page view to Amplitude
      logEvent("Page Viewed", { page: url });
    };

    // Log the initial page view
    logEvent("Page Viewed", { page: pathname });

    // Log changes on pathname
    const handlePathnameChange = () => {
      logEvent("Page Viewed", { page: pathname });
    };

    // Add a listener for pathname changes (React Hook)
    handlePathnameChange();

    return () => {
      // Cleanup if necessary, but in this case, no cleanup is needed for a direct log
    };
  }, [pathname]); // Dependency array includes pathname


  return (
    <html lang="en">
      <Metadata 
        seoTitle="MintDeals" 
        seoDescription="MintDeals empowers small businesses with the ability to offer exclusive tokenized deals as NFTs, while providing access to a shared credit facility backed by stablecoins and Bitcoin. Built on Tron blockchain, MintDeals allows businesses to enhance customer loyalty through unique deal clubs and secure onchain credit via JustLendDAO. Join the future of small business financing and loyalty programs with MintDeals—seamlessly integrating crypto and DeFi for real-world business growth."></Metadata>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.2/css/all.min.css"
          rel="stylesheet"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
      </head>
      <body id="root" className={`bg-mintdeals ${inter.className}`}>
        <AuthProvider>
          
            <AmplitudeContext.Provider value={getAmplitudeInstance()}>
              <Header />
              {children}
              <Footer />
              <ToastContainer
                position="top-center"
                autoClose={8000}
                hideProgressBar={false}
                closeOnClick
                draggable
                pauseOnHover
              />
            </AmplitudeContext.Provider>
          
        </AuthProvider>
      </body>
    </html>
  );
}

"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import  "bootstrap/dist/css/bootstrap.min.css"
import Header from "./header";
import Footer from "./footer";
import Metadata from "../app/metadata";
import {AuthProvider} from "../lib/AuthContext";



const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Metadata seoTitle="Mint" seoDescription="Best Deals"></Metadata>
      <head>
        {/* You can add meta tags, title, etc., here */}
        <link
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <AuthProvider>
      <body className={`bg-mintdeals ${inter.className}`}>
        <Header />
        {children}
        <Footer/>
        </body>
      </AuthProvider>  
    </html>
  );
}

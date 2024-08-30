"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import  "bootstrap/dist/css/bootstrap.min.css"
import Header from "./header";
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
      <AuthProvider>
      <body className={inter.className}>
      <Header></Header>
        {children}
        </body>
      </AuthProvider>  
    </html>
  );
}

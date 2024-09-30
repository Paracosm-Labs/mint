// components/header.js
"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import login from "@/lib/login";
import WalletConnect from "./walletConnect";
import Image from "next/image";
import { initializeAmplitude, logEvent } from "@/utils/analytics";

function Header() {
  const { isAuthenticated, setIsAuthenticated, setJwtToken, setData } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // State for toggling
  const router = useRouter();

  useEffect(() => {
    // Initialize Amplitude on mount
    initializeAmplitude();
  }, []);

  const handleLinkClick = (page) => {
    // Log link click event to Amplitude
    logEvent("Link Clicked", { page });
  };

  const postLogin = async (auth, data) => {
    setData(data);
    setIsAuthenticated(true);
    setJwtToken(auth);
    router.push("/dashboard/business", { scroll: false });
  };

  const handleBusinessLogin = async () => {
    try {
      await login(postLogin, router);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleBusinessLogout = () => {
    console.log("logging out");
    setIsAuthenticated(false);
    setJwtToken(null);
    router.push("/", { scroll: false });
  };

  const toggleMenu = () => {
    if (isOpen) {
      // Manually remove 'show' class if open
      document.getElementById("navbarNav").classList.remove("show");
    } else {
      // Manually add 'show' class if closed
      document.getElementById("navbarNav").classList.add("show");
    }
    setIsOpen(!isOpen); // Set new state
  };
  

  const getMenuEntries = () => {
    return (
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <Link className="nav-link" href="/explore" onClick={() => handleLinkClick("Explore Clubs")}>
            Explore Clubs
          </Link>
        </li>
        <li className={`nav-item ${isAuthenticated ? "" : "me-2"}`}>
          <Link className="nav-link" href="/myclubs" onClick={() => handleLinkClick("My Clubs")}>
            My Clubs
          </Link>
        </li>
        {isAuthenticated && (
          <li className="nav-item me-2">
            <Link className="nav-link" href="/dashboard/business" onClick={() => handleLinkClick("Dashboard")}>
              Dashboard
            </Link>
          </li>
        )}
        <li className="">
          {/* Render the WalletConnect component */}
          <WalletConnect 
            handleBusinessLogin={handleBusinessLogin} 
            handleBusinessLogout={handleBusinessLogout} 
          />
        </li>
      </ul>
    );
  };

  return (
    <header className="mintdeals navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">
          <Image
            src="/logo192.png"
            alt="MintDeals Logo"
            width={40}
            height={40}
            className="d-inline-block align-top border border-white shadow-lg"
            style={{
              padding: "5px",
              marginRight: "10px",
              backgroundColor: "white",
              borderRadius: "15%", // Creates the rounded square effect
              marginTop: "-5px",
            }}
          />
          <span style={{ color: '#0a462a' }}>MintDeals</span>
        </Link>
        <button
          className={`navbar-toggler ${isOpen ? "" : "collapsed"}`} 
          type="button" 
          onClick={toggleMenu}
          aria-controls="navbarNav" 
          aria-expanded={isOpen} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="navbarNav" className={`collapse navbar-collapse`}>
          {getMenuEntries()}
        </div>
      </div>
    </header>
  );
}

export default Header;

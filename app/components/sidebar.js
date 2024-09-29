'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import {useAuth} from "@/lib/AuthContext";
import { initializeAmplitude, logEvent } from "@/utils/analytics";

function Sidebar() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const amplitudeInstance = initializeAmplitude();

  const handleLinkClick = (page) => {
    // Log link click event to Amplitude
    logEvent("Link Clicked", { page });
  };

  if(!isAuthenticated){
    return (<></>)
  }
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="col-md-2 col-lg-2 d-md-block sidebar">
      <div className="position-sticky pt-3">
        <button
          className="navbar-toggler d-md-none"
          type="button"
          onClick={toggleSidebar}
        >
          <span className="navbar-toggler-icon">&#9776;</span> {/* Added visible icon */}
        </button>
        <div className={`collapse ${isOpen ? 'show' : ''} d-md-block`} id="sidebarMenu">
          <ul className="nav flex-column">
            {/* <li className="nav-item">
              <Link className="nav-link" href="/dashboard/partner">
                <i className="fas fa-handshake-angle me-2"></i>
                Partner Dashboard
              </Link>
            </li> */}
            <li className="nav-item">
              <Link href="/dashboard/business" className="nav-link"  onClick={() => handleLinkClick("Club Dashboard")}>
                <i className="fas fa-table-columns me-2"></i>
                Club Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/dashboard/deals" className="nav-link"  onClick={() => handleLinkClick("Manage Deals")}>
                <i className="fas fa-tags me-2"></i>
                Manage Deals
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/dashboard/redemptions" className="nav-link"  onClick={() => handleLinkClick("Redemptionss")}>
                <i className="fas fa-receipt me-2"></i>
                Redemptions
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/dashboard/credit" className="nav-link"  onClick={() => handleLinkClick("Access Credit")}>
                <i className="fas fa-credit-card me-2"></i>
                Access Credit
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;

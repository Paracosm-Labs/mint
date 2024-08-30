'use client'
import Link from 'next/link';
import React from 'react';
import {useAuth} from "@/lib/AuthContext";
import { getAddress, signUsingWallet, verifyWallet } from '@/lib/wallet';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import login from "@/lib/login";

function Header() {
  const { isAuthenticated } = useAuth();
  const { setIsAuthenticated, setJwtToken } = useAuth();
  const router = useRouter();

  const postLogin = (auth) => {
    setIsAuthenticated(true);
    setJwtToken(auth);
    router.push('/dashboard/business', { scroll: false })    
  }

  const handleLoginClick = () => {
    login(postLogin)
  } 

  const handleLogoutClick = () => {
    setIsAuthenticated(false);
    setJwtToken(null);
    router.push('/', { scroll: false })
  }

  const getMenuEntries = ()=>{
    if(isAuthenticated){
      return (
        <ul className="navbar-nav ms-auto">
        <li className="nav-item"><Link className="nav-link text-white" href="/explore">Explore Clubs</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" href="/myclubs">My Clubs</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" href="/dashboard/business">Dashboard</Link></li>
        <li className="nav-item"><Button className="nav-link text-white" onClick={handleLogoutClick}>Logout</Button></li>
      </ul>
      )
    }
    return (
      <ul className="navbar-nav ms-auto">
      <li className="nav-item"><Link className="nav-link text-white" href="/explore">Explore Clubs</Link></li>
      <li className="nav-item"><Link className="nav-link text-white" href="/myclubs">My Clubs</Link></li>
      <li className="nav-item"><Button className="nav-link text-white" onClick={handleLoginClick}>Login</Button></li>
    </ul>
    )
  }
  return (
    <header className="mintdeals navbar navbar-expand-lg navbar-light bg-mintdeals">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" href="/">MintDeals</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {getMenuEntries()}
        </div>
      </div>
    </header>
  );
}

export default Header;
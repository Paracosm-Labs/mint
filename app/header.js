"use client";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { getAddress, signUsingWallet, verifyWallet } from "@/lib/wallet";
import { Button } from "react-bootstrap";
import { redirect, useRouter } from "next/navigation";
import login from "@/lib/login";

function Header() {
  const { isAuthenticated } = useAuth();
  const { setIsAuthenticated, setJwtToken, setData } = useAuth();
  const router = useRouter();

  const postLogin = async (auth, data) => {
    setData(data);
    setIsAuthenticated(true);
    setJwtToken(auth);
    router.push("/dashboard/business", { scroll: false });
  };

  const handleLoginClick = () => {
    try {
      login(postLogin);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleLogoutClick = () => {
    console.log("logging out");

    setIsAuthenticated(false);
    setJwtToken(null);
    redirect("/");
    // router.push('/', { scroll: false })
  };

  const getMenuEntries = () => {
    if (isAuthenticated) {
      return (
        <ul className="navbar-nav ms-auto nav">
          <li className="nav-item">
            <Link className="nav-link" href="/explore">
              Explore Clubs
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/myclubs">
              My Clubs
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/dashboard/business">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Button className="btn btn-kmint-blue" onClick={handleLogoutClick}>
              Logout
            </Button>
          </li>
        </ul>
      );
    }
    return (
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <Link className="nav-link" href="/explore">
            Explore Clubs
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/myclubs">
            My Clubs
          </Link>
        </li>
        <li className="">
          <Button className="btn btn-mint" onClick={handleLoginClick}>
            Login
          </Button>
        </li>
      </ul>
    );
  };
  return (
    <header className="mintdeals navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">
          MintDeals
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
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

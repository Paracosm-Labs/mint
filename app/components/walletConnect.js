import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const WalletConnect = ({ handleBusinessLogin, handleBusinessLogout }) => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [isTronLinkConnected, setIsTronLinkConnected] = useState(false);
  const [tronAddress, setTronAddress] = useState(null);
  const router = useRouter();

  // TronLink connection handler
  const connectTronLink = async () => {
    try {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const address = window.tronWeb.defaultAddress.base58;
        setTronAddress(address);
        setIsTronLinkConnected(true);
      } else {
        alert("Please install TronLink to connect your wallet.");
      }
    } catch (error) {
      console.error("Error connecting TronLink:", error);
    }
  };

  // Manage logout with effect to avoid rendering conflicts
  useEffect(() => {
    const handleLogout = () => {
      if (!isAuthenticated) {
        // If not authenticated, redirect to home
        router.push("/", { scroll: false });
      }
    };
    handleLogout();
  }, [isAuthenticated, router]);

  const handleLogoutClick = () => {
    try {
      console.log("logging out");
      setIsAuthenticated(false); // This will trigger the useEffect to handle navigation
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getButtonText = () => {
    if (isAuthenticated) {
      return "Logout";
    }
    if (isTronLinkConnected) {
      return `Connected: ${tronAddress.slice(0, 4)}...${tronAddress.slice(-4)}`;
    }
    return "Login";
  };

  const handleButtonClick = () => {
    if (isAuthenticated) {
      handleLogoutClick();
    } else if (isTronLinkConnected) {
      alert("Wallet is connected, but you're not logged in as a business user.");
    } else {
      handleBusinessLogin().then(() => {
        connectTronLink(); // Connect TronLink after business login
      });
    }
  };

  useEffect(() => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      setTronAddress(window.tronWeb.defaultAddress.base58);
      setIsTronLinkConnected(true);
    }
  }, []);

  return (
    <Button
      className={
        isAuthenticated
          ? "btn btn-kmint"
          : isTronLinkConnected
          ? "btn btn-success"
          : "btn btn-kmint-blue"
      }
      onClick={handleButtonClick}
    >
      {getButtonText()}
    </Button>
  );
};

export default WalletConnect;

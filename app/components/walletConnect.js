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

  const handleLogoutClick = () => {
    handleBusinessLogout();
    setIsTronLinkConnected(false);
    setTronAddress(null);
    setIsAuthenticated(false);
    router.push("/", { scroll: false });
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
      handleBusinessLogin();
      connectTronLink(); // Also try to connect TronLink
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

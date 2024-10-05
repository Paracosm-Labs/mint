// components/walletConnect.js
import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { verifyWallet } from "@/lib/wallet";

const WalletConnect = ({ handleBusinessLogin }) => {
  const { isAuthenticated, setIsAuthenticated, setJwtToken, setData } = useAuth();
  const [isTronLinkConnected, setIsTronLinkConnected] = useState(false);
  const [tronAddress, setTronAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const router = useRouter();

  // TronLink connection handler
  const connectTronLink = async () => {
    try {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const address = window.tronWeb.defaultAddress.base58;
        setTronAddress(address);
        setIsTronLinkConnected(true);
        setShowModal(false);
      } else {
        return; //alert("Please install TronLink to connect your wallet.");
      }
    } catch (error) {
      console.error("Error connecting TronLink:", error);
    }
  };

  // Manage logout explicitly within the handler
  const handleLogoutClick = () => {
    try {
      console.log("logging out");
      setIsAuthenticated(false);
      setJwtToken(null);
      setData(null);

      // Delay the redirection to give time for state change
      setTimeout(() => {
        router.push("/explore");
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getButtonText = () => {
    if (loading) {
      return (<><Spinner animation="border" size="sm" />&nbsp;Connecting...</>); // Show spinner while loading
    }
    if (isAuthenticated) {
      return "Logout";
    }
    if (isTronLinkConnected) {
      return `Connected: ${tronAddress.slice(0, 4)}...${tronAddress.slice(-4)}`;
    }
    return "Login";
  };

  const handleButtonClick = async () => {
    await connectTronLink(); // Connect TronLink after business login
    if (loading) return; // Prevent further clicks while loading
    
    if (isAuthenticated) {
      handleLogoutClick();
    } else if (isTronLinkConnected) {
      setShowModal(true); // Show modal for business login
    } else {
      setLoading(true); // Set loading to true
      await handleBusinessLogin();
      await connectTronLink(); // Connect TronLink after business login
      setLoading(false); // Reset loading to false
    }
  };

  // Check TronLink connection when the component mounts
  useEffect(() => {
    
    
    async function checkTronLinkConnection() {
      const address = await verifyWallet();
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        setTronAddress(window.tronWeb.defaultAddress.base58);
        setIsTronLinkConnected(true);
      }
    }
    checkTronLinkConnection();

  }, []);

  // Handle modal close
  const handleCloseModal = () => setShowModal(false);

  const handleBusinessLoginWithClose = async (e) => {
    e.preventDefault(); // Prevent default action
    setLoading(true); // Set loading to true
    await handleBusinessLogin();
    setShowModal(false); // Close the modal
    setLoading(false); // Reset loading to false
  };

  return (
    <>
      <Button
        className={
          isAuthenticated
            ? "btn btn-kmint"
            : isTronLinkConnected
            ? "btn btn-success"
            : "btn btn-kmint-blue"
        }
        onClick={handleButtonClick}
        disabled={loading} // Disable button while loading
      >
        {getButtonText()}
      </Button>

      {/* Modal for Business Login */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Business Login</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>You are connected to your wallet.<br />Please log in as a business user.</p>
          <Button onClick={handleBusinessLoginWithClose} className="btn-kmint-blue" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Business Login"}
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WalletConnect;

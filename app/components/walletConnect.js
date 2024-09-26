// components/walletConnect.js
import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const WalletConnect = ({ handleBusinessLogin }) => {
  const { isAuthenticated, setIsAuthenticated, setJwtToken, setData  } = useAuth();
  const [isTronLinkConnected, setIsTronLinkConnected] = useState(false);
  const [tronAddress, setTronAddress] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
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
        alert("Please install TronLink to connect your wallet.");
      }
    } catch (error) {
      console.error("Error connecting TronLink:", error);
    }
  };

  // Manage logout explicitly within the handler
  const handleLogoutClick = () => {
    try {
      console.log("logging out");
      setIsAuthenticated(false); // Set auth state to false
      setJwtToken(null);
      setData(null);
  
      // Delay the redirection to give time for state change
      setTimeout(() => {
        router.push("/explore"); // Redirect after logout
      }, 100); // Small delay (100ms)
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
      // Show modal for business login
      setShowModal(true);
    } else {
      handleBusinessLogin().then(() => {
        connectTronLink(); // Connect TronLink after business login
      });
    }
  };

  // Check TronLink connection when the component mounts
  useEffect(() => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      setTronAddress(window.tronWeb.defaultAddress.base58);
      setIsTronLinkConnected(true);
    }
  }, []);

  // Handle modal close
  const handleCloseModal = () => setShowModal(false);

  const handleBusinessLoginWithClose = (e) => {
    e.preventDefault(); // Prevent default action
    handleBusinessLogin();
    setShowModal(false); // Close the modal
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
      >
        {getButtonText()}
      </Button>

      {/* Modal for Business Login */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Business Login</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>You are connected to your wallet.<br/>Please log in as a business user.</p>
          <Button onClick={handleBusinessLoginWithClose} className="btn-kmint-blue">
            Business Login
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WalletConnect;

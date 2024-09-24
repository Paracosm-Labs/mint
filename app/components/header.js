// "use client";
// import Link from "next/link";
// import React, { useState } from "react";
// import { useAuth } from "@/lib/AuthContext";
// import { Button } from "react-bootstrap";
// import { useRouter } from "next/navigation";
// import login from "@/lib/login";

// function Header() {
//   const { isAuthenticated } = useAuth();
//   const { setIsAuthenticated, setJwtToken, setData } = useAuth();
//   const [isOpen, setIsOpen] = useState(false); // State for toggling
//   const router = useRouter();

//   const postLogin = async (auth, data) => {
//     setData(data);
//     setIsAuthenticated(true);
//     setJwtToken(auth);
//     router.push("/dashboard/business", { scroll: false });
//   };

//   const handleLoginClick = () => {
//     try {
//       login(postLogin);
//     } catch (error) {
//       console.error(error);
//       alert(error);
//     }
//   };

//   const handleLogoutClick = () => {
//     console.log("logging out");
//     setIsAuthenticated(false);
//     setJwtToken(null);
//     router.push("/", { scroll: false });
//   };

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const getMenuEntries = () => {
//     if (isAuthenticated) {
//       return (
//         <ul className="navbar-nav ms-auto nav">
//           <li className="nav-item">
//             <Link className="nav-link" href="/explore">
//               Explore Clubs
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" href="/myclubs">
//               My Clubs
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" href="/dashboard/business">
//               Dashboard
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Button className="btn btn-kmint-blue" onClick={handleLogoutClick}>
//               Logout
//             </Button>
//           </li>
//         </ul>
//       );
//     }
//     return (
//       <ul className="navbar-nav ms-auto">
//         <li className="nav-item">
//           <Link className="nav-link" href="/explore">
//             Explore Clubs
//           </Link>
//         </li>
//         <li className="nav-item">
//           <Link className="nav-link" href="/myclubs">
//             My Clubs
//           </Link>
//         </li>
//         <li className="">
//           <Button className="btn btn-mint" onClick={handleLoginClick}>
//             Business Login
//           </Button>
//         </li>
//       </ul>
//     );
//   };

//   return (
//     <header className="mintdeals navbar navbar-expand-lg navbar-dark">
//       <div className="container">
//         <Link className="navbar-brand" href="/">
//           MintDeals
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           onClick={toggleMenu}
//         >
//           <span className="mt-3 navbar-toggler-icon">&#9776;</span>
//         </button>
//         <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
//           {getMenuEntries()}
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import login from "@/lib/login";
import WalletConnect from "./walletConnect"; // Import WalletConnect
import Image from "next/image";

function Header() {
  const { isAuthenticated } = useAuth();
  const { setIsAuthenticated, setJwtToken, setData } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // State for toggling
  const router = useRouter();

  const postLogin = async (auth, data) => {
    setData(data);
    setIsAuthenticated(true);
    setJwtToken(auth);
    router.push("/dashboard/business", { scroll: false });
  };

  const handleBusinessLogin = () => {
    try {
      login(postLogin);
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
    setIsOpen(!isOpen);
  };

  const getMenuEntries = () => {
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
        {isAuthenticated ? (<>
        <li className="nav-item me-2">
          <Link className="nav-link" href="/dashboard/business">
            Dashboard
          </Link>
        </li>
        </>):(<></>)
        }
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
          MintDeals
        </Link>
        <button className="navbar-toggler" type="button" onClick={toggleMenu}>
          <span className="mt-3 navbar-toggler-icon">&#9776;</span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          {getMenuEntries()}
        </div>
      </div>
    </header>
  );
}

export default Header;

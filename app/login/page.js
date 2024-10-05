// login/page.js
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import login from "@/lib/login";
import Image from "next/image";

const Login = () => {
  const { setIsAuthenticated, setJwtToken, setData } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postLogin = (auth, data) => {
    try {
      setData(data);
      setIsAuthenticated(true);
      setJwtToken(auth);
      // localStorage.setItem("isAuthenticated", true);
      // localStorage.setItem("jwtToken", auth);
      // localStorage.setItem("data", JSON.stringify(data));
      router.push("/dashboard/business", { scroll: false });
    } catch (error) {
      console.error("Error during postLogin: ", error);
    } finally {
      setLoading(false); // Reset loading state after login completes
    }
  };
  
  const handleLoginClick = async () => {
    setLoading(true);
    try {
      await login(postLogin, router);
      setLoading(false);
    } catch (error) {
      console.error("Login failed or TronLink cancelled: ", error);
      setLoading(false);
    }
  };

  return (<>
      <div className="kmint container">
        <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4 text-center">
          <Image src="/logo192.png" height={192} width={192} alt="MintDeals Logo"/>
        <p className="h3 mt-5 my-3 fw-normal">Welcome to MintDeals</p>
        <p className="mb-3 text-body-secondary">
          Remember to Login to Tronlink before proceeding!
        </p>
          <button
              className="btn btn-kmint-blue w-100 py-2"
              type="button"
              onClick={handleLoginClick}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Processing...</span>
                </div>
              ) : (
                "Business Login"
              )}
            </button>
        </div>
        <div className="col-md-4"></div>
        </div>
      </div>

    </>
  );
};

export default Login;

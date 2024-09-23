"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import login from "@/lib/login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { setIsAuthenticated, setJwtToken, setData } = useAuth();
  const router = useRouter();

  const postLogin = (auth, data) => {
    setData(data);
    setIsAuthenticated(true);
    setJwtToken(auth);
    router.push("/dashboard/business", { scroll: false });
  };
  const handleLoginClick = () => {
    login(postLogin);
  };
  return (
    <main className="d-flex align-items-center py-2 form-signin w-100 m-auto">
      <div className="kmint container">
        <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4 text-center">
          <img src="/logo192.png" height="192px"/>
        <p className="h3 mt-5 my-3 fw-normal">Welcome to MintDeals</p>
        <p className="mb-3 text-body-secondary">
          Remember to Login to Tronlink before proceeding!
        </p>
        <button
          className="btn btn-kmint-blue w-100 py-2"
          type="button"
          onClick={handleLoginClick}
        >
          Business Login
        </button>
        </div>
        <div className="col-md-4"></div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
        />
    </main>
  );
};

export default Login;

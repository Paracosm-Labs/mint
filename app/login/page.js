"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import login from "@/lib/login";

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
    <main className="d-flex align-items-center py-4 form-signin w-100 m-auto">
      <div>
        <p className="h3 my-3 fw-normal">Welcome to MintDeals</p>
        <p className="mb-3 text-body-secondary">
          Remember to Login to Tronlink before proceeding!
        </p>
        <button
          className="btn btn-primary w-100 py-2"
          type="button"
          onClick={handleLoginClick}
        >
          Log in
        </button>
      </div>
    </main>
  );
};

export default Login;

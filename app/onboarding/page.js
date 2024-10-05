"use client";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";

const Onboarding = () => {
  useEffect(() => {
    redirect("/login");
  }, []);
  return <div className="kmint container"></div>;
};

export default Onboarding;

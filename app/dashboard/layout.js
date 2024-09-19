"use client";
import Sidebar from "../components/sidebar";
import { useAuth } from "@/lib/AuthContext";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { isAuthenticated, jwtToken, setData } = useAuth();
  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="kmint container-fluid">
      <div className="row">
        <Sidebar />
        {children}
        <div className="col-md-3"></div>
      </div>
    </div>
  );
}

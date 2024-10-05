"use client";
import { useEffect } from 'react';
import Sidebar from "../components/sidebar";
import { useAuth } from "@/lib/AuthContext";
import { redirect } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  checkNetwork,
  monitorNetwork,
  stopNetworkMonitor,
} from "@/lib/network";
import {useRouter} from 'next/navigation';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, jwtToken, setData } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    redirect("/login");
  }

    useEffect(() => {
      const container = document.querySelector('.kmint.container');
      if (container) {
        container.classList.add('fade-up');
      }
    }, []);

    const handleWrongNetwork = () => {
      toast.error(
        `Please switch to the ${process.env.NEXT_PUBLIC_TRON_NETWORK_NAME} network to continue.`
      );
      router.push("/login");
    };

    useEffect(() => {
      checkNetwork(() => {}, handleWrongNetwork);
      monitorNetwork(() => {}, handleWrongNetwork);
      return () => {
        stopNetworkMonitor();
      };
    }, []);

  return (
    <div className="kmint container mt-4">
      <div className="row">
        <Sidebar />
        {children}
        <div className="col-md-3"></div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
        />
    </div>
  );
}

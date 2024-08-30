'use client'
import Sidebar from "../components/sidebar";
import {useAuth} from "@/lib/AuthContext";
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation'

export default function DashboardLayout({
    children, // will be a page or nested layout
  }) {

    const { isAuthenticated } = useAuth();
    const router = useRouter();
    if(!isAuthenticated){
    //   router.push('/', { scroll: false })
      redirect('/login')
      return (<></>)
    }

    return (
        <div className="kmint container-fluid">
            <div className="row">
                <Sidebar />
                {children}
                <div className='col-md-3'></div>
            </div>
        </div>
    )
  }
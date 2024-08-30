'use client'
import React, { useState } from 'react';
import RedemptionsTable from '../../components/redemptionsTable';
import NewRedemptionModal from '../../components/newRedemptionModal';
import {useAuth} from "@/lib/AuthContext";
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation'

function Redemptions() {
  const [showModal, setShowModal] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  if(!isAuthenticated){
    router.push('/', { scroll: false })
    // redirect('/login')
    return (<></>)
  }  

  const handleNewRedemption = () => {
    setShowModal(true);
  };

  return (
      <main className="kmint col-md-6 ms-sm-auto col-lg-6 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Redemptions</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            {/* <button type="button" className="btn btn-md btn-outline-secondary me-2">
              Export CSV
            </button> */}
            {/* <button type="button" className="btn btn-md btn-kmint-blue" onClick={handleNewRedemption}>
              New Redemption
            </button> */}
          </div>
        </div>
        <RedemptionsTable />
        {/* <NewRedemptionModal show={showModal} onHide={() => setShowModal(false)} /> */}
      </main>
  );
}

export default Redemptions;
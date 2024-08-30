'use client'
import React, { useState } from 'react'
import StepIndicator from "./stepIndicator"
import BusinessInfo from './businessInfo';
import CreateClub from './createClub';
import CreateDeal from './createDeal';
import DashboardTour from './dashboardTour';
import { useRouter } from 'next/navigation';

import {useAuth} from "@/lib/AuthContext";

import {verifyWallet, signUsingWallet} from "@/lib/wallet";
import { businessOnboardingMsg } from '@/utils/messageForSign';



const BusinessOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessData, setBusinessData] = useState({});
  const [err, setErr] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const router = useRouter();

  const { setIsAuthenticated, setJwtToken } = useAuth();


  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleDataUpdate = (section,data) => {
    businessData[section] = data;
    setBusinessData(businessData);
  };

  const showError = () => {
    switch (err) {
      case 0:
        return <></>
      case 1:
          return (<div class="alert alert-danger" role="alert">{errMsg}</div>)           
      default:
        break;
    }
  }




  const save = async (signature) => {
    const response = await fetch('/api/business/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({sign : signature, ...businessData}),
    });
    if(response.status == 200){
      const resJson = await response.json();
      return resJson.auth;
    }
    return null;
  }



  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInfo onNext={nextStep} onDataUpdate={handleDataUpdate} />;
      case 2:
        return <CreateClub onNext={nextStep} onPrev={prevStep} onDataUpdate={handleDataUpdate} />;
      case 3:
        return <CreateDeal onNext={nextStep} onPrev={prevStep} onDataUpdate={handleDataUpdate} />;
      case 4:
        return (
          <DashboardTour 
            onComplete={() => {
              console.log('Onboarding completed');
              console.log(businessData);
              
              verifyWallet().then(res => {
                if(!res || res.length == 0){
                  setErr(1);
                  setErrMsg("Please install or login to Tronlink to proceed.");
                  return;
                }
                if(res.code != 200){
                  setErr(2);
                  setErrMsg(res.message);
                  return;
                }
                setErr(0);
                setErrMsg("");

                signUsingWallet(businessOnboardingMsg)
                .then(signature => save(signature)
                .then((auth) => {
                  setIsAuthenticated(true);
                  setJwtToken(auth);
                  router.push('/dashboard/business', { scroll: false })
                }))
              })
            }} 
            onPrev={prevStep} 
          />
        );
      default:
        return <BusinessInfo onNext={nextStep} onDataUpdate={handleDataUpdate} />;
    }
  };

  return (
    <div className="kmint container onboarding-container">
      <div className='row'>
        <div className='col-2'></div>
        <div className='col-8'>
          <h1 className="text-center mb-4">Boost Your Business with MintDeals!</h1>
          <p className="text-center mb-4">Join our platform and start offering amazing deals to your customers.<br/>
          As your customers redeem your deals, you gain access to a growing credit line.</p>
          <StepIndicator currentStep={currentStep} />
          <div className="card">
            <div className="card-body">
              {renderStep()}
            </div>
          </div>
          {showError()}
        </div>
        <div className='col-2'></div>
      </div>
    </div>
  )
}

export default BusinessOnboarding

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
import ClubDealRegistryABI from "@/abi/ClubDealsRegistry.js";
import { USDDAddress, clubDealRegistryAddress } from '@/lib/address';


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
      // case 3:
      //   return (<div class="alert alert-danger" role="alert">{errMsg}</div>)                   
      default:
        return (<div class="alert alert-danger" role="alert">{errMsg}</div>) 
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

    const resJson = await response.json();
    if(response.status == 200){
      return resJson.auth;
    }
    if(response.status != 200){
      setErr(3);
      setErrMsg(resJson.error);
      return null;
    }
  }

  const createClubOnChain = async (paymentTokenAddress, membershipFee, sendToCreditFacility, abi, contractAddress) => {
    try {
      const contract = await tronWeb.contract(abi, contractAddress);
      const result = await contract.createClub(paymentTokenAddress, membershipFee, sendToCreditFacility).send({
        feeLimit: 1000000000, 
        callValue: 0,         
      });
      console.log('Transaction Result:', result);
      return result; 
    } catch (error) {
      console.error('Error creating club:', error);
      throw error;
    }
  };
  

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInfo onNext={nextStep} onDataUpdate={handleDataUpdate} />;
      case 2:
        return <CreateClub onNext={nextStep} onPrev={prevStep} onDataUpdate={handleDataUpdate} />;
      case 3:
      //   return <CreateDeal onNext={nextStep} onPrev={prevStep} onDataUpdate={handleDataUpdate} />;
      // case 4:
        return (
          <DashboardTour 
            onComplete={() => {
              console.log('Onboarding completion started');
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

                createClubOnChain(USDDAddress, businessData.clubInfo.membershipFee, true, ClubDealRegistryABI, clubDealRegistryAddress).then(txID => {
                  signUsingWallet(businessOnboardingMsg)
                  .then(signature => save(signature)
                  .then((auth) => {
                    if(auth){
                      setIsAuthenticated(true);
                      setJwtToken(auth);
                      console.log('Onboarding completed successfully');
                      router.push('/dashboard/business', { scroll: false })
                    }
                  }))
                })


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

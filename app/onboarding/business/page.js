"use client";
import React, { useEffect, useState } from "react";
import StepIndicator from "./stepIndicator";
import BusinessInfo from "./businessInfo";
import CreateClub from "./createClub";
import CreateDeal from "./createDeal";
import OnboardSummary from "./onboardSummary";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/AuthContext";

import { verifyWallet, signUsingWallet, getAddress } from "@/lib/wallet";
import { businessOnboardingMsg } from "@/utils/messageForSign";
import ClubDealRegistryABI from "@/abi/ClubDealsRegistry.js";
import { USDDAddress, USDTAddress } from "@/lib/address";
import { createClubOnChain } from "@/lib/club";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { checkUserExists } from "@/lib/user";
import {
  checkNetwork,
  monitorNetwork,
  stopNetworkMonitor,
} from "@/lib/network";

const BusinessOnboarding = () => {
  const [userExists, setUserExists] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [businessData, setBusinessData] = useState({
    businessInfo: {
      name: "",
      email: "",
      industry: "",
      country: "",
    },
    clubInfo: {
      type: "essential",
      name: "",
      description: "",
      image: "",
      membershipFee: "",
    },
  });

  const [err, setErr] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const router = useRouter();

  const { setIsAuthenticated, setJwtToken } = useAuth();

  const loginIfBusinessOwner = async () => {
    let res = await verifyWallet();
    if (!res || res.length === 0) {
      alert("Please install or login to Tronlink to proceed.");
      return;
    }
    if (res.code !== 200) {
      alert(res.message);
      return;
    }

    let address = await getAddress();
    const exists = await checkUserExists(address);
    if (exists) {
      router.push("/login", {
        scroll: false,
      });
    }
  };

  const handleWrongNetwork = () => {
    toast.error(
      `Please switch to the ${process.env.NEXT_PUBLIC_TRON_NETWORK_NAME} network to continue.`
    );
    router.push("/", {
      scroll: false,
    });
  };

  useEffect(() => {
    checkNetwork(() => {
      if (typeof window !== "undefined") {
        loginIfBusinessOwner();
      }
    }, handleWrongNetwork);
    monitorNetwork(() => {
      if (typeof window !== "undefined") {
        loginIfBusinessOwner();
      }
    }, handleWrongNetwork);
    return () => {
      stopNetworkMonitor();
    };
  }, []);

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleDataUpdate = (section, data) => {
    setBusinessData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        ...data,
      },
    }));
  };

  const showError = () => {
    if (!errMsg) return <></>;
    switch (err) {
      case 0:
        return <></>;
      case 1:
        return (
          <div className="alert alert-danger" role="alert">
            {errMsg}
          </div>
        );
      // case 3:
      //   return (<div className="alert alert-danger" role="alert">{errMsg}</div>)
      default:
        return (
          <div className="alert alert-danger" role="alert">
            {errMsg}
          </div>
        );
        break;
    }
  };

  const save = async (signature, txID) => {
    if (!txID) {
      throw Error("txID is null");
    }
    const response = await fetch("/api/business/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sign: signature,
        txID: txID,
        ...businessData,
      }),
    });

    const resJson = await response.json();
    if (response.status == 200) {
      return resJson.auth;
    }
    if (response.status != 200) {
      setErr(3);
      setErrMsg(resJson.error);
      return null;
    }
  };

  const complete = async (selectedCurrency) => {
    try {
      let verifyWalletResponse = await verifyWallet();
      if (!verifyWalletResponse || verifyWalletResponse.length === 0) {
        setErr(1);
        setErrMsg("Please install or login to Tronlink to proceed.");
        return;
      }
      if (verifyWalletResponse.code !== 200) {
        setErr(2);
        setErrMsg(verifyWalletResponse.message);
        return;
      }

      const currencyAddress =
        selectedCurrency === "USDT" ? USDTAddress : USDDAddress;
      const tokenDecimals = selectedCurrency === "USDT" ? 6 : 18;

      // Validate membership fee
      if (!businessData.clubInfo.membershipFee) {
        setErr(3);
        setErrMsg("Membership fee is not set.");
        return;
      }

      console.log("membership fee:", businessData.clubInfo.membershipFee);
      let txID = await createClubOnChain(
        currencyAddress,
        businessData.clubInfo.membershipFee,
        true,
        tokenDecimals
      );

      let signature = await signUsingWallet(businessOnboardingMsg);

      let auth = await save(signature, txID);

      if (auth) {
        // setIsAuthenticated(true);
        // setJwtToken(auth);
        toast.success(
          "Onboarding completed successfully! Welcome to MintDeals!"
        );
        setTimeout(() => {
          router.push("/login", { scroll: false });
        }, 1000);
      } else {
        setErr(3);
        setErrMsg("Something went wrong. Please try again.");
        throw Error("save failed.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessInfo
            onNext={nextStep}
            onDataUpdate={handleDataUpdate}
            data={businessData.businessInfo}
          />
        );
      case 2:
        return (
          <CreateClub
            onNext={nextStep}
            onPrev={prevStep}
            onDataUpdate={handleDataUpdate}
            data={businessData.clubInfo}
          />
        );
      case 3:
        //   return <CreateDeal onNext={nextStep} onPrev={prevStep} onDataUpdate={handleDataUpdate} />;
        // case 4:
        return (
          <OnboardSummary
            onComplete={complete}
            onPrev={prevStep}
            businessInfo={businessData.businessInfo}
            clubInfo={businessData.clubInfo}
          />
        );
      default:
        return (
          <BusinessInfo
            onNext={nextStep}
            onDataUpdate={handleDataUpdate}
            data={businessData.clubInfo}
          />
        );
    }
  };

  return (
    <div className="kmint container mt-2">
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">
          <h1 className="text-center mb-4">
            Boost Your Business with MintDeals!
          </h1>
          <p className="text-center mb-4">
            Join our platform and start offering amazing deals to your
            customers.
            <br />
            As your customers join your club and redeem your deals, you gain
            access to a growing credit line.
          </p>
          <StepIndicator currentStep={currentStep} />
          <div className="card">
            <div className="card-body">{renderStep()}</div>
          </div>
          {showError()}
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default BusinessOnboarding;

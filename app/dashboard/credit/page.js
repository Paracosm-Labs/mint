// // app/credit/page.js
// "use client";
// import { useState, useEffect } from "react";
// import CreditSummary from "../../components/creditSummary";
// import CreditUsageHistory from "../../components/creditUsageHistory";
// import BorrowModal from "../../components/borrowModal";
// import RepayModal from "../../components/repayModal";

// const CreditPage = () => {
//   const [showBorrowModal, setShowBorrowModal] = useState(false);
//   const [showRepayModal, setShowRepayModal] = useState(false);
//   const [refresh, setRefresh] = useState(false); // Add a refresh state

//   const handleBorrowClick = () => {
//     setShowBorrowModal(true);
//   };

//   const handleCloseBorrowModal = () => {
//     setShowBorrowModal(false);
//   };

//   const handleRepayClick = () => {
//     setShowRepayModal(true);
//   };

//   const handleCloseRepayModal = () => {
//     setShowRepayModal(false);
//   };

//   const handleSuccess = () => {
//     setRefresh(!refresh); // Toggle to trigger a refresh
//   };

//   // Auto refresh every 60 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRefresh((prevRefresh) => !prevRefresh);
//     }, 60000); // 60 seconds

//     return () => clearInterval(interval); // Clean up on unmount
//   }, []);

//   return (
//     <main className="col-md-10 ms-sm-auto col-lg-10 px-md-4">
//       <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3">
//         <div className="col-md-7 col-sm-12">
//           <h2>Credit Facility</h2>
//           <p>
//             Manage your business credit easily: borrow funds, make repayments and
//             track your credit history—all in one place.
//           </p>
//         </div>
//         <div className="col-md-5 col-sm-12 text-end">
//           <button
//             type="button"
//             className="btn btn-md btn-outline-secondary me-2"
//             onClick={handleRepayClick}
//           >
//             Make Repayment
//           </button>
//           <button
//             type="button"
//             className="btn btn-md btn-success mt-3 mb-3  mx-3"
//             onClick={handleBorrowClick}
//           >
//             Borrow Now
//           </button>
//         </div>
//       </div>
//       <hr/>
//       <div className="col-md-12">
//         <CreditSummary refresh={refresh} /> {/* Pass refresh state */}
//         <CreditUsageHistory refresh={refresh} />
//       </div>

//       {/* Borrow and Repay Modals */}
//       <RepayModal
//         show={showRepayModal}
//         onHide={handleCloseRepayModal}
//         onSuccess={handleSuccess}
//         outstandingDebt={300}
//       />
//       <BorrowModal
//         show={showBorrowModal}
//         onHide={handleCloseBorrowModal}
//         onSuccess={handleSuccess}
//         availableCredit={50000}
//       />
//     </main>
//   );
// };

// export default CreditPage;


// app/credit/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import CreditSummary from "../../components/creditSummary";
import CreditUsageHistory from "../../components/creditUsageHistory";
import BorrowModal from "../../components/borrowModal";
import RepayModal from "../../components/repayModal";
import { creditManager } from "@/contracts/CreditManager";
import { creditFacility } from "@/contracts/CreditFacility";
import { cToken } from "@/contracts/CToken";

const blockTimeSeconds = 3; // Tron blocktime
const secondsPerYear = 365 * 24 * 60 * 60;

const CreditPage = () => {
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [refresh, setRefresh] = useState(false); // Add a refresh state
  const [basicCreditInfo, setBasicCreditInfo] = useState({
    limit: 0,
    used: 0,
    interestRate: 0,
  });
  const [sharedCreditInfo, setSharedCreditInfo] = useState({
    score: 0,
    limit: 0,
    used: 0,
    interestRate: 0,
    title: "Shared Credit",
  });

  const userAddress = window.tronWeb.defaultAddress.base58;

  const calculateAPY = async () => {
    try {
      const cTokenContract = await cToken();
      const borrowRatePerBlock = await cTokenContract.getBorrowRatePerBlock();
      const borrowRatePerBlockNumber = parseInt(borrowRatePerBlock, 10);
      return (
        ((1 + borrowRatePerBlockNumber / 1e18) ** (secondsPerYear / blockTimeSeconds) - 1) * 100
      );
    } catch (error) {
      console.error("Error calculating APY:", error);
      return 0;
    }
  };

  const calculateAdjustedAPY = async (interestDeltaPB) => {
    try {
      const cTokenContract = await cToken();
      const borrowRatePerBlock = await cTokenContract.getBorrowRatePerBlock();
      const borrowRatePerBlockNumber = parseInt(borrowRatePerBlock, 10);
      const interestDeltaPBNumber = parseInt(interestDeltaPB, 10);

      const interestAccrued = borrowRatePerBlockNumber * (1 + interestDeltaPBNumber / 10000);
      return (
        ((1 + interestAccrued / 1e18) ** (secondsPerYear / blockTimeSeconds) - 1) * 100
      );
    } catch (error) {
      console.error("Error calculating adjusted APY:", error);
      return 0;
    }
  };

  const fetchBasicCreditInfo = useCallback(async () => {
    try {
      const creditFacilityContract = await creditFacility();
      const basicLimit = await creditFacilityContract.calculateTotalBorrowingPower(userAddress);
      const basicUsed = await creditFacilityContract.calculateTotalUserStablecoinBorrows(userAddress);
      const apy = await calculateAPY();

      setBasicCreditInfo({
        limit: basicLimit,
        used: basicUsed,
        interestRate: apy.toFixed(2),
      });
    } catch (error) {
      console.error("Error fetching basic credit info:", error);
      setBasicCreditInfo({
        limit: 0,
        used: 0,
        interestRate: 0,
      });
    }
  }, [userAddress]);

  const fetchSharedCreditInfo = useCallback(async () => {
    try {
      const creditManagerContract = await creditManager();
      const creditData = await creditManagerContract.getCreditInfo(userAddress);
      const interestDeltaPB = await creditManagerContract.getInterestDeltaPB();
      const adjustedApy = await calculateAdjustedAPY(interestDeltaPB);

      setSharedCreditInfo({
        score: creditData.score,
        limit: creditData.limit,
        used: creditData.used,
        interestRate: adjustedApy.toFixed(2),
        title: "Shared Credit",
      });
    } catch (error) {
      console.error("Error fetching shared credit info:", error);
      setSharedCreditInfo({
        score: 0,
        limit: 0,
        used: 0,
        interestRate: 0,
      });
    }
  }, [userAddress]);

  useEffect(() => {
    fetchBasicCreditInfo();
    fetchSharedCreditInfo();
  }, [refresh, fetchBasicCreditInfo, fetchSharedCreditInfo]);

  // Calculate available credit and outstanding debt
  const basicAvailableCredit = basicCreditInfo.limit - basicCreditInfo.used;
  const sharedAvailableCredit = sharedCreditInfo.limit - sharedCreditInfo.used;
  const basicOutstandingDebt = basicCreditInfo.used;
  const sharedOutstandingDebt = sharedCreditInfo.used; 

  const handleBorrowClick = () => {
    setShowBorrowModal(true);
  };

  const handleCloseBorrowModal = () => {
    setShowBorrowModal(false);
  };

  const handleRepayClick = () => {
    setShowRepayModal(true);
  };

  const handleCloseRepayModal = () => {
    setShowRepayModal(false);
  };

  const handleSuccess = () => {
    setRefresh(!refresh); // Toggle to trigger a refresh
  };

  // Auto refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((prevRefresh) => !prevRefresh);
    }, 60000); // 60 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <main className="col-md-10 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3">
        <div className="col-md-7 col-sm-12">
          <h2>Access Credit</h2>
          <p>
            Manage your business credit easily: borrow funds, make repayments, and track your credit history—all in one place.
          </p>
        </div>
        <div className="col-md-5 col-sm-12 text-end">
          <button
            type="button"
            className="btn btn-md btn-outline-secondary me-1"
            onClick={handleRepayClick}
          >
            Make Repayment
          </button>

          <button
            type="button"
            className="btn btn-md btn-success mt-3 mb-3 mx-3"
            onClick={handleBorrowClick}
          >
            Borrow Funds
          </button>

        </div>
      </div>
      <hr/>
       <div className="col-md-12">
       <CreditSummary basicCreditInfo={basicCreditInfo} sharedCreditInfo={sharedCreditInfo} />
         <CreditUsageHistory refresh={refresh} />
       </div>


      {/* Modals for borrowing and repaying */}
      <BorrowModal show={showBorrowModal} onHide={handleCloseBorrowModal} onSuccess={handleSuccess} basicAvailableCredit={basicAvailableCredit} sharedAvailableCredit={sharedAvailableCredit} />
      <RepayModal show={showRepayModal} onHide={handleCloseRepayModal} onSuccess={handleSuccess} basicOutstandingDebt={basicOutstandingDebt} sharedOutstandingDebt={sharedOutstandingDebt} />
    </main>
  );
};

export default CreditPage;

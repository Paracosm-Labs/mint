"use client";
import React, { useEffect, useState } from "react";
import Club from "../components/club";
import OffcanvasDeals from "../components/offcanvasDeals";
import MyDealsModal from "../components/myDealsModal";
import { getClubsForMember, getEventTxIDFromClubId } from "@/lib/club";
import { ClipLoader } from "react-spinners";
import EmptyState from '../components/emptyState';
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CustomerClubs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const [purchasedClubs, setPurchasedclubs] = useState([]);

  const [refresh, setRefresh] = useState(0);
  const [refreshCanvas, setRefreshCanvas] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadClubs = async () => {
    setIsLoading(true);  // Set loading to true when starting to fetch data
    try {
      let clubIds = await getClubsForMember();
      let clubTxIDs = new Map();
      console.log(clubIds);
      for (let index = 0; index < clubIds.length; index++) {
        const clubId = clubIds[index];
        let clubTxID = await getEventTxIDFromClubId(clubId);
        clubTxIDs.set(clubTxID, clubId);
      }

      let payload = { clubTxIDs: Array.from(clubTxIDs.keys()) };
      const response = await fetch("/api/club", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resJson = await response.json();
      if (response.status == 200) {
        let clubs = resJson.clubs.map((club) => {
          return {
            _id: club._id,
            image: club.image,
            name: club.name,
            description: club.clubDescription,
            price: null,
            category: club.type,
            country: club.business.country,
            industry: club.business.industry,
            txID: club.txID,
            onChainId: clubTxIDs.get(club.txID),
          };
        });
        setPurchasedclubs(clubs);
        return clubs;
      }
      if (response.status != 200) {
        console.error(resJson.error);
        return null;
      }
    } catch (error) {
      console.error(error);
      // alert(error.message);
      toast.error(`An error has occured. Please install or login to TronLink. ${error.message}`);
    } finally {
      setIsLoading(false);  // Set loading to false when done fetching data
    }
  };

  // Fetch purchased clubs from API or your data source
  useEffect(() => {
    loadClubs();
  }, []);

  const handleViewDeals = (club) => {
    setSelectedClub(club);
    setShowOffcanvas(true);
  };

  const handleViewMyDeals = (club) => {
    setSelectedClub(club);
    setShowModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredClubs = purchasedClubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeModal = () => {
    setShowModal(false);
    setRefresh((prev) => prev + 1);
  };

  // const closeCanvas = () => {
  //   setShowOffcanvas(false);
  //   setRefreshCanvas((prev) => prev + 1);
  // };

  if (isLoading) {
    return (
        <div className="kmint container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // height: '80vh',  // This will make it full screen
        }}>
          <ClipLoader color="#98ff98" size={150} />
        </div>
    );
  }
  
  if (purchasedClubs.length === 0) {
    return (
      <div className="kmint container text-center">
        <EmptyState 
          iconClass="fa-folder-open" 
          message="You haven't joined any clubs, yet."
        />
        <button className="btn btn-mint">
          <Link href="/explore" className="nav-link"><i className="fa fa-search"/>&nbsp;Explore Clubs</Link>
        </button>
      </div>
    );
  }

  return (
    <div className="kmint container text-center">
      <h2>My Clubs</h2>
      <div className="d-flex justify-content-end mb-4">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="input-group" id="search-bar">
            <input
              type="text"
              className="form-control"
              placeholder="Search Clubs"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search Clubs"
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>

      <div className="row">
        {filteredClubs.map((club) => (
          <Club
            club={club}
            key={club.txID}
            handleViewDeals={handleViewDeals}
            handleViewMyDeals={handleViewMyDeals}
          ></Club>
        ))}
      </div>
      <OffcanvasDeals
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        club={selectedClub}
        // key={refreshCanvas}
      />
      <MyDealsModal
        show={showModal}
        onHide={() => closeModal()}
        club={selectedClub}
        key={refresh}
      />
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

export default CustomerClubs;

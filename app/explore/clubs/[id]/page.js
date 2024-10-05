// explore/clubs/[id]/page.js
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  addClubMember,
  getClubDetails,
  isUserClubMember,
  getClubIdFromEvent,
} from "@/lib/club";
import { USDDAddress, USDTAddress } from "@/lib/address";
import { getCountryNameByCode } from "@/utils/countries";
import JoinClubModal from "../../../components/joinClubModal";
import { ClipLoader } from "react-spinners";
import EmptyState from "../../../components/emptyState";
import SocialShare from "../../../components/socialShare";
import { toast } from "react-toastify";
import {
  checkNetwork,
  monitorNetwork,
  stopNetworkMonitor,
} from "@/lib/network";
import {
  monitorAddressChange,
  stopAddressChangeMonitor,
} from "@/lib/addressChange";
import { useRouter } from "next/navigation";

function ClubDetailPage({ params }) {
  const { id } = params;
  const [club, setClub] = useState(null);
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDealsLoading, setIsDealsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State for join modal
  const [selectedCurrency, setSelectedCurrency] = useState("USDT"); // Selected currency for joining
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const handleAddressChange = () => {
    router.push("/");
  };
  useEffect(() => {
    monitorAddressChange(handleAddressChange);
    return () => {
      stopAddressChangeMonitor();
    };
  }, []);

  const fetchClubDetails = async () => {
    if (id) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/club/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch club details");
        }
        const { club: clubData } = await response.json();

        clubData.onChainId = await getClubIdFromEvent(clubData.txID);
        const { membershipFee, memberCount } = await getClubDetails(
          clubData.onChainId
        );
        const isMember = await isUserClubMember(clubData.onChainId);

        setClub({
          ...clubData,
          membershipFee,
          members: memberCount,
          isMember,
          country: getCountryNameByCode(clubData.business.country),
          category: clubData.business.industry,
        });

        await fetchDeals(clubData._id);
      } catch (error) {
        console.error("Failed to fetch club details:", error);
      } finally {
        setIsLoading(false);
      }
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
    checkNetwork(fetchClubDetails, handleWrongNetwork);
    monitorNetwork(fetchClubDetails, handleWrongNetwork);
    return () => {
      stopNetworkMonitor();
    };
  }, []);

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  const fetchDeals = async (clubId) => {
    try {
      setIsDealsLoading(true);
      const response = await fetch(`/api/deal?club=${clubId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch deals");
      }
      const dealsData = await response.json();
      setDeals(dealsData);
    } catch (error) {
      console.error("Failed to fetch deals:", error);
    } finally {
      setIsDealsLoading(false);
    }
  };

  const handleJoinClick = () => {
    setShowModal(true); // Open join modal on button click
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsModalOpen(false);
  };

  const handlePayJoin = async () => {
    if (!club) return;

    const currencyAddress =
      selectedCurrency === "USDT" ? USDTAddress : USDDAddress;
    const tokenDecimals = selectedCurrency === "USDT" ? 6 : 18;

    try {
      const txID = await addClubMember(
        club.onChainId,
        currencyAddress,
        club.membershipFee,
        tokenDecimals
      );
      console.log("txID: ", txID);
      toast.success(`Successfully joined ${club.name}`);
      setShowModal(false);

      // Update club data after successful payment
      const updatedClub = await getClubDetails(club.onChainId);
      const isMember = await isUserClubMember(club.onChainId);

      setClub({
        ...club,
        members: updatedClub.memberCount,
        isMember,
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error(error);
    }
  };

  const handleShareClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  // const clubUrl = ;

  if (isLoading) {
    return (
      <div
        className="kmint container d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <ClipLoader color="#98ff98" size={150} />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="kmint container">
        <EmptyState
          iconClass="fa-exclamation-circle"
          message="Club not found."
        />
      </div>
    );
  }

  return (
    <div className="kmint container">
      <div className="d-flex justify-content-between mb-5">
        <Link href="/explore" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Back to Explore
        </Link>
        <button
          className="btn btn-outline-secondary"
          onClick={handleShareClick}
        >
          <i className="fa-solid fa-share-nodes"></i>&nbsp; Share Club
        </button>
      </div>
      <div className="mb-4">
        <div className="card-body">
          <div className="row g-0">
            <div className="col-md-6">
              <Image
                src={club.image}
                alt={club.name}
                width={500}
                height={250}
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-6">
              <h2 className="card-title mb-3">{club.name}</h2>
              <p className="card-text">{club.description}</p>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">{club.category}</li>
                <li className="list-group-item">{club.country}</li>
                <li className="list-group-item">
                  <strong>
                    {club.members} {club.members === 1 ? "Member" : "Members"}
                  </strong>
                </li>
                <li className="list-group-item">
                  <h3 className="text-success mt-2">${club.membershipFee}</h3>
                </li>
              </ul>
              {club.isMember ? (
                <button className="btn btn-success btn-lg disabled w-100 mt-3">
                  Joined
                </button>
              ) : (
                <button
                  className="btn btn-success btn-lg w-100 mt-3"
                  onClick={handleJoinClick}
                >
                  Join Club
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-4">
        <div className="card-header mt-4">
          <h3 className="card-title text-center">Deals</h3>
        </div>
        <div className="mt-4">
          {isDealsLoading ? (
            <div className="text-center my-5">
              <ClipLoader color="#98ff98" size={50} />
            </div>
          ) : deals.length > 0 ? (
            <div className="deal row g-4">
              {deals.map((deal) => (
                <div key={deal._id} className="col-sm-6 col-md-3">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <Image
                        src={deal.image}
                        alt={deal.description}
                        width={300}
                        height={150}
                        className="card-img-top m-auto rounded mb-3"
                      />
                      <p className="descript">{deal.description}</p>
                      <span className="badge bg-secondary">Deal</span>
                    </div>
                  </div>
                </div>
              ))}

              <JoinClubModal
                show={showModal}
                onHide={handleCloseModal}
                club={club}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                onJoin={handlePayJoin}
              />
            </div>
          ) : (
            <EmptyState
              iconClass="fa-tag"
              message="No deals available for this club."
            />
          )}
        </div>
      </div>
      {isModalOpen && (
        <SocialShare
          clubUrl={`https://mintdeals.vercel.app/explore/clubs/${club._id}`}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ClubDetailPage;

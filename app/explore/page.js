"use client";
import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import {
  addClubMember,
  getClubDetails,
  getClubIdFromEvent,
  isUserClubMember,
} from "@/lib/club";
import { USDDAddress } from "@/lib/address";

function ExploreClubs() {
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [selectedClub, setSelectedClub] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [clubs, setClubs] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Extract unique countries and categories from the clubs data
  const uniqueCountries = [
    "All Countries",
    ...new Set(clubs.map((club) => club.country)),
  ];
  const uniqueCategories = [
    "All Categories",
    ...new Set(clubs.map((club) => club.category)),
  ];

  const load = async () => {
    try {
      const response = await fetch("/api/explore/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let clubs = [];
      let res = await response.json();
      if (res.clubs && res.clubs.length > 0) {
        for (let index = 0; index < res.clubs.length; index++) {
          const club = res.clubs[index];
          if (!club.onChainId) {
            club.onChainId = await getClubIdFromEvent(club.txID);
            club.isMember = await isUserClubMember(club.onChainId);
            let { membershipFee, memberCount } = await getClubDetails(
              club.onChainId
            );
            club.membershipFee = membershipFee;
            club.members = memberCount;
            clubs.push(club);
          }
        }
      }
      return clubs;
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    load().then((clubs) => {
      if (clubs && clubs.length > 0) {
        setClubs(clubs);
      }
    });
    // return () => {}
  }, []);

  // Handle country and category change
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSortSelect = (sort) => {
    setSelectedSort(sort);
  };

  // Filter clubs based on selected country and category
  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCountry === "All Countries" ||
        club.country === selectedCountry) &&
      (selectedCategory === "All Categories" ||
        club.category === selectedCategory)
  );

  // Sort clubs based on selected sort option
  const sortedClubs = [...filteredClubs].sort((a, b) => {
    switch (selectedSort) {
      case "Price: Low to High":
        return a.membershipFee - b.membershipFee;
      case "Price: High to Low":
        return b.membershipFee - a.membershipFee;
      case "Popularity":
        return b.members - a.members;
      case "Newest":
      default:
        return b.id - a.id; // Assuming higher id means newer
    }
  });

  const join = (club) => {
    addClubMember(club.onChainId, USDDAddress, club.membershipFee).then(
      (txID) => {
        console.log("txID: ", txID);
        load().then((clubs) => {
          if (clubs && clubs.length > 0) {
            setClubs(clubs);
          }
        });
      }
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClub(null);
  };

  const handlePayJoin = () => {
    setShowModal(false);
    // navigate('/explore/myclubs');
  };

  return (
    <>
      <div className="kmint container mt-2">
        <div className="row mb-4">
          <div className="col-md-12 text-center">
            <h1>Discover Amazing Clubs</h1>
          </div>
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <div className="d-flex justify-content-middle mt-3">
              <div className="input-group" id="search-bar">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Clubs"
                  aria-label="Search Clubs"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="btn btn-outline-secondary" type="button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-6"></div>
          <div className="col-12">
            <div className="text-center">
              <div className="btn-group filter-dropdown mx-2 mb-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedCategory}
                </button>
                <ul className="dropdown-menu">
                  {uniqueCategories.map((category) => (
                    <li key={category}>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="btn-group filter-dropdown mx-2 mb-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedCountry}
                </button>
                <ul className="dropdown-menu">
                  {uniqueCountries.map((country) => (
                    <li key={country}>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => handleCountrySelect(country)}
                      >
                        {country}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="btn-group filter-dropdown mx-2 mb-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Sort By: {selectedSort}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSortSelect("Newest")}
                    >
                      Newest
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSortSelect("Price: Low to High")}
                    >
                      Price: Low to High
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSortSelect("Price: High to Low")}
                    >
                      Price: High to Low
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSortSelect("Popularity")}
                    >
                      Popularity
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row" id="club-container">
          {sortedClubs.map((club) => (
            <div className="col-md-4 mb-4" key={club.id}>
              <div className="card club-card">
                <img
                  src={club.image}
                  className="card-img-top"
                  alt={club.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{club.name}</h5>
                  <p className="card-text">{club.description}</p>
                  <div className="membershipFee-qty-container">
                    <span className="badge bg-secondary badge-category">
                      {club.category}
                    </span>
                    <span className="badge bg-secondary badge-country mx-2">
                      {club.country}
                    </span>
                    <span className="text-success">{club.members} Members</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="text-success mt-2">${club.membershipFee}</h4>
                    {club.isMember ? (
                      <></>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() => join(club)}
                      >
                        Join Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedClub?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedClub?.image}
              className="img-fluid mb-3"
              alt={selectedClub?.name}
            />
            <h5>${selectedClub?.membershipFee}</h5>
            <p>{selectedClub?.description}</p>
            <p>
              <strong>Category:</strong> {selectedClub?.category}
            </p>
            <p>
              <strong>Country:</strong> {selectedClub?.country}
            </p>
            <p>
              <strong>Members:</strong> {selectedClub?.members}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="success" onClick={handlePayJoin}>
              Pay & Join Now
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default ExploreClubs;

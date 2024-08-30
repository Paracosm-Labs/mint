'use client'
import React, { useState } from 'react';
import OffcanvasDeals from '../components/offcanvasDeals';
import MyDealsModal from '../components/myDealsModal';

// import {useAuth} from "@/lib/AuthContext";
// import { useRouter } from 'next/navigation';
// import { redirect } from 'next/navigation';

const purchasedClubs = [
  {
    "id": 1,
    "name": "TechStore Savings Club",
    "description": "Join the TechStore Savings Club to pool your resources with other tech enthusiasts for exclusive group discounts on electronics.",
    "price": 10,
    "category": "Shopping",
    "country": "United States",
    "image": "https://picsum.photos/300/150?random=1",
    "members": 50
},
{
    "id": 2,
    "name": "CoffeeHouse Perks Pool",
    "description": "Become part of the CoffeeHouse Perks Pool to enjoy collective perks like free coffee and group deals at participating coffee shops.",
    "price": 5,
    "category": "Food & Drink",
    "country": "Trinidad and Tobago",
    "image": "https://picsum.photos/300/150?random=2",
    "members": 100
},
{
    "id": 3,
    "name": "FitnessPro Club Discount",
    "description": "Join forces with other fitness enthusiasts in the FitnessPro Club to unlock group discounts on memberships and services.",
    "price": 15,
    "category": "Health",
    "country": "Trinidad and Tobago",
    "image": "https://picsum.photos/300/150?random=3",
    "members": 750
},// Add more purchased Clubs as needed
];



function CustomerClubs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  
  // const { isAuthenticated } = useAuth();
  // const router = useRouter();
  // if(!isAuthenticated){
  //   router.push('/', { scroll: false })
  //   // redirect('/login')
  //   return (<></>)
  // } 

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

  const filteredClubs = purchasedClubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <button className="btn btn-outline-secondary" type="button"><i className="fas fa-search"></i></button>
        </div>
        </div>
        <div className="col-md-3"></div>
      </div>

      <div className="row">
        {filteredClubs.map(club => (
          <div className="col-md-6 col-sm-12 mb-4" key={club.id}>
            <div className="card club-card-horizontal">
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={club.image} className="img-fluid rounded-start p-3" alt={club.name} />
                </div>
                <div className="col-md-8">
                  <div className="card-body d-flex flex-column text-start">
                    <div>
                      <h5 className="card-title">{club.name}</h5>
                      <p className="card-text">{club.description}</p>
                    </div>
                    <div className=" mt-3">
                    <p className="text-muted">{club.members} Members</p>
                      <button className="btn btn-success" onClick={() => handleViewDeals(club)}>View Deals</button>
                      <button className="btn btn-outline-success mx-2" onClick={() => handleViewMyDeals(club)}>My Minted Deals</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        ))}
      </div>
      <OffcanvasDeals show={showOffcanvas} onHide={() => setShowOffcanvas(false)} club={selectedClub} />
      <MyDealsModal show={showModal} onHide={() => setShowModal(false)} offer={selectedClub} />
    </div>
  );
}

export default CustomerClubs;

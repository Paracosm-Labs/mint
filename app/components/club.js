"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

function Club({ club, handleViewDeals, handleViewMyDeals }) {
  return (
    <div className="col-md-6 col-sm-12 mb-4 mt-4" key={club.id}>
      <div className="card club-card-horizontal">
        <div className="row g-0">
          <div className="col-md-4">
          <Image
              src={club.image}
              alt={club.name}
              width={200} // Specify width
              height={200} // Specify height
              className="img-fluid rounded-start p-3"
            />
          </div>
          <div className="col-md-8">
            <div className="card-body d-flex flex-column text-start">
              <div>
                <h5 className="card-title">{club.name}</h5>
                <p className="card-text">{club.description}</p>
              </div>
              <div className=" mt-3">
                {/* <p className="text-muted">{club.members} Members</p> */}
                <button
                  className="btn btn-success"
                  onClick={() => handleViewDeals(club)}
                >
                  View Deals
                </button>
                <button
                  className="btn btn-outline-success mx-2"
                  onClick={() => handleViewMyDeals(club)}
                >
                  My Minted Deals
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Club;

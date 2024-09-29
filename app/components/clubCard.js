import React from 'react';
import Image from "next/image";
import Link from 'next/link';

const ClubCard = ({ club, onJoin, getCountryNameByCode }) => {
    return (
        <div className="card club-card" key={club.id}>
          <div className="position-relative">
            <Link href={`/explore/clubs/${club.id}`}>
              <Image
                height={200}
                width={400}
                src={club.image}
                // className="card-img-top"
                alt={club.name}
              />
              <div className="overlay">
                <button className="btn btn-outline-success btn-lg">View</button>
              </div>
            </Link>
          </div>
          <div className="card-body">
            <h5 className="card-title">{club.name}</h5>
            <p className="card-text">{club.description}</p>
            <div className="membershipFee-qty-container">
              <span className="badge bg-secondary badge-category">
                {club.category}
              </span>
              <span 
                className="badge bg-secondary badge-country mx-2" 
                data-bs-toggle="tooltip" 
                title={getCountryNameByCode(club.country)}
              >
                {club.country}
              </span>
              <span className="text-success">{club.members} {club.members === 1 ? 'Member' : 'Members'}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="text-success mt-3">${club.membershipFee}</h4>
              {club.isMember ? (
                <button className="btn btn-success disabled">Joined</button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => onJoin(club)}
                >
                  Join Club
                </button>
              )}
            </div>
          </div>
        </div>
      );
    };

export default ClubCard;

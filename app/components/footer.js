import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      <div className="container">
        <div className="row">
          <div className="col">
            <p>&copy; {new Date().getFullYear()} MintDeals. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

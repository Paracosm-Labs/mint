// components/socialShare.js
"use client";
import React from 'react';

function SocialShare({ clubUrl, onClose }) {
  const shareOptions = [
    { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(clubUrl)}`, iconClass: 'fab fa-facebook', color: '#3b5998' },
    { name: 'Twitter', url: `https://x.com/intent/post?url=${encodeURIComponent(clubUrl)}`, iconClass: 'fab fa-square-x-twitter', color: '#000000' },
    { name: 'Instagram', url: `https://www.instagram.com/?url=${encodeURIComponent(clubUrl)}`, iconClass: 'fab fa-instagram', color: '#C13584' },
    { name: 'WhatsApp', url: `https://api.whatsapp.com/send?text=${encodeURIComponent(clubUrl)}`, iconClass: 'fab fa-whatsapp', color: '#25D366' },
    { name: 'Telegram', url: `https://telegram.me/share/url?url=${encodeURIComponent(clubUrl)}`, iconClass: 'fab fa-telegram', color: '#0088cc' },
  ];

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Share Club</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Share your club with your network via:</p>
            <div className="d-flex justify-content-between">
              {shareOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn mx-2"
                  style={{ backgroundColor: option.color, color: 'white' }}
                >
                  <i className={`${option.iconClass} fa-2x`}></i> {/* Font Awesome icon */}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialShare;

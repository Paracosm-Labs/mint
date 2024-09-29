"use client";
import React, { useState, useRef } from 'react';

function SocialShare({ clubUrl, onClose }) {
  const shareOptions = [
    { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(clubUrl)}`, iconClass: 'fab fa-facebook', color: '#3b5998' },
    { name: 'X - Twitter', url: `https://x.com/intent/post?url=${encodeURIComponent(clubUrl)}`, iconClass: 'fab fa-square-x-twitter', color: '#000000' },
    { name: 'Instagram', url: `https://www.instagram.com/?url=${encodeURIComponent(clubUrl)}`, iconClass: 'fab fa-instagram', color: '#C13584' },
    { name: 'WhatsApp', url: `https://api.whatsapp.com/send?text=${encodeURIComponent(clubUrl)}`, iconClass: 'fab fa-whatsapp', color: '#25D366' },
    { name: 'Telegram', url: `https://telegram.me/share/url?url=${encodeURIComponent(clubUrl)}`, iconClass: 'fab fa-telegram', color: '#0088cc' },
  ];

  const [copied, setCopied] = useState(false);
  const copyRef = useRef(null);

  const handleCopyClick = () => {
    if (copyRef.current) {
      copyRef.current.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }
  };

  return (
    <div className="modal " style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Share Club</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="club-url" className="form-label">Club URL</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="club-url"
                  readOnly
                  value={clubUrl}
                  ref={copyRef}
                />
                <button className="btn btn-sm btn-outline-secondary" type="button" onClick={handleCopyClick}>
                  <i className="far fa-copy"></i> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <p>Share this club with your network via:</p>
            <div className="d-flex flex-wrap justify-content-center">
              {shareOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn mx-2 my-2"
                  style={{ backgroundColor: option.color, color: 'white' }}
                >
                  <i className={`${option.iconClass} fa-2x`}></i> <small>{option.name}</small>
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
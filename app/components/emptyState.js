// components/emptyState.js
import React from 'react';

const EmptyState = ({ iconClass, message }) => {
  return (
    <div className="text-center py-5">
      <i className={`fa ${iconClass} fa-3x text-muted mb-3`}></i>
      <p className="lead text-muted mt-3">{message}</p>
    </div>
  );
};

export default EmptyState;
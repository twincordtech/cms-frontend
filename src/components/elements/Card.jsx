// ===============================
// File: Card.jsx
// Description: Simple card container component for displaying content in a styled box.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';

/**
 * Card component provides a consistent container for displaying content with padding, shadow, and rounded corners.
 * Accepts custom className for additional styling flexibility.
 */
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
// ===============================
// End of File: Card.jsx
// Description: Card container component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 
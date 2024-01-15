import React, { useState } from 'react';
import './tagDescription.css'; // You can create a CSS file for styling

const TruncatedDescription = ({ message, maxLength }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`message-content`}>
        {message}
      </div>
      {/* {isHovered && (
        <div className="full-message-box">
          <div className="full-message-content">{message}</div>
        </div>
      )} */}
    </div>
  );
};

export default TruncatedDescription;

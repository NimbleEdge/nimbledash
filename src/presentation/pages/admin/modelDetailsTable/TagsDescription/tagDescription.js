import React, { useState } from 'react';
import './tagDescription.css'; // You can create a CSS file for styling

const TruncatedDescription = ({ message, maxLength }) => {

  return (
      <div className={`message-content`}>
        {message}
      </div>
  );
};

export default TruncatedDescription;

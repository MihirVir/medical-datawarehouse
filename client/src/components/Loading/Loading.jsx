import React from 'react';
import './loading.css'; // Import your CSS file

const LoadingAnimation = ({height}) => {
  return (
    <div style = {{height: `${height}vh`}} className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingAnimation;


import React, { useState } from "react";
import "./../styles/FloatingButton.css"; // Import the CSS file for styling

const FloatingButton = () => {
  const [showIcons, setShowIcons] = useState(false);

  const toggleIcons = () => {
    setShowIcons(!showIcons);
  };

  return (
    <div className="floating-button-container">
      <button className="floating-button" onClick={toggleIcons}>
        {showIcons ? "إخفاء" : " منصة المنجز"}
      </button>
      {showIcons && (
        <div className="icon-container">
          <a
            href="https://www.facebook.com/ali.alyan.92"
            target="_blank"
            rel="noopener noreferrer"
            className="icon facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://www.instagram.com/ali23121982/"
            target="_blank"
            rel="noopener noreferrer"
            className="icon instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://www.youtube.com/@%D8%A3.%D8%B9%D9%84%D9%8A%D9%85%D8%AD%D9%85%D8%AF%D8%B9%D9%84%D9%8A%D8%A7%D9%86"
            target="_blank"
            rel="noopener noreferrer"
            className="icon youtube"
          >
            <i className="fab fa-youtube"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/%D8%B9%D9%84%D9%8A-%D9%85%D8%AD%D9%85%D8%AF-%D8%B9%D9%84%D9%8A%D8%A7%D9%86-a42859105/"
            target="_blank"
            rel="noopener noreferrer"
            className="icon linkedin"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      )}
    </div>
  );
};

export default FloatingButton;

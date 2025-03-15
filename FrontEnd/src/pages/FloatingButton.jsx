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
        {showIcons ? "Hide" : "تواصل معنا"}
      </button>
      {showIcons && (
        <div className="icon-container">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="icon facebook"
          >
            <span className="material-icons">facebook</span>
          </a>
          <a
            href={`https://wa.me/201227245533`}
            target="_blank"
            rel="noopener noreferrer"
            className="icon whatsapp"
          >
            <span className="material-icons">chat</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default FloatingButton;

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
        {showIcons ? "إخفاء" : "تواصل معنا"}
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
            <span class="material-icons">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Icon" width="30" height="30">
              </img>
            </span>
          </a>
        </div>
      )}
    </div>
  );
};

export default FloatingButton;

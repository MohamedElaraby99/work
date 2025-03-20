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
        {showIcons ? "إخــفــاء" : " مـنصة الـمنجز"}
      </button>
      {showIcons && (
        <div className="icon-container">
          <a
            href="https://www.facebook.com/people/MrMahmoud-Abdel-Aziz/100070094625467/?mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
            className="icon facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://wa.me/201125800332"
            target="_blank"
            rel="noopener noreferrer"
            className="icon whatsapp"
          >
            <i className="fab fa-whatsapp"></i>
          </a>
          <a
            href="http://www.youtube.com/@mahmoudAbdel_Aziz"
            target="_blank"
            rel="noopener noreferrer"
            className="icon youtube"
          >
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      )}
    </div>
  );
};

export default FloatingButton;

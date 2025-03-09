import React from "react";
import "./../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About the Platform */}
        <div className="footer-section">
          <h3 className="footer-title">عن المنصة</h3>
          <ul className="footer-links">
            <li>
              <a href="/about" className="footer-link">
                نبذة عن المنصة
              </a>
            </li>
            <li>
              <a href="tel:01023607948" className="footer-link">
                الاتصال بنا
              </a>
            </li>
          </ul>
        </div>

        {/* Center Logo and Tagline */}
        <div className="footer-section footer-center">
          <img
            src={require("./../images/4GLogo.png")}
            alt="Platform Logo"
            className="footer-logo"
          />
        </div>

        {/* Social Media Links */}
        <div className="footer-section">
          <h3 className="footer-title">قنوات التواصل</h3>
          <div className="social-links">
            <a
              href="https://www.tiktok.com/@mahmoud.tawakol0?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3046/3046127.png"
                alt="TikTok"
                className="social-icon"
              />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100063763039756&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                alt="Facebook"
                className="social-icon"
              />
            </a>
            <a
              href={`https://wa.me/${201120646425}`}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="Instagram"
                className="social-icon"
              />
            </a>
            <a
              href="https://www.youtube.com/@%D8%A7%D9%84%D8%AA%D9%88%D9%83%D9%84-90"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
                alt="YouTube"
                className="social-icon"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} - منصة فور جي - جميع الحقوق - محفوظة
        </p>
        <p>
          <a
            href="https://www.facebook.com/share/15yTFSwF4n/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link developer-link"
          >
            تصميم وتطوير شركة فكرة - Fikra Software
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/LoginPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginForm = ({ setRole }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Retrieve saved login data if available
  useEffect(() => {
    const savedUsername = localStorage.getItem("userName");
    const savedPassword = localStorage.getItem("password");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe) {
      setUsername(savedUsername || "");
      setPassword(savedPassword || "");
      setRememberMe(savedRememberMe);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/login`,
        {
          username: userName,
          password: password,
        }
      );

      console.log(response.data);

      const { role, accessToken, name, stage, subject } = response.data;

      // Set role and token in localStorage
      setRole(role);
      localStorage.setItem("role", role);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("name", name);
      localStorage.setItem("stage", stage);
      localStorage.setItem("subject", subject);

      // If "Remember Me" is checked, save username and password
      if (rememberMe) {
        localStorage.setItem("userName", userName);
        localStorage.setItem("password", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("userName");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }

      // Redirect based on role
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "اسم المستخدم أو كلمة المرور غير صحيحة"
      );
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-header">
        <div className="logo-container imageyyy">
          <img
            className="logo"
            src={require("./../images/4GLogo.png")}
            alt="محمود توكل"
          />
          <h1>مـنـصـة 4G</h1>
        </div>
      </div>
      <div className="login-page-container">
        <div className="login-page">
          {/* Left Section */}
          <div className="left-side-container">
            <div className="left-side">
              <img
                className="left-side-image"
                src={require("./../images/4GLogo.png")}
                alt=""
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="right-side">
            <div className="login-form-container">
              <img
                className="leftt-side-image"
                src={require("./../images/4GLogo.png")}
                alt=""
              />
              <p className="login-title">تسجيل الدخول</p>
              <form onSubmit={handleLogin} className="login-form">
                <div className="input-containerr">
                  <label htmlFor="userName">اسم المستخدم</label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="input-containerr">
                  <label htmlFor="password">كلمة المرور</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="toggle-password-buttonn"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="optionss">
                  <label className="remember-me">
                    <input
                      className="remember-me-checkbox"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    تذكرني
                  </label>
                </div>
                <div className="login-button-container">
                  <button type="submit" className="login-button">
                    تسجيل الدخول
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer foterrrr">
        <div className="footer-container">
          {/* About the Platform */}
          <div className="footer-section">
            <h3 className="footer-title">عن المنصة</h3>
            <ul className="footer-links">
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
        <div className="footer-bottom">
          <p className="footer-text">
            &copy; {new Date().getFullYear()} - منصة فور جي - جميع الحقوق -
            محفوظة
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
    </div>
  );
};

export default LoginForm;

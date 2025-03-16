import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/LoginPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FaWhatsapp } from "react-icons/fa"; 

const LoginForm = ({ setRole }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

      const { role, accessToken, name, stage, subject } = response.data;

      setRole(role);
      localStorage.setItem("role", role);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("name", name);
      localStorage.setItem("stage", stage);
      localStorage.setItem("subject", JSON.stringify(subject));

      if (rememberMe) {
        localStorage.setItem("userName", userName);
        localStorage.setItem("password", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("userName");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }

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
      <div className="login-page-container">
        <div className="login-page">
          <div className="left-side-container">
            <div className="left-side">
              <img
                className="left-side-image"
                src={require("./../images/4GLogo.png")}
                alt=""
              />
            </div>
          </div>

          <div className="right-side">
            <div className="login-form-container">
              <img
                className="leftt-side-image"
                src={require("./../images/4GLogo.png")}
                alt=""
              />
              <p className="login-page-title">مـنـصـة 4G</p>
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

      {/* Attribution */}
      <a
        href="https://www.facebook.com/people/Fikra-Software-%D9%81%D9%83%D8%B1%D8%A9/61572824761047/?rdid=hu8NxgcddUoKHkUb&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1AN2gA2bMq%2F"
        className="attribution"
        target="_blank"
        rel="noopener noreferrer"
      >
        تصميم وتطوير شركة فكرة للبرمجيات - Fikra Software
      </a>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/201227245533"
        className="floating-whatsapp-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
};

export default LoginForm;

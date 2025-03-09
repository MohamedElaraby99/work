import React, { useState, useEffect } from "react";
import {
  FaCalculator,
  FaRulerCombined,
  FaChartLine,
  FaWaveSquare,
  FaChartBar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./../styles/Math.css";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Math = () => {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(true);

  // استرداد المرحلة الدراسية والدور و subject من localStorage
  const stage = localStorage.getItem("stage");
  const role = localStorage.getItem("role");
  const subject = localStorage.getItem("subject");

  // فحص الاشتراك
  useEffect(() => {
    if (
      role === "student" &&
      subject !== "جغرافيا" &&
      subject !== "تاريخ وجغرافيا"
    ) {
      setIsSubscribed(false);
    }
  }, [role, subject]);

  if (!isSubscribed) {
    return (
      <div className="history-container centerrr">
        <header className="history-header">
          <h1>
            <span className="material-icons iconnn">calculate</span>
            مادة الرياضيات
          </h1>
          <h2> مستر : عمر يوسف </h2>
        </header>
        <p className="about-imag ">
          <img
            src={require("./../images/pngwing.com.png")}
            alt="Not Allowed"
            className="Not-Image"
          />
        </p>
        <p className="Errorr">عذرًا، أنت غير مشترك في هذه المادة.</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <header className="history-header">
        <div className="content-container">
          {/* الصورة على اليسار */}
          <div className="image-container">
            <img
              src={require("./../images/mromaryosef.png")}
              alt="صورة المادة"
              className="history-image"
              style={{ border: "2px solid #ffffff" }}
            />
          </div>
          {/* النص على اليمين */}
          <div className="text-container">
            <h1>
              <span className="material-icons iconnn">calculate</span>
              مادة الرياضيات
            </h1>
            <p>مـقدم الـمادة</p>
            <p className="history-subtitle">مـستر : عـمر يـوسف</p>
            <div className="social-linkss">
              <a
                href="https://www.facebook.com/share/19yU5KnbG8/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com/omar.youssef.4?igsh=azE3dnFvY2Qxcnp6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@omar.youssef4?_t=ZS-8uXqV9WSu1g&_r=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok />
              </a>
              <a
                href="https://wa.me/201221382008"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="subjects-list">
        <div
           style={{
            margin: "20px auto", 
            fontSize: "20px",
            fontWeight: "bold",
            padding: "15px 20px",
            borderRadius: "15px",
            backgroundColor: "#014385", 
            color: "#ffffff", 
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
          }} >
          اختر المادة
        </div>
        <div className="subject-item" onClick={() => navigate("/select-math")}>
          <FaCalculator /> الجبر
        </div>
        <div className="subject-item" onClick={() => navigate("/select-math")}>
          <FaRulerCombined /> الهندسة
        </div>
        <div className="subject-item" onClick={() => navigate("/select-math")}>
          <FaWaveSquare /> حساب المثلثات
        </div>
        <div className="subject-item" onClick={() => navigate("/select-math")}>
          <FaChartLine /> التفاضل
        </div>
        <div className="subject-item" onClick={() => navigate("/select-math")}>
          <FaChartBar /> الإحصاء
        </div>
      </div>
    </div>
  );
};

export default Math;

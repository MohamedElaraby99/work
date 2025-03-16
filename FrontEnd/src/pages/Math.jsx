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
  const subject = JSON.parse(localStorage.getItem("subject"));

  console.log("subject", subject);

  // فحص الاشتراك
  useEffect(() => {
    if (role === "admin") {
      setIsSubscribed(true);
    } else if (stage === null || subject === null) {
      setIsSubscribed(false);
    }
  }, [role, stage, subject]);

  if (!isSubscribed) {
    return (
      <div className="history-container centerrr">
        <header className="history-header">
          <div className="content-container">
            {/* الصورة على اليسار */}
            <div className="image-container">
              <img
                src={require("./../images/mromaryosef.webp")}
                alt="صورة المادة"
                className="history-image"
                style={{ border: "2px solid #ffffff" }}
              />
            </div>
            {/* النص على اليمين */}
            <div className="text-container">
              <h1>مادة الرياضيات</h1>
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
                  href="https://wa.me/201090736119"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>
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
      <div className="contentt">
        <header className="history-header">
          <div className="content-container">
            {/* الصورة على اليسار */}
            <div className="image-container">
              <img
                src={require("./../images/mromaryosef.webp")}
                alt="صورة المادة"
                className="history-image"
                style={{ border: "2px solid #ffffff" }}
              />
            </div>
            {/* النص على اليمين */}
            <div className="text-container">
              <h1>مادة الرياضيات</h1>
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
                  href="https://wa.me/201090736119"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>
        </header>
      </div>

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
          }}
        >
          اختر المادة
        </div>
        {(role === "admin" || subject.includes("جبر")) && (
          <div
            className="subject-item"
            onClick={() =>
              navigate("/select-math", {
                state: { subject: "جبر" },
              })
            }
          >
            <FaCalculator /> الجبر
          </div>
        )}
        {(role === "admin" || subject.includes("هندسة")) && (
          <div
            className="subject-item"
            onClick={() =>
              navigate("/select-math", {
                state: { subject: "هندسة" },
              })
            }
          >
            <FaRulerCombined /> الهندسة
          </div>
        )}
        {(role === "admin" || subject.includes("مثلثات")) && (
          <div
            className="subject-item"
            onClick={() =>
              navigate("/select-math", {
                state: { subject: "مثلثات" },
              })
            }
          >
            <FaWaveSquare /> حساب المثلثات
          </div>
        )}
        {(role === "admin" || subject.includes("تفاضل")) && (
          <div
            className="subject-item"
            onClick={() =>
              navigate("/select-math", {
                state: { subject: "تفاضل" },
              })
            }
          >
            <FaChartLine /> التفاضل
          </div>
        )}
        {(role === "admin" || subject.includes("إحصاء")) && (
          <div
            className="subject-item"
            onClick={() =>
              navigate("/select-math", {
                state: { subject: "إحصاء" },
              })
            }
          >
            <FaChartBar /> الإحصاء
          </div>
        )}
      </div>
    </div>
  );
};

export default Math;

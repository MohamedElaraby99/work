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
          <h1>مادة الجغرافيا</h1>
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
        <h1>
          <span className="material-icons iconnn">calculate</span>
          مادة الرياضيات
        </h1>
        <h2> مستر : عمر يوسف </h2>
      </header>

      <div className="subjects-list">
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

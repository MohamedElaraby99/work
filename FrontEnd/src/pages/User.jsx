import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/User.css";

const UserPage = ({ onSignOut }) => {
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    stage: "",
    subject: "",
    username: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // جلب البيانات من localStorage
    const savedData = {
      role: localStorage.getItem("role"),
      accessToken: localStorage.getItem("accessToken"),
      name: localStorage.getItem("name"),
      stage: localStorage.getItem("stage"),
      subject: localStorage.getItem("subject"),
    };

    if (!savedData.accessToken) {
      navigate("/login");
      return;
    }

    setUserData(savedData);
  }, [navigate]);

  const handleLogout = () => {
    // حذف جميع بيانات المستخدم
    localStorage.removeItem("role");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("name");
    localStorage.removeItem("stage");
    localStorage.removeItem("subject");
    onSignOut();
  };

  return (
    <div className="user-page">
      <div className="user-info">
        <div className="user-details">
          <h2>الملف الشخصي</h2>

          <div className="info-item">
            <span className="label">الاسم :</span>
            <span className="value">{userData.name || "غير متوفر"}</span>
          </div>

          <div className="info-item">
            <span className="label">المرحلة :</span>
            <span className="value">{userData.stage || "غير محدد"}</span>
          </div>

          <div className="info-item">
            <span className="label">المادة :</span>
            <span className="value">{userData.subject || "غير محدد"}</span>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default UserPage;

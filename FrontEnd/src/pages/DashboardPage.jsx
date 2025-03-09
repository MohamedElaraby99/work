import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./../styles/dashboard.css";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // حالة لتخزين إجمالي عدد المستخدمين
  const [totalUsers, setTotalUsers] = useState(0);

  // حالة لتخزين إجمالي عدد الدروس
  const [totalLessons, setTotalLessons] = useState(0);

  // حالة لتخزين إجمالي عدد الإعلانات
  const [totalPosts, setTotalPosts] = useState(0);

  const [totalFiles, setTotalFiles] = useState(0);

  const [totalExams, setTotalExams] = useState(0);

  const savedData = {
    name: localStorage.getItem("name"),
  };

  // دالة لجلب بيانات المستخدمين من الـ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // الحصول على رمز المصادقة من Local Storage
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // إضافة رمز المصادقة إلى الرؤوس
            },
          }
        );
        setTotalUsers(response.data.length); // تخزين عدد المستخدمين
      } catch (error) {
        console.error("حدث خطأ أثناء جلب بيانات المستخدمين:", error);
      }
    };

    fetchUsers();
  }, []); // يتم تنفيذها مرة واحدة عند تحميل الصفحة

  // دالة لجلب بيانات الدروس من الـ API
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // الحصول على رمز المصادقة من Local Storage
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/lessons`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // إضافة رمز المصادقة إلى الرؤوس
            },
          }
        );
        setTotalLessons(response.data.length); // تخزين عدد الدروس
      } catch (error) {
        console.error("حدث خطأ أثناء جلب بيانات الدروس:", error);
      }
    };

    fetchLessons();
  }, []); // يتم تنفيذها مرة واحدة عند تحميل الصفحة

  // دالة لجلب بيانات الإعلانات من الـ API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // الحصول على رمز المصادقة من Local Storage
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/announcements`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // إضافة رمز المصادقة إلى الرؤوس
            },
          }
        );
        setTotalPosts(response.data.length); // تخزين عدد الإعلانات
      } catch (error) {
        console.error("حدث خطأ أثناء جلب بيانات الإعلانات:", error);
      }
    };

    fetchPosts();
  }, []); // يتم تنفيذها مرة واحدة عند تحميل الصفحة

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/files`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTotalFiles(response.data.length); // تخزين عدد الملفات
      } catch (error) {
        console.error("حدث خطأ أثناء جلب بيانات الملفات:", error);
      }
    };

    fetchExams();
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/exams`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTotalExams(response.data.length); // تخزين عدد الملفات
      } catch (error) {
        console.error("حدث خطأ أثناء جلب بيانات الامتحانات:", error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div
      className={`dashboard ${
        location.pathname === "/add-user" ? "active" : ""
      }`}
    >
      <header className="dashboard-header">
        <div>
          <h1> لوحة تحكم المنصة </h1>
          <p className="dashboard-welcome">
            مـرحباً بـك مـستر : {savedData.name}
          </p>
        </div>
      </header>

      <div className="stats">
        <div className="stat-item" onClick={() => navigate("/all-videos")}>
          <h2>{totalLessons}</h2> {/* عرض العدد الديناميكي للفيديوهات */}
          <p className="stat-title">إجمالي الفيديوهات</p>
          <p className="show-details">عرض</p>
        </div>
        <div className="stat-item" onClick={() => navigate("/all-pdfs")}>
          <h2>{totalFiles}</h2>
          <p className="stat-title">إجمالي ملفات PDF</p>
          <p className="show-details">عرض</p>
        </div>
        <div className="stat-item" onClick={() => navigate("/all-exams")}>
          <h2>{totalExams}</h2>
          <p className="stat-title">إجمالي الاختبارات</p>
          <p className="show-details">عرض</p>
        </div>
        <div className="stat-item" onClick={() => navigate("/all-users")}>
          <h2>{totalUsers}</h2> {/* عرض العدد الديناميكي للمستخدمين */}
          <p className="stat-title">إجمالي المستخدمين </p>
          <p className="show-details">عرض</p>
        </div>
        <div className="stat-item" onClick={() => navigate("/all-posts")}>
          <h2>{totalPosts}</h2> {/* عرض العدد الديناميكي للإعلانات */}
          <p className="stat-title">إجمالي الإعلانات</p>
          <p className="show-details">عرض</p>
        </div>
      </div>

      <div className="actionsss">
        <div className="quick-upload">
          <h3>الرفع </h3>

          <button className="video-btn" onClick={() => navigate("/add-video")}>
            <span className="fluent--video-28-filled"></span>
            <span className="invisible-char">هلا</span>
            <span className="add-text"> رفع فيديو جديد</span>
          </button>

          <button className="pdf-btn" onClick={() => navigate("/add-pdf")}>
            <span className="bxs--file-pdf "></span>
            <span className="invisible-char">هلا</span>
            <span className="add-text"> رفع PDF جديد</span>
          </button>
        </div>
        <div className="quick-actions">
          <h3>الإجراءات </h3>

          <button className="add-btn" onClick={() => navigate("/add-user")}>
            <span className="mdi--user-add"></span>
            <span className="invisible-char">هلا</span>
            <span className="add-text"> اضافة مستخدم جديد</span>
          </button>

          <button className="exam-btn" onClick={() => navigate("/add-exam")}>
            <span className="fa6-solid--pen"></span>
            <span className="invisible-char">هلا</span>
            <span className="add-text"> اضافة امتحان جديد </span>
          </button>

          <button className="post-btn" onClick={() => navigate("/add-post")}>
            <span className="mdi--bullhorn"></span>
            <span className="invisible-char">هلا</span>
            <span className="add-text"> إضافة إعلان جديد </span>
          </button>
        </div>

        <div className="quick-actions">
          <h3>المساعد الشخصي </h3>
          <button
            className="Ai-ChatBot-btn"
            onClick={() => navigate("/AiChat")}
          >
            <span className="fas fa-robot"></span>
            <span className="invisible-char">هلا</span>
            <span className="add-text">تكلم مع المساعد الشخصي </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaVideo,
  FaClipboardList,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./../styles/Math.css";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const French = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    videos: false,
    exams: false,
    assignments: false,
    pdfs: false,
  });
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

  // بيانات الوحدات مع روابط الصفحات
  const courseUnits = {
    videos: Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      title: `الوحدة ${i + 1}`,
      path: `/history/unit/${i + 1}/videos`,
    })),

    exams: Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      title: `الوحدة ${i + 1}`,
      path: `/history/unit/${i + 1}/exams`,
    })),

    assignments: Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      title: `الوحدة ${i + 1}`,
      path: `/history/unit/${i + 1}/assignments`,
    })),

    pdfs: Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      title: `الوحدة ${i + 1}`,
      path: `/history/unit/${i + 1}/pdfs`,
    })),
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!isSubscribed) {
    return (
      <div className="history-container centerrr">
        <header className="history-header">
          <h1>
            <span class="material-symbols-outlined iconnn">
              language_french
            </span>
            مادة اللغة الفرنسية
          </h1>
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
        <div className="contenttt">
          <div className="content-container">
            {/* الصورة على اليسار */}
            <div className="image-container">
              <img
                src={require("./../images/mrahmedemad.png")}
                alt="صورة المادة"
                className="history-image"
                style={{ border: "2px solid #ffffff" }}
              />
            </div>
            {/* النص على اليمين */}
            <div className="text-container">
              <h1>
                
                مادة اللغة الفرنسية
              </h1>
              <p>مـقدم الـمادة</p>
              <p className="history-subtitle"> Mr - Ahmed Emad </p>
              <div className="social-linkss">
                <a
                  href="https://www.facebook.com/share/1HpuLsGQV1/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/ahmed_emad53?igsh=MWFqeW5taDIzYWg1eQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.tiktok.com/@el_msu?_t=ZS-8uXqULmMc5J&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTiktok />
                </a>
                <a
                  href="https://wa.me/201277037363"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* قسم الفيديوهات */}
      <section className="expandable-section">
        <h2 onClick={() => toggleSection("videos")}>
          <FaVideo /> الفيديوهات التعليمية
          {expandedSections.videos ? <FaChevronUp /> : <FaChevronDown />}
        </h2>
        {expandedSections.videos && (
          <div className="units-list">
            {courseUnits.videos.map((unit) => (
              <div
                key={unit.id}
                className="unit-item"
                onClick={() =>
                  navigate("/courses", {
                    state: { subject: "جغرافيا", unit: unit.id },
                  })
                }
              >
                {unit.title}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* قسم الامتحانات */}
      <section className="expandable-section">
        <h2 onClick={() => toggleSection("exams")}>
          <FaClipboardList /> الامتحانات
          {expandedSections.exams ? <FaChevronUp /> : <FaChevronDown />}
        </h2>
        {expandedSections.exams && (
          <div className="units-list">
            {courseUnits.exams.map((unit) => (
              <div
                key={unit.id}
                className="unit-item"
                onClick={() =>
                  navigate("/exams", {
                    state: {
                      subject: "جغرافيا",
                      unit: unit.id,
                      type: "امتحان",
                    },
                  })
                }
              >
                {unit.title}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* قسم الواجبات */}
      <section className="expandable-section">
        <h2 onClick={() => toggleSection("assignments")}>
          <FaClipboardList /> الواجبات
          {expandedSections.assignments ? <FaChevronUp /> : <FaChevronDown />}
        </h2>
        {expandedSections.assignments && (
          <div className="units-list">
            {courseUnits.assignments.map((unit) => (
              <div
                key={unit.id}
                className="unit-item"
                onClick={() =>
                  navigate("/exams", {
                    state: {
                      subject: "جغرافيا",
                      unit: unit.id,
                      type: "تدريب",
                    },
                  })
                }
              >
                {unit.title}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* قسم ملفات PDF */}
      <section className="expandable-section">
        <h2 onClick={() => toggleSection("pdfs")}>
          <FaFilePdf /> ملفات PDF
          {expandedSections.pdfs ? <FaChevronUp /> : <FaChevronDown />}
        </h2>
        {expandedSections.pdfs && (
          <div className="units-list">
            {courseUnits.pdfs.map((unit) => (
              <div
                key={unit.id}
                className="unit-item"
                onClick={() =>
                  navigate("/pdf", {
                    state: {
                      subject: "جغرافيا",
                      unit: unit.id,
                    },
                  })
                }
              >
                {unit.title}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default French;

import React, { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaVideo,
  FaClipboardList,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./../styles/Math.css";

const SelectMath = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    videos: false,
    exams: false,
    assignments: false,
    pdfs: false,
  });
  const [isSubscribed, setIsSubscribed] = useState(true);
  const location = useLocation();

  // استرداد المرحلة الدراسية والدور و subject من localStorage
  const stage = localStorage.getItem("stage");
  const role = localStorage.getItem("role");

  // Retrieve the subject from location state
  const { subject } = location.state || {};

  // فحص الاشتراك
  // useEffect(() => {
  //   if (role === "student" && subject !== "جبر" && subject !== "هندسة") {
  //     setIsSubscribed(false);
  //   }
  // }, [role, subject]);

  // بيانات الوحدات مع روابط الصفحات
  const courseUnits = {
    videos: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      title: `الوحدة ${i + 1}`,
      path: `/select-math/unit/${i + 1}/videos`,
    })),

    exams: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      title: `الوحدة ${i + 1}`,
      path: `/select-math/unit/${i + 1}/exams`,
    })),

    assignments: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      title: `الوحدة ${i + 1}`,
      path: `/select-math/unit/${i + 1}/assignments`,
    })),

    pdfs: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      title: `الوحدة ${i + 1}`,
      path: `/select-math/unit/${i + 1}/pdfs`,
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
          <h1>مادة الجغرافيا</h1>
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
          مادة {subject}
        </h1>
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
                    state: { subject: subject, unit: unit.id },
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
                      subject: subject,
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
                      subject: subject,
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
                      subject: subject,
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

export default SelectMath;

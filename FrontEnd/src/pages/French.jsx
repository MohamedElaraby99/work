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

  // Retrieve the educational stage, role, and subjects from localStorage
  const stage = localStorage.getItem("stage");
  const role = localStorage.getItem("role");
  const subject = localStorage.getItem("subject");

  // Determine the number of units based on the stage
  let unitCount;
  switch (stage) {
    case "أولى ثانوي":
    case "ثانية ثانوي":
      unitCount = 2;
      break;
    case "ثالثة ثانوي":
      unitCount = 4;
      break;
    default:
      unitCount = 4; // Default value if stage is not recognized
  }

  // Check subscription
  useEffect(() => {
    if (role === "student" && !subject.includes("فرنسي")) {
      setIsSubscribed(false);
    }
  }, [role, subject]);

  // Course units data with dynamic length based on the stage
  const courseUnits = {
    videos: Array.from({ length: unitCount }, (_, i) => ({
      id: i + 1,
      title: `unité ${i + 1}`,
      path: `/frensh/unit/${i + 1}/videos`,
    })),

    exams: Array.from({ length: unitCount }, (_, i) => ({
      id: i + 1,
      title: `unité ${i + 1}`,
      path: `/frensh/unit/${i + 1}/exams`,
    })),

    assignments: Array.from({ length: unitCount }, (_, i) => ({
      id: i + 1,
      title: `unité ${i + 1}`,
      path: `/frensh/unit/${i + 1}/assignments`,
    })),

    pdfs: Array.from({ length: unitCount }, (_, i) => ({
      id: i + 1,
      title: `unité ${i + 1}`,
      path: `/frensh/unit/${i + 1}/pdfs`,
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
          <div className="contenttt">
            <div className="content-container">
              {/* Image on the left */}
              <div className="image-container">
                <img
                  src={require("./../images/mrahmedemad.webp")}
                  alt="Subject Image"
                  className="history-image"
                  style={{ border: "2px solid #ffffff" }}
                />
              </div>
              {/* Text on the right */}
              <div className="text-container">
                <h1>مادة اللغة الفرنسية</h1>
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
            {/* Image on the left */}
            <div className="image-container">
              <img
                src={require("./../images/mrahmedemad.webp")}
                alt="Subject Image"
                className="history-image"
                style={{ border: "2px solid #ffffff" }}
              />
            </div>
            {/* Text on the right */}
            <div className="text-container">
              <h1>مادة اللغة الفرنسية</h1>
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

      {/* Videos Section */}
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
                    state: { subject: "فرنسي", unit: unit.id },
                  })
                }
              >
                {unit.title}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Exams Section */}
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
                      subject: "فرنسي",
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

      {/* Assignments Section */}
      <section className="expandable-section">
        <h2 onClick={() => toggleSection("assignments")}>
          <FaClipboardList /> التدريبات
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
                      subject: "فرنسي",
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

      {/* PDFs Section */}
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
                      subject: "فرنسي",
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

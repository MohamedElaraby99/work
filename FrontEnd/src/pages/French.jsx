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
  const [selectedUnit, setSelectedUnit] = useState(null); // الوحدة المختارة
  const [selectedLesson, setSelectedLesson] = useState(null); // الدرس المختار
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

  // بيانات الوحدات مع الدروس
  const courseUnits = Array.from({ length: unitCount }, (_, i) => ({
    id: i + 1,
    title: `الوحدة ${i + 1}`,
    lessons: [1, 2, 3], // الدروس كأرقام فقط (يمكنك تعديل العدد حسب الحاجة)
  }));

  const handleUnitClick = (unitId) => {
    setSelectedUnit(selectedUnit === unitId ? null : unitId); // تبديل الحالة
    setSelectedLesson(null); // إعادة تعيين الدرس
  };

  const handleLessonClick = (lessonNumber) => {
    setSelectedLesson(selectedLesson === lessonNumber ? null : lessonNumber); // تبديل الحالة
  };

  if (!isSubscribed) {
    return (
      <div className="history-container modern-layout">
        <header className="history-header modern-header">
          <div className="content-container">
            <div className="contenttt">
              <div className="image-container">
                <img
                  src={require("./../images/mrahmedemad.webp")}
                  alt="Subject"
                  className="history-image"
                  style={{ border: "2px solid #ffffff" }}
                />
              </div>
              <div className="text-container">
                <h1>مادة اللغة الفرنسية</h1>
                <p>مـقدم الـمادة</p>
                <p className="history-subtitle">Mr - Ahmed Emad</p>
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
        <p className="about-imag">
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
    <div className="history-container modern-layout">
      <header className="history-header modern-header">
        <div className="content-container">
          <div className="contenttt">
            <div className="image-container">
              <img
                src={require("./../images/mrahmedemad.webp")}
                alt="Subject"
                className="history-image"
                style={{ border: "2px solid #ffffff" }}
              />
            </div>
            <div className="text-container">
              <h1>مادة اللغة الفرنسية</h1>
              <p>مـقدم الـمادة</p>
              <p className="history-subtitle">Mr - Ahmed Emad</p>
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

      <section className="units-section">
        <h2 className="section-title">الوحدات الدراسية</h2>
        <div className="units-grid">
          {courseUnits.map((unit) => (
            <div key={unit.id} className="unit-card">
              <div
                className="unit-header"
                onClick={() => handleUnitClick(unit.id)}
              >
                <span>{unit.title}</span>
                {selectedUnit === unit.id ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {selectedUnit === unit.id && (
                <div className="lessons-container">
                  {unit.lessons.map((lessonNumber) => (
                    <div key={lessonNumber} className="lesson-card">
                      <div
                        className="lesson-header"
                        onClick={() => handleLessonClick(lessonNumber)}
                      >
                        <span>الدرس {lessonNumber}</span>
                        {selectedLesson === lessonNumber ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </div>
                      {selectedLesson === lessonNumber && (
                        <div className="content-options">
                          <div
                            className="content-option"
                            onClick={() =>
                              navigate("/courses", {
                                state: {
                                  subject: "فرنسي",
                                  unit: unit.id,
                                  lesson: lessonNumber,
                                },
                              })
                            }
                          >
                            <FaVideo /> الفيديوهات التعليمية
                          </div>
                          <div
                            className="content-option"
                            onClick={() =>
                              navigate("/exams", {
                                state: {
                                  subject: "فرنسي",
                                  unit: unit.id,
                                  lesson: lessonNumber,
                                  type: "امتحان",
                                },
                              })
                            }
                          >
                            <FaClipboardList /> الامتحانات
                          </div>
                          <div
                            className="content-option"
                            onClick={() =>
                              navigate("/exams", {
                                state: {
                                  subject: "فرنسي",
                                  unit: unit.id,
                                  lesson: lessonNumber,
                                  type: "تدريب",
                                },
                              })
                            }
                          >
                            <FaClipboardList /> التدريبات
                          </div>
                          <div
                            className="content-option"
                            onClick={() =>
                              navigate("/pdf", {
                                state: {
                                  subject: "فرنسي",
                                  unit: unit.id,
                                  lesson: lessonNumber,
                                },
                              })
                            }
                          >
                            <FaFilePdf /> ملفات PDF
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default French;

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

const History = () => {
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState(null); // الوحدة المختارة
  const [selectedLesson, setSelectedLesson] = useState(null); // الدرس المختار
  const [isSubscribed, setIsSubscribed] = useState(true);

  // Retrieve the educational stage, role, and subjects from localStorage
  const stage = localStorage.getItem("stage");
  const role = localStorage.getItem("role");
  const subjects = localStorage.getItem("subject");

  // Determine the number of units based on the stage
  let unitCount;
  switch (stage) {
    case "ثالثة اعدادي":
      unitCount = 4;
      break;
    case "أولى ثانوي":
    case "ثانية ثانوي":
      unitCount = 2;
      break;
    case "ثالثة ثانوي":
      unitCount = 7;
      break;
    default:
      unitCount = 8;
  }

  // Check subscription
  useEffect(() => {
    if (role === "student" && !subjects.includes("تاريخ")) {
      setIsSubscribed(false);
    }
  }, [role, subjects]);

  // بيانات الوحدات مع الدروس (الدروس كأرقام فقط)
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
      <div className="history-container">
        <header className="history-header">
          <div className="content-container">
            <div className="contenttt">
              <div className="image-container">
                <img
                  src={require("./../images/MrahmedSaid.webp")}
                  alt="Subject"
                  className="history-image"
                  style={{ border: "2px solid #ffffff" }}
                />
              </div>
              <div className="text-container">
                <h1>مـادة الـتاريـخ</h1>
                <p>مـقدم الـمادة</p>
                <p className="history-subtitle">مـستر : احـمد السعيد</p>
                <div className="social-linkss">
                  <a
                    href="https://www.facebook.com/share/1B8FQwvbrx/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="https://www.instagram.com/ahmed_elsaiidd?igsh=MXdkenVsdDdiZThmcg%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://www.tiktok.com/@ahmedelsaid5?_t=ZS-8uXqjqzaElA&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTiktok />
                  </a>
                  <a
                    href="https://wa.me/201279456731"
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
                src={require("./../images/MrahmedSaid.webp")}
                alt="Subject"
                className="history-image"
                style={{ border: "2px solid #ffffff" }}
              />
            </div>
            <div className="text-container">
              <h1>مـادة الـتاريـخ</h1>
              <p>مـقدم الـمادة</p>
              <p className="history-subtitle">مـستر : احـمد السعيد</p>
              <div className="social-linkss">
                <a
                  href="https://www.facebook.com/share/1B8FQwvbrx/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/ahmed_elsaiidd?igsh=MXdkenVsdDdiZThmcg%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.tiktok.com/@ahmedelsaid5?_t=ZS-8uXqjqzaElA&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTiktok />
                </a>
                <a
                  href="https://wa.me/201279456731"
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
                                  subject: "تاريخ",
                                  unit: unit.id,
                                  lesson: lessonNumber, // تمرير رقم الدرس مباشرة
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
                                  subject: "تاريخ",
                                  unit: unit.id,
                                  lesson: lessonNumber, // تمرير رقم الدرس مباشرة
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
                                  subject: "تاريخ",
                                  unit: unit.id,
                                  lesson: lessonNumber, // تمرير رقم الدرس مباشرة
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
                                  subject: "تاريخ",
                                  unit: unit.id,
                                  lesson: lessonNumber, // تمرير رقم الدرس مباشرة
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

export default History;

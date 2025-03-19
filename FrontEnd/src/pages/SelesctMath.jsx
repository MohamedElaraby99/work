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
  const location = useLocation();
  const [selectedUnit, setSelectedUnit] = useState(null); // الوحدة المختارة
  const [selectedLesson, setSelectedLesson] = useState(null); // الدرس المختار
  const [isSubscribed, setIsSubscribed] = useState(true);

  // Retrieve the educational stage and role from localStorage
  const stage = localStorage.getItem("stage");
  const role = localStorage.getItem("role");

  // Retrieve the subject from location state
  const { subject } = location.state || {};

  // Determine the number of units based on the subject
  let unitCount;
  if (subject === "مثلثات" || subject === "إحصاء") {
    unitCount = 5;
  } else {
    unitCount = 8; // Default value if subject is not recognized
  }

  // Check subscription (تم تعليق المنطق الأصلي، يمكن تعديله حسب الحاجة)
  useEffect(() => {
    // يمكنك إضافة منطق الاشتراك هنا إذا لزم الأمر
    // على سبيل المثال:
    // if (role === "student" && !subject) {
    //   setIsSubscribed(false);
    // }
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
          <h1>مادة الرياضيات</h1>
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
        <h1 className="iconnn">
          <span className="material-icons iconnn">calculate</span>
          مادة الـ{subject}
        </h1>
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
                                  subject: subject,
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
                                  subject: subject,
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
                                  subject: subject,
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
                                  subject: subject,
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

export default SelectMath;

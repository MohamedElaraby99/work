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

const English = () => {
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState(null); // الوحدة المختارة
  const [selectedLesson, setSelectedLesson] = useState(null); // الدرس المختار
  const [isSubscribed, setIsSubscribed] = useState(true);

  // استرداد المرحلة الدراسية والدور و subject من localStorage
  const stage = localStorage.getItem("stage");
  const role = localStorage.getItem("role");
  const subject = localStorage.getItem("subject");

  // فحص الاشتراك
  useEffect(() => {
    if (role === "student" && !subject.includes("انجليزي")) {
      setIsSubscribed(false);
    }
  }, [role, subject]);

  // بيانات الوحدات مع الدروس
  const courseUnits = Array.from({ length: 6 }, (_, i) => ({
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
                  src={require("./../images/mrahmedgozy.webp")}
                  alt="Subject"
                  className="history-image"
                  style={{ border: "2px solid #ccc" }}
                />
              </div>
              <div className="text-container">
                <h1>مادة اللغة الانجليزية</h1>
                <p>مـقدم الـمادة</p>
                <p className="history-subtitle">Mr - Ahmed Ghozy</p>
                <div className="social-linkss">
                  <a
                    href="https://www.facebook.com/share/18tQGTuUgK/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="https://www.instagram.com/aoghozy?igsh=MW5memZqMjd6NXV3OA=="
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://www.tiktok.com/@aoghozy?_r=1&_d=ea9clh1ahih945&sec_uid=MS4wLjABAAAAyPj4PpzeHkZ8_9lADwsubWWKanLxVRoK3HJR_1q6wBrOHB-t4-WuoCRIjdpe7029&share_author_id=6957505322089759749&sharer_language=en&source=h5_m&u_code=dib232gf07eeie×tamp=1741566718&user_id=6957505322089759749&sec_user_id=MS4wLjABAAAAyPj4PpzeHkZ8_9lADwsubWWKanLxVRoK3HJR_1q6wBrOHB-t4-WuoCRIjdpe7029&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7441054284672026376&share_link_id=36a45378-244d-4545-a12c-1426c0093f32&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b8727%2Cb0229&social_share_type=5&enable_checksum=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTiktok />
                  </a>
                  <a
                    href="https://wa.me/201015118313"
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
                src={require("./../images/mrahmedgozy.webp")}
                alt="Subject"
                className="history-image"
                style={{ border: "2px solid #ccc" }}
              />
            </div>
            <div className="text-container">
              <h1>مادة اللغة الانجليزية</h1>
              <p>مـقدم الـمادة</p>
              <p className="history-subtitle">Mr - Ahmed Ghozy</p>
              <div className="social-linkss">
                <a
                  href="https://www.facebook.com/share/18tQGTuUgK/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/aoghozy?igsh=MW5memZqMjd6NXV3OA=="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.tiktok.com/@aoghozy?_r=1&_d=ea9clh1ahih945&sec_uid=MS4wLjABAAAAyPj4PpzeHkZ8_9lADwsubWWKanLxVRoK3HJR_1q6wBrOHB-t4-WuoCRIjdpe7029&share_author_id=6957505322089759749&sharer_language=en&source=h5_m&u_code=dib232gf07eeie×tamp=1741566718&user_id=6957505322089759749&sec_user_id=MS4wLjABAAAAyPj4PpzeHkZ8_9lADwsubWWKanLxVRoK3HJR_1q6wBrOHB-t4-WuoCRIjdpe7029&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7441054284672026376&share_link_id=36a45378-244d-4545-a12c-1426c0093f32&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b8727%2Cb0229&social_share_type=5&enable_checksum=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTiktok />
                </a>
                <a
                  href="https://wa.me/201015118313"
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
                                  subject: "انجليزي",
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
                                  subject: "انجليزي",
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
                                  subject: "انجليزي",
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
                                  subject: "انجليزي",
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

export default English;

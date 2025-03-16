import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./../styles/exams.css";
import Loader from "./Loader";

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState(
    localStorage.getItem("stage") || ""
  ); // المرحلة الافتراضية من localStorage
  const role = localStorage.getItem("role"); // جلب الدور من localStorage

  const location = useLocation();
  const { subject = "", unit = "", type = "" } = location.state || {};

  const stages = ["ثالثة إعدادي", "أولى ثانوي", "ثانية ثانوي", "ثالثة ثانوي"];

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/exams?subject=${subject}&unit=${unit}&type=${type}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exams");
        }

        const data = await response.json();

        setExams(data);
        setFilteredExams(data); // Show all exams initially
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching exams.");
        setLoading(false);
      }
    };

    fetchExams();
  }, [subject, unit, type]);

  // تصفية الامتحانات بناءً على المرحلة الدراسية
  useEffect(() => {
    if (role !== "admin" && selectedStage) {
      // إذا لم يكن أدمن، استخدم المرحلة من localStorage فقط
      setFilteredExams(exams.filter((exam) => exam.stage === selectedStage));
    } else if (selectedStage) {
      // إذا كان أدمن وتم اختيار مرحلة، قم بالتصفية
      setFilteredExams(exams.filter((exam) => exam.stage === selectedStage));
    } else {
      // إذا لم يتم اختيار مرحلة (الكل)، اعرض جميع الامتحانات
      setFilteredExams(exams);
    }
  }, [selectedStage, exams, role]);

  if (loading) return <Loader />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="exams-page">
      <h2>الامتحانات</h2>

      {/* فلتر المرحلة الدراسية للأدمن فقط */}
      {role === "admin" && (
        <div className="stage-filter">
          <label htmlFor="stage-select">اختر المرحلة الدراسية: </label>
          <select
            id="stage-select"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="stage-dropdown"
          >
            <option value="">الكل</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
      )}

      {filteredExams.length === 0 ? (
        <div className="no-exams">لا يوجد امتحانات حالياً</div>
      ) : (
        <div className="exams-container">
          {filteredExams.map((exam) => {
            return (
              <div key={exam._id} className="exam-card">
                <h3>{exam.title}</h3>
                <p>التاريخ: {new Date(exam.date).toLocaleString()}</p>
                <p>
                  النوع: <span>{exam.type}</span>
                </p>
                <p>
                  الحالة:
                  <span className={`status ${exam.status}`}>{exam.status}</span>
                </p>
                {exam.status === "متاح" && (
                  <Link
                    to={`/exams/details/${exam?._id}`} // تعديل من exam.id إلى exam._id لتجنب أخطاء محتملة
                    className="exam-button"
                    state={{ exam }}
                  >
                    عرض التفاصيل
                  </Link>
                )}
                {exam.status === "قادم" && (
                  <button className="exam-button disabled" disabled>
                    غير متاح حاليًا
                  </button>
                )}
                {exam.status === "انتهى" && (
                  <Link
                    to={`/exams/details/${exam?._id}`} // تعديل من exam.id إلى exam._id
                    className="exam-button"
                    state={{ exam }}
                  >
                    عرض التفاصيل
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExamsPage;

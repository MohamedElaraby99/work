import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./../styles/exams.css";
import Loader from "./Loader";

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState(""); // لا قيمة افتراضية عند التحميل
  const [isFilterApplied, setIsFilterApplied] = useState(false); // حالة للتحكم في تطبيق الفلتر
  const role = localStorage.getItem("role"); // جلب الدور من localStorage

  const location = useLocation();
  const {
    subject = "",
    unit = "",
    type = "",
    lesson = "",
  } = location.state || {};

  const stages = [
    "free",

    "arabic1_grade1",
    "arabic1_grade2",
    "arabic1_grade3",
    "arabic1_grade4",
    "arabic1_grade5",
    "arabic1_grade6",
    "arabic1_grade7",
    "arabic1_grade8",
    "arabic1_grade9",
    "arabic1_grade10",
    "arabic1_grade11",
    "arabic1_grade12",
    "arabic2_kg1",
    "arabic2_kg2",
    "arabic2_grade1",
    "arabic2_grade2",
    "arabic2_grade3",
    "arabic2_grade4",
    "arabic2_grade5",
    "arabic2_grade6",
    "arabic2_grade7",
    "arabic2_grade8",
    "arabic2_grade9",
    "arabic2_grade10",
    "arabic2_grade11",
  ];

  // جلب الامتحانات عند التحميل
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/exams?subject=${subject}&unit=${unit}&type=${type}&lesson_number=${lesson}`,
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
        setFilteredExams(data); // عرض جميع الامتحانات افتراضيًا عند التحميل
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching exams.");
        setLoading(false);
      }
    };

    fetchExams();
  }, [subject, unit, type, lesson]);

  // دالة لتطبيق الفلتر يدويًا
  const applyFilter = (stage) => {
    if (stage && role !== "admin") {
      // إذا لم يكن أدمن، استخدم المرحلة من localStorage فقط
      setFilteredExams(exams.filter((exam) => exam.stage === stage));
    } else if (stage) {
      // إذا كان أدمن وتم اختيار مرحلة، قم بالتصفية
      setFilteredExams(exams.filter((exam) => exam.stage === stage));
    } else {
      // إذا لم يتم اختيار مرحلة (الكل)، اعرض جميع الامتحانات
      setFilteredExams(exams);
    }
    setIsFilterApplied(true); // تم تطبيق الفلتر
  };

  // معالجة تغيير المرحلة عند النقر
  const handleStageChange = (e) => {
    const newStage = e.target.value;
    setSelectedStage(newStage);
    applyFilter(newStage); // تطبيق الفلتر فقط عند تغيير القيمة يدويًا
  };

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
            onChange={handleStageChange} // تطبيق الفلتر فقط عند التغيير اليدوي
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
                    to={`/exams/details/${exam?._id}`}
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
                    to={`/exams/details/${exam?._id}`}
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

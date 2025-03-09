import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./../styles/exams.css";
import Loader from "./Loader";

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { subject = "", unit = "", type = "" } = location.state || {};

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
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="error">{error}</div>;
  if (filteredExams.length === 0)
    return <div className="no-exams">لا يوجد امتحانات حالياً</div>;

  return (
    <div className="exams-page">
      <h2>الامتحانات</h2>

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
                  to={`/exams/details/${exam?.id}`}
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
                  to={`/exams/details/${exam?.id}`}
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
    </div>
  );
};

export default ExamsPage;

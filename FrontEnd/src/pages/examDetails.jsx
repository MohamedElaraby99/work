import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./../styles/examDetails.css";

const ExamDetails = () => {
  const { id } = useParams(); // استلام id من الرابط
 
  const location = useLocation();
  const navigate = useNavigate(); // لاستخدام التنقل
  const exam = location.state?.exam; // البيانات الإضافية الممررة

  if (!id) {
    return <p>معرف الامتحان غير موجود!</p>;
  }

  const handleStartExam = () => {
    if (exam) {
      // التنقل إلى صفحة بدء الامتحان مع تمرير البيانات
      navigate(`/exams/start/${id}`, { state: { exam } });
    } else {
      console.error("لا توجد بيانات الامتحان!");
    }
  };

  return (
    <div>
      <h2 className="exam-detailss">تفاصيل الامتحان</h2>

      {exam ? (
        <div className="exam-detailss">
          <p>اسم الامتحان: {exam.title}</p>
          <p>الوصف: {exam.description}</p>
          <p>عدد الأسئلة: {exam.questionsCount}</p>
          {exam.status === "انتهى" ? (
            <>
              <p>الحالة: انتهى</p>
              <p>النتيجة: {exam.userScore}</p>
              {/* إخفاء المدة إذا كان الامتحان منتهيًا */}
            </>
          ) : (
            <>
              <p>الحالة: {exam.status}</p>
              <p>مدة الامتحان: {exam.duration} دقيقة</p>
              {exam?.userScore >= 0 && <p>النتيجة: {exam.userScore}</p>}
              {exam.status === "متاح" ? (
                exam?.attendance !== "حضر" && <button className="start-exam-button" onClick={handleStartExam}>
                   بدء الامتحان
                </button>
              ) : (
                <p style={{ color: "red" }}>الامتحان غير متاح حاليًا.</p>
              )}
            </>
          )}
        </div>
      ) : (
        <p>لا توجد بيانات إضافية للامتحان.</p>
      )}
    </div>
  );
};

export default ExamDetails;

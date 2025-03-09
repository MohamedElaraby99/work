import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ResultComponent from "./ResultComponent";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/ExamsSystem.css";

const ExamsSystem = () => {
  const location = useLocation();
  const examData = location.state?.exam;

  const [questionsArray] = useState(examData?.questions || []); // الأسئلة الممررة
  const [answers, setAnswers] = useState(examData?.questions || []);
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false); // حالة لعرض مكون النتيجة
  const [submissionResult, setSubmissionResult] = useState(null); // لتخزين نتيجة الإرسال

  const handleAnswerChange = (questionId, optionIndex) => {
    const updatedAnswers = answers.map((answer) => {
      if (questionId === answer?._id) {
        return { ...answer, questionId, selectedAnswer: optionIndex };
      }
      return answer;
    });
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken"); // الحصول على التوكن من التخزين المحلي
      if (!accessToken) {
        alert("لم يتم العثور على التوكن! يرجى تسجيل الدخول.");
        return;
      }

      // بناء بيانات الطلب
      const requestBody = {
        exam_id: examData.id, // معرف الامتحان
        answers: answers.map((q) => ({
          questionId: q.questionId,
          selectedAnswer:  q.selectedAnswer, // تأكد من أن الإجابة نصية
        })),
      };

    

      // إرسال الطلب إلى API
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/exams/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("فشل في إرسال الإجابات. يرجى المحاولة لاحقًا.");
      }

      const result = await response.json();
      setSubmissionResult(result); // تخزين النتيجة
      setSubmitted(true); // تحديث حالة التقديم
    } catch (error) {
      console.error("حدث خطأ أثناء إرسال الإجابات:", error);
      alert("حدث خطأ أثناء إرسال الإجابات. يرجى المحاولة لاحقًا.");
    }
  };



  const handleShowResult = () => {
    setShowResult(true); // الانتقال إلى عرض النتيجة
  };

  if (showResult) {
    return (
      <ResultComponent
        questionsArray={questionsArray}
        answers={answers}
        submissionResult={submissionResult}
      />
    );
  }

  return (
    <div className="exam-system-container">
      <h2 className="exam-system-title">{examData.title}</h2>
      <p>{examData.description}</p>
      {!submitted ? (
        <form className="exam-system-form">
          {questionsArray.map((q, index) => (
            <div key={q._id} className="exam-question-container">
              {q.image && (
                <div className="exam-image-container">
                  <img
                    src={q.image}
                    alt={`صورة للسؤال ${index + 1}`}
                    className="exam-image"
                  />
                </div>
              )}

              <h3 className="exam-question">
                السؤال {index + 1}: {q.question}
              </h3>

              <ul className="exam-options-list">
                {q.options.map((option, optIndex) => {
                  let optionClass = "exam-option";                  
                  if (answers[index]?.selectedAnswer === optIndex) {                    
                    optionClass += " exam-option-selected";
                  }
              

                  return (
                    <li key={optIndex} className={optionClass}>
                      <input
                        type="radio"
                        id={`option-${q._id}-${optIndex}`}
                        name={`question-${q._id}`}
                        value={optIndex}
                        checked={answers[index]?.selectedAnswer === optIndex}
                        onChange={() => handleAnswerChange(q._id, optIndex)}
                        className="exam-radio"
                      />
                      <label
                        className="exam-option-label"
                        htmlFor={`option-${q._id}-${optIndex}`}
                      >
                        {option}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <button
            type="button"
            onClick={handleSubmit}
            className="exam-submit-button"
          >
            تقديم الامتحان
          </button>
        </form>
      ) : (
        <div className="submitted-message">
          <p>
            <span className="submitted-text">تم تقديم الامتحان.</span> اضغط علي
            زر عرض التفاصيل لمعرفة النتيجة. &#8595;
          </p>
          <button
            type="button"
            onClick={handleShowResult}
            className="show-result-button"
          >
            عرض التفاصيل
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamsSystem;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ResultComponent from "./ResultComponent";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/ExamsSystem.css";
import { toast, ToastContainer } from "react-toastify";

const ExamsSystem = () => {
  const location = useLocation();
  const examData = location.state?.exam;

  const [questionsArray] = useState(examData?.questions || []);
  const [answers, setAnswers] = useState(examData?.questions || []);
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    if (!examData) return;

    const examStartTime = new Date(examData.date).getTime();
    const examDurationMs = examData.duration * 60 * 1000;
    const examEndTime = examStartTime + examDurationMs;

    const timer = setInterval(() => {
      const currentTime = Date.now();
      const timeRemaining = examEndTime - currentTime;

      if (timeRemaining <= 0) {
        clearInterval(timer);
        setIsTimeUp(true);
        setTimeLeft(0);
        handleSubmit(); // تقديم الامتحان تلقائيًا عند انتهاء الوقت
      } else {
        setTimeLeft(timeRemaining);
        if (timeRemaining <= 5 * 60 * 1000 && !notificationSent) {
          toast.warning("تنبيه: تبقت 5 دقائق فقط لإنهاء الامتحان!", {
            position: "top-right",
            autoClose: 3000,
          });
          setNotificationSent(true);
        }
      }
    }, 1000);

    // منع الخروج من الصفحة
    const handleBeforeUnload = (event) => {
      if (!submitted && !isTimeUp) {
        event.preventDefault();
        event.returnValue =
          "هل أنت متأكد أنك تريد الخروج؟ سيتم تقديم الامتحان تلقائيًا.";
        handleSubmit(); // تقديم الامتحان إذا تم تأكيد الخروج
      }
    };

    // الكشف عن تبديل علامات التبويب أو تقليل الصفحة
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !submitted && !isTimeUp) {
        toast.error(
          "تم الكشف عن محاولة الخروج! سيتم تقديم الامتحان تلقائيًا.",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
        handleSubmit(); // تقديم الامتحان تلقائيًا
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [examData, notificationSent, submitted, isTimeUp]);

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
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("لم يتم العثور على التوكن! يرجى تسجيل الدخول.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const requestBody = {
        exam_id: examData.id,
        answers: answers.map((q) => ({
          questionId: q.questionId || q._id, // التأكد من استخدام المعرف الصحيح
          selectedAnswer: q.selectedAnswer,
        })),
      };

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/exams/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("فشل في إرسال الإجابات.");
      }

      const result = await response.json();
      setSubmissionResult(result);
      setSubmitted(true);
    } catch (error) {
      console.error("حدث خطأ أثناء إرسال الإجابات:", error);
      toast.error("حدث خطأ أثناء إرسال الإجابات. تم تقديم الامتحان.", {
        position: "top-right",
        autoClose: 3000,
      });
      setSubmitted(true); // تعليم الامتحان كمقدم حتى في حالة الخطأ
    }
  };

  const handleShowResult = () => {
    setShowResult(true);
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
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

  if (isTimeUp) {
    return (
      <div className="time-up-message">
        <h2>انتهى وقت الامتحان.</h2>
        <p>تم تقديم الامتحان تلقائيًا.</p>
      </div>
    );
  }

  return (
    <div className="exam-system-container">
      <ToastContainer />
      <div className="exam-header">
        <h2 className="exam-system-title">{examData?.title}</h2>
        <p className="timer-display">
          <span className="timer">{formatTime(timeLeft)}</span> دقيقة
        </p>
        <p>{examData?.description}</p>
      </div>
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
            <span className="submitted-text">تم تقديم الامتحان.</span> اضغط على
            زر عرض التفاصيل لمعرفة النتيجة. ↓
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

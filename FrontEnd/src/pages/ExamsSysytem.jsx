import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResultComponent from "./ResultComponent";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/ExamsSystem.css";
import { toast, ToastContainer } from "react-toastify";

const ExamsSystem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const examData = location.state?.exam;

  const [questionsArray] = useState(examData?.questions || []);
  const [answers, setAnswers] = useState(
    examData?.questions.map((q) => ({ ...q, selectedAnswer: null })) || []
  );
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    const checkSubmission = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/exams/check-submission/${examData.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.submitted) {
            setExamSubmitted(true);
            toast.error("لقد قدمت هذا الامتحان مسبقاً!", { autoClose: 3000 });
            setTimeout(() => navigate("/"), 3000);
          }
        }
      } catch (error) {
        console.error("Error checking submission:", error);
      }
    };

    const submittedExams = JSON.parse(
      localStorage.getItem("submittedExams") || "[]"
    );
    if (submittedExams.includes(examData?.id)) {
      setExamSubmitted(true);
      toast.error("لقد قدمت هذا الامتحان مسبقاً!", { autoClose: 3000 });
      setTimeout(() => navigate("/"), 3000);
    } else {
      if (examData?.id) checkSubmission();
    }
  }, [examData?.id, navigate]);

  useEffect(() => {
    if (!examData || examSubmitted) return;

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
        handleSubmit();
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

    const handleBeforeUnload = (event) => {
      if (!submitted && !isTimeUp) {
        event.preventDefault();
        handleSubmit();
        event.returnValue = "";
      }
    };

    const enterFullScreen = () => {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(console.error);
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen().catch(console.error);
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen().catch(console.error);
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen().catch(console.error);
      }
    };

    const exitFullScreen = () => {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen().catch(console.error);
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen().catch(console.error);
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen().catch(console.error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !submitted && !isTimeUp) {
        handleSubmit();
        toast.error("تم تقديم الامتحان تلقائياً بسبب تغيير الصفحة!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    const disableTouchGestures = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.addEventListener("touchmove", disableTouchGestures, {
      passive: false,
    });
    document.addEventListener("gesturestart", disableTouchGestures);

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !submitted && !isTimeUp) {
        enterFullScreen();
        toast.warning("الرجاء البقاء في وضع الملء الشاشة!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    };

    enterFullScreen();
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    const fullscreenChecker = setInterval(() => {
      if (!document.fullscreenElement && !submitted && !isTimeUp) {
        enterFullScreen();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(fullscreenChecker);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener("touchmove", disableTouchGestures);
      document.removeEventListener("gesturestart", disableTouchGestures);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";

      if (document.fullscreenElement) {
        exitFullScreen();
      }
    };
  }, [examData, notificationSent, submitted, isTimeUp, examSubmitted]);

  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer._id === questionId
          ? { ...answer, selectedAnswer: optionIndex }
          : answer
      )
    );
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
          questionId: q._id,
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

      if (!response.ok) throw new Error("فشل في إرسال الإجابات.");

      const result = await response.json();
      setSubmissionResult(result);
      setSubmitted(true);

      const submittedExams = JSON.parse(
        localStorage.getItem("submittedExams") || "[]"
      );
      localStorage.setItem(
        "submittedExams",
        JSON.stringify([...submittedExams, examData.id])
      );

      toast.dismiss("startWarning");
    } catch (error) {
      console.error("حدث خطأ أثناء إرسال الإجابات:", error);
      toast.error("حدث خطأ أثناء إرسال الإجابات. تم تقديم الامتحان.", {
        position: "top-right",
        autoClose: 3000,
      });
      setSubmitted(true);
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

  const WarningModal = () => (
    <div className="warning-overlay">
      <div className="warning-modal">
        <h3>⚠️ انتبه!</h3>
        <p>يمنع منعاً باتاً:</p>
        <ul>
          <li>محاولة الخروج من الصفحة</li>
          <li>تبديل التبويبات أو التطبيقات</li>
          <li>إعادة تحميل الصفحة</li>
        </ul>
        <p>سيؤدي أي من هذه الإجراءات إلى إلغاء الامتحان فوراً!</p>
        <button
          className="confirm-button"
          onClick={() => {
            setShowWarning(false);
            toast.dismiss("startWarning");
          }}
        >
          أوافق على الشروط
        </button>
      </div>
    </div>
  );

  if (examSubmitted) {
    return (
      <div className="submitted-message">
        <h2>لا يمكنك الوصول لهذا الامتحان</h2>
        <p>لقد قمت بتقديم هذا الامتحان مسبقاً</p>
      </div>
    );
  }

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
    <>
      {showWarning && <WarningModal />}

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
                  {q.options.map((option, optIndex) => (
                    <li
                      key={optIndex}
                      className={`exam-option ${
                        answers[index]?.selectedAnswer === optIndex
                          ? "exam-option-selected"
                          : ""
                      }`}
                    >
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
                  ))}
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
              <span className="submitted-text">تم تقديم الامتحان.</span> اضغط
              على زر عرض التفاصيل لمعرفة النتيجة. ↓
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
    </>
  );
};

export default ExamsSystem;

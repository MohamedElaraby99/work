import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/ResultComponent.css";

const ResultComponent = ({ questionsArray, answers, submissionResult }) => {
  const navigate = useNavigate();
 

  // حساب النتيجة
  const correctAnswersCount = questionsArray.reduce((count, question) => {
    // تحويل الإجابة الصحيحة إلى رقم ومقارنة الاختيار مع الإجابة الصحيحة
    const correctAnswerIndex = parseInt(question.correctAnswer, 10);
    if (answers[question._id] === correctAnswerIndex) {
      return count + 1;
    }
    return count;
  }, 0);

  const totalQuestions = questionsArray.length;
  const percentage = (
    (+submissionResult?.score / totalQuestions) *
    100
  ).toFixed(0);

  const handleBackToExams = () => {
    navigate("/home");
  };

  return (
    <div className="result-container">
      <div className="result-header">
        <h2>نتيجة الامتحان</h2>
        <div className="result-score-circle">
          <div className="circle">
            <div className="circle-inner">{percentage}%</div>
          </div>
          <p className="score-details">
            أجبت <strong>{submissionResult?.score}</strong> من{" "}
            <strong>{totalQuestions}</strong> إجابة صحيحة
          </p>
        </div>
      </div>

      <ul className="result-list">
        {questionsArray.map((q, index) => {
          const selectedAnswer =
            answers[index]?.options[answers[index]?.selectedAnswer];
          const correctAnswerIndex = +q.correctAnswer;
          const isCorrect =
            +answers[index]?.selectedAnswer === +correctAnswerIndex;

      
         

          return (
            <li key={q._id} className="result-item">
              <p className="result-question">
                <strong>السؤال {index + 1}:</strong> {q.question}
              </p>
              <p className={`result-answer ${isCorrect ? "correct" : "wrong"}`}>
                <strong>إجابتك:</strong>
                {selectedAnswer || (
                  <span className="not-answered">لم يتم الإجابة</span>
                )}
              </p>
              {!isCorrect && (
                <p className="result-correct-answer">
                  <strong>الإجابة الصحيحة:</strong>
                  {q.options[correctAnswerIndex]}
                </p>
              )}
              {!isCorrect && q.why && (
                <p className="result-explanation">
                  <strong>التعليل:</strong> {q.why}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <button onClick={handleBackToExams} className="back-to-exams-button">
        العودة إلى صفحة الرئيسية
      </button>
    </div>
  );
};

export default ResultComponent;

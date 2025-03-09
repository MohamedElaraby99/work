import React, { useState } from "react";
import "./../styles/ManualQuestion.css";


const ManualQuestionComponent = ({ questions, setQuestions }) => {
  const addManualQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: null,
        image: null,
      },
    ]);
  };

  const updateManualQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "question") {
      updatedQuestions[index].question = value;
    } else if (field.startsWith("correctAnswer")) {
      updatedQuestions[index].correctAnswer = parseInt(value, 10);
    } else {
      const [optionIndex] = field.split("-");
      updatedQuestions[index].options[optionIndex] = value;
    }
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(updatedQuestions);
  };

  return (
    <div className="manual-question-container">
      <h3>إضافة أسئلة يدويًا</h3>
      <button onClick={addManualQuestion} className="add-question-btn">
        إضافة سؤال جديد
      </button>
      <p>عدد الأسئلة: {questions.length}</p>
      {questions.map((q, index) => (
        <div key={q.id} className="manual-question">
          <textarea
            placeholder={`أدخل نص السؤال ${q.id}`}
            value={q.question}
            onChange={(e) =>
              updateManualQuestion(index, "question", e.target.value)
            }
          />
          {q.options.map((option, optIndex) => (
            <div key={optIndex} className="option-container">
              <input
                type="text"
                placeholder={`خيار ${optIndex + 1}`}
                value={option}
                onChange={(e) =>
                  updateManualQuestion(
                    index,
                    `${optIndex}-option`,
                    e.target.value
                  )
                }
              />
              <label>
                <input
                  type="radio"
                  name={`correctAnswer-${index}`}
                  value={optIndex}
                  checked={q.correctAnswer === optIndex}
                  onChange={(e) =>
                    updateManualQuestion(index, "correctAnswer", e.target.value)
                  }
                />
                الإجابة الصحيحة
              </label>
            </div>
          ))}
          <button
            className="remove-question-btn"
            onClick={() => removeQuestion(index)}
          >
            حذف السؤال
          </button>
        </div>
      ))}
    </div>
  );
};

export default ManualQuestionComponent;

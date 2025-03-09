import React from "react";

const QuestionsListComponent = ({
  questions,
  handleImageUpload,
  submitExam,
}) => {
  return (
    <div className="questions-list-container">
      <h3>الأسئلة المستخرجة:</h3>
      <ul className="questions-list">
        {questions.map((q, index) => (
          <li key={q.id} className="question-item">
            {/* Display the uploaded image above the question */}
            {q.image && (
              <div className="question-image-container">
                <img
                  src={q.image}
                  alt={`صورة السؤال ${q.id}`}
                  className="question-image"
                />
              </div>
            )}

            {/* Question text */}
            <details>
              <summary>
                <strong>السؤال {q.id}:</strong>
              </summary>
              <textarea
                value={q.question}
                onChange={(e) =>
                  handleImageUpload(index, "question", e.target.value)
                }
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <ul>
                {q.options.map((option, idx) => (
                  <li key={idx}>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleImageUpload(index, idx, e.target.value)
                      }
                      style={{
                        width: "100%",
                        marginBottom: "5px",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                  </li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="الإجابة الصحيحة"
                value={q.correctAnswer || ""}
                onChange={(e) =>
                  handleImageUpload(index, "correctAnswer", e.target.value)
                }
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <label>
                أرفق صورة للسؤال:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e.target.files[0])}
                  style={{ marginTop: "10px" }}
                />
              </label>
            </details>
          </li>
        ))}
      </ul>
      <button
        onClick={submitExam}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4caf50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        تقديم الامتحان
      </button>
    </div>
  );
};

export default QuestionsListComponent;

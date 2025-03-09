import React, { useState } from "react";
import { toast } from "react-toastify";
import mammoth from "mammoth";
import Loader from "./../../pages/Loader.jsx";
import "./FileInputComponent.css";

const FileInputComponent = ({ onAddQuestions, onDeleteQuestion }) => {
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileImport = async (e) => {
    const file = e.target.files[0];

    if (file && file.name.endsWith(".docx")) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;

        try {
          setLoading(true);

          const htmlContent = await extractContentFromDocxToHTML(arrayBuffer);
          const questions = parseHtmlToQuestions(htmlContent);

          if (questions.length > 0) {
            setParsedQuestions(questions);
            onAddQuestions(questions);
            toast.success("تم استرجاع المحتوى بنجاح!", {
              position: "top-center",
            });
          } else {
            toast.warn("ليس هناك أسئلة في الملف.", {
              position: "top-center",
            });
          }
        } catch (error) {
          console.error(error);
          toast.error("حدث خطأ في استرجاع المحتوى.", {
            position: "top-center",
          });
        } finally {
          setLoading(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      toast.error("الرجاء رفع ملف .docx فقط.", {
        position: "top-center",
      });
    }
  };

  const extractContentFromDocxToHTML = async (arrayBuffer) => {
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value;
  };

  const parseHtmlToQuestions = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const questions = [];
    const allElements = [...doc.querySelectorAll("p, li")]; // تضمين عناصر الفقرات والقوائم

    let currentQuestion = null;

    allElements.forEach((element) => {
      const rawText = element.textContent;
      // تنظيف النص من المسافات الزائدة والرموز الخفية
      const cleanedText = rawText
        .replace(/\s+/g, " ")
        .replace(/[\u00A0]/g, " ")
        .trim();

      // اكتشاف السؤال (يدعم: "1)"، "-2"، "(3)"، إلخ)
      if (
        /^[-\d(\u0660-\u0669)]+[.)]\s+/.test(cleanedText) ||
        cleanedText.startsWith("السؤال")
      ) {
        if (currentQuestion) questions.push(currentQuestion);
        currentQuestion = {
          question: cleanedText.replace(/^[-\d(\u0660-\u0669)]+[.)]\s+/, ""),
          options: [],
          correctAnswer: null,
          image: null,
          why: "", // إضافة خانة للتعليل
        };
      }
      // اكتشاف الخيارات (تدعم: "أ-"، "ب."، "A-"، "1."، إلخ)
      else if (/^([أ-ي]|[A-Za-z]|\d+)[-.)]\s/.test(cleanedText)) {
        const optionText = cleanedText.replace(
          /^([أ-ي]|[A-Za-z]|\d+)[-.)]\s/,
          ""
        );
        if (currentQuestion) {
          currentQuestion.options.push(optionText);
        }
      }
      // اكتشاف الإجابة (تدعم: "الإجابة: ج"، "الجواب: 3"، إلخ)
      else if (
        cleanedText.startsWith("الإجابة:") ||
        cleanedText.startsWith("الجواب:")
      ) {
        const answer = cleanedText.split(":")[1].trim();
        if (currentQuestion) {
          currentQuestion.correctAnswer = answer;
        }
      }

      // معالجة الصور
      const image = element.querySelector("img");
      if (image && currentQuestion) {
        currentQuestion.image = image.getAttribute("src");
      }
    });

    if (currentQuestion) questions.push(currentQuestion);
    return questions;
  };

  const handleSetCorrectAnswer = (questionIndex, optionIndex) => {
    setParsedQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].correctAnswer = optionIndex;
      return updatedQuestions;
    });
  };

  const handleDeleteQuestion = (index) => {
    setParsedQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.filter((_, i) => i !== index);
      return updatedQuestions;
    });

    // إبلاغ `CreateExamComponent` لحذف السؤال من القائمة الرئيسية
    onDeleteQuestion(index);
  };

  const handleReplaceImage = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setParsedQuestions((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[index].image = e.target.result;
          return updatedQuestions;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExplanationChange = (index, event) => {
    setParsedQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].why = event.target.value;
      return updatedQuestions;
    });
  };

  return (
    <div className="file-input-container">
      <h3>استخراج الأسئلة من ملف Word</h3>
      <input
        type="file"
        accept=".docx"
        onChange={handleFileImport}
        className="file-input"
      />
      {loading && <Loader />}
      {!loading && parsedQuestions.length > 0 && (
        <div className="questions-container">
          <h3>قائمة الأسئلة:</h3>
          {parsedQuestions.map((q, index) => (
            <details key={index} className="question-item">
              <summary>
                <strong>السؤال {index + 1}:</strong>{" "}
                {q.question || "ليس هناك نص لهذا السؤال"}
              </summary>
              {q.image && (
                <div className="question-image">
                  <p>
                    <strong>الصورة:</strong>
                  </p>
                  <img
                    src={q.image}
                    alt={`الصورة ${index + 1}`}
                    className="question-image"
                  />
                  <label>
                    استبدال الصورة:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleReplaceImage(index, e)}
                      className="replace-image-input"
                    />
                  </label>
                </div>
              )}
              <ul className="options-list">
                {q.options.map((option, optIndex) => (
                  <li key={optIndex} className="option-item">
                    <span>{option}</span>
                    <button
                      onClick={() => handleSetCorrectAnswer(index, optIndex)}
                      className={`selectt-answer-button ${
                        q.correctAnswer === optIndex ? "selected" : ""
                      }`}
                    >
                      {q.correctAnswer === optIndex
                        ? "تم اختياره"
                        : "اختيار الإجابة"}
                    </button>
                  </li>
                ))}
              </ul>
              <label>
                التعليل:
                <textarea
                  value={q.why}
                  onChange={(e) => handleExplanationChange(index, e)}
                  className="explanation-textarea"
                />
              </label>
              <button
                onClick={() => handleDeleteQuestion(index)}
                className="delette-button"
              >
                حذف السؤال
              </button>
            </details>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileInputComponent;

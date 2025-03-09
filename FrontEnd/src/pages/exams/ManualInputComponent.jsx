import React, { useState } from "react";
import { toast } from "react-toastify";
import "./ManualInputComponent.css";

const ManualInputComponent = ({ onAddQuestions }) => {
  const [question, setQuestion] = useState("");
  const [why, setWhy] = useState(""); // حقل التعليل الجديد
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [image, setImage] = useState(null); // لحفظ الصورة المرفوعة

  const handleAddQuestion = () => {
    if (!question.trim()) {
      toast.error("يرجى إدخال نص السؤال!");
      return;
    }

    if (options.some((option) => !option.trim())) {
      toast.error("يرجى إدخال جميع الخيارات!");
      return;
    }

    if (correctAnswer === null) {
      toast.error("يرجى تحديد الإجابة الصحيحة!");
      return;
    }

    if (!why.trim()) {
      toast.error("يرجى إدخال التعليل!");
      return;
    }

    const newQuestion = {
      question,
      why, // إضافة التعليل إلى السؤال
      options,
      correctAnswer,
      image, // إضافة الصورة إلى البيانات
    };

    onAddQuestions([newQuestion]);
    setQuestion("");
    setWhy(""); // إعادة تعيين التعليل بعد إضافة السؤال
    setOptions(["", "", "", ""]);
    setCorrectAnswer(null);
    setImage(null); // إعادة تعيين الصورة
    toast.success("تم إضافة السؤال بنجاح!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // حفظ الصورة بصيغة base64
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="manual-input-container">
      <h3>إضافة سؤال يدوي</h3>
      <label>
        نص السؤال:
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="أدخل نص السؤال"
        ></input>
      </label>
      <label>
        التعليل:
        <input
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="أدخل التعليل لهذا السؤال"
        ></input>
      </label>
      <label>
        إضافة صورة:
        <input type="file" onChange={handleImageChange} accept="image/*" />
        {image && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={image}
              alt="معاينة الصورة"
              style={{
                maxWidth: "100%",
                maxHeight: "150px",
                borderRadius: "8px",
              }}
            />
          </div>
        )}
      </label>
      <label>
        الخيارات:
        {options.map((option, index) => (
          <div
            key={index}
            className="option-container"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <input
              type="text"
              value={option}
              onChange={(e) =>
                setOptions(
                  options.map((opt, i) => (i === index ? e.target.value : opt))
                )
              }
              placeholder={`الخيار ${index + 1}`}
              style={{ flex: 1 }}
            />
            <button
              onClick={() => setCorrectAnswer(index)}
              style={{
                backgroundColor: correctAnswer === index ? "green" : "gray",
                color: "white",
                border: "none",
                cursor: "pointer",
                padding: "5px 10px",
              }}
            >
              {correctAnswer === index ? "✓" : "اختر كإجابة صحيحة"}
            </button>
          </div>
        ))}
      </label>
      <button onClick={handleAddQuestion} style={{ marginTop: "20px" }}>
        إضافة السؤال
      </button>
    </div>
  );
};

export default ManualInputComponent;

import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import "./ManualInputComponent.css";

const ManualInputComponent = ({ onAddQuestions }) => {
  const [question, setQuestion] = useState("");
  const [why, setWhy] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [image, setImage] = useState(null);
  const imageInputRef = useRef(null); // إنشاء مرجع لحقل الإدخال

  const handleAddQuestion = () => {
    if (!question.trim()) {
      toast.error("الرجاء إدخال نص السؤال!");
      return;
    }

    if (options.some((option) => !option.trim())) {
      toast.error("الرجاء إدخال جميع الخيارات!");
      return;
    }

    if (correctAnswer === null) {
      toast.error("الرجاء تحديد الإجابة الصحيحة!");
      return;
    }

    // إعداد السؤال
    const newQuestion = {
      question,
      why: why.trim() ? why : undefined, // التعليل اختياري
      options,
      correctAnswer,
      image, // إضافة الصورة إلى البيانات
    };

    onAddQuestions([newQuestion]);
    setQuestion("");
    setWhy("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(null);
    setImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = ""; // إعادة تعيين قيمة حقل الإدخال
    }
    toast.success("تمت إضافة السؤال بنجاح!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.onerror = () => {
        toast.error("فشل في قراءة ملف الصورة.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
    if (correctAnswer === index) {
      setCorrectAnswer(null);
    } else if (correctAnswer > index) {
      setCorrectAnswer(correctAnswer - 1);
    }
  };

  return (
    <div className="manual-input-container">
      <h3>إضافة سؤال يدويًا</h3>
      <label>
        نص السؤال:
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="أدخل نص السؤال"
        />
      </label>
      <label>
        التعليل (اختياري):
        <input
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="أدخل التعليل لهذا السؤال (اختياري)"
        />
      </label>
      <label>
        إضافة صورة:
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          ref={imageInputRef} // ربط المرجع بحقل الإدخال
        />
        {image && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={image}
              alt="معاينة"
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
              onClick={() => handleDeleteOption(index)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
                padding: "5px 10px",
              }}
            >
              حذف
            </button>
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

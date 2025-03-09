import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./../../styles/dashboard/AddExam.css";
import FileInputComponent from "./../../pages/exams/FileInputComponent";
import ManualInputComponent from "./../../pages/exams/ManualInputComponent";
import moment from "moment";

const CreateExamComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [inputMode, setInputMode] = useState("file");
  const [examDetails, setExamDetails] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    stage: "",
    type: "",
    subject: "",
    unit: "",
  });

  const handleAddQuestions = (importedQuestions) => {
    setQuestions([...questions, ...importedQuestions]);
  };

  // دالة لحذف الأسئلة القادمة من `FileInputComponent`
  const handleDeleteQuestionFromFile = (index) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExamDetails({
      ...examDetails,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (
      !examDetails.title ||
      !examDetails.description ||
      !examDetails.date ||
      !examDetails.duration ||
      !examDetails.stage ||
      !examDetails.type ||
      !examDetails.subject ||
      !examDetails.unit ||
      questions.length === 0
    ) {
      toast.error("يرجى ملء جميع الحقول وإضافة الأسئلة!");
      return;
    }

    const examData = {
      title: examDetails.title,
      description: examDetails.description,
      date: moment(examDetails.date).format("YYYY-MM-DDTHH:mm"),
      duration: parseInt(examDetails.duration, 10),
      questions,
      stage: examDetails.stage,
      type: examDetails.type,
      subject: examDetails.subject,
      unit: examDetails.unit
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/exams`,
        examData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("تم إنشاء الامتحان بنجاح!");

      setExamDetails({
        title: "",
        description: "",
        date: "",
        duration: "",
        stage: "",
        type: "",
        subject: "",
        unit : "",
      });
      setQuestions([]);
    } catch (error) {
      console.error("حدث خطأ أثناء إنشاء الامتحان:", error);
      toast.error("حدث خطأ أثناء إنشاء الامتحان. حاول مرة أخرى.");
    }
  };

  return (
    <div className="container">
      <h2 className="exam-title">إنشاء امتحان</h2>

      <div className="exam-detailss">
        <label>
          عنوان الامتحان:
          <input
            type="text"
            name="title"
            value={examDetails.title}
            onChange={handleInputChange}
            placeholder="أدخل عنوان الامتحان"
          />
        </label>
        <label>
          وصف الامتحان:
          <input
            className="description"
            name="description"
            value={examDetails.description}
            onChange={handleInputChange}
            placeholder="أدخل وصف الامتحان"
          />
        </label>
        <label>
          نوع الامتحان:
          <select
            name="type"
            id="type"
            value={examDetails.type}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              اختر نوع الامتحان
            </option>
            <option value="امتحان">امتحان</option>
            <option value="تدريب">واجبات</option>
          </select>
        </label>
        <label>
          تاريخ الامتحان:
          <input
            type="datetime-local"
            name="date"
            value={examDetails.date}
            onChange={handleInputChange}
          />
        </label>
        <label>
          مدة الامتحان (بالدقائق):
          <input
            type="number"
            name="duration"
            value={examDetails.duration}
            onChange={handleInputChange}
            placeholder="أدخل مدة الامتحان بالدقائق"
          />
        </label>
        <label>
          المرحلة الدراسية:
          <select
            name="stage"
            value={examDetails.stage}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              اختر المرحلة الدراسية
            </option>
            <option value="أولى ثانوي">أولى ثانوي</option>
            <option value="ثانية ثانوي">ثانية ثانوي</option>
            <option value="ثالثة ثانوي">ثالثة ثانوي</option>
          </select>
        </label>
        <label>
          المادة:
          <select
            name="subject"
            value={examDetails.subject}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              اختر المادة
            </option>
            <option value="تاريخ">تاريخ</option>
            <option value="جغرافيا">جغرافيا</option>
          </select>
        </label>
        <label>
          الوحدة:
          <select
            name="unit"
            value={examDetails.unit}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              اختر الوحدة
            </option>
            <option value="0">الوحدة التمهيدية </option>
            <option value="1">الوحدة الأولى</option>
            <option value="2">الوحدة الثانية</option>
            <option value="3">الوحدة الثالثة</option>
            <option value="4">الوحدة الرابعة</option>
            <option value="5">الوحدة الخامسة</option>
            <option value="6">الوحدة السادسة</option>
            <option value="7">الوحدة السابعة</option>
            <option value="8">الوحدة الثامنة</option>
          </select>
        </label>
      </div>

      <div className="input-mode-selector">
        <label>
          <input
            type="radio"
            name="inputMode"
            value="file"
            checked={inputMode === "file"}
            onChange={() => setInputMode("file")}
          />
          تحميل ملف
        </label>
        <label>
          <input
            type="radio"
            name="inputMode"
            value="manual"
            checked={inputMode === "manual"}
            onChange={() => setInputMode("manual")}
          />
          إدخال يدوي
        </label>
      </div>

      {inputMode === "file" && (
        <FileInputComponent
          onAddQuestions={handleAddQuestions}
          onDeleteQuestion={handleDeleteQuestionFromFile}
        />
      )}
      {inputMode === "manual" && (
        <ManualInputComponent onAddQuestions={handleAddQuestions} />
      )}

      <div className="added-questions">
        <h3>الأسئلة المضافة</h3>
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <details key={index} className="question-details">
              <summary>
                <strong>السؤال {index + 1}:</strong> {q.question}
              </summary>
              {q.image && (
                <img
                  src={q.image}
                  alt={`Question ${index + 1}`}
                  className="question-image"
                />
              )}
              <ul className="options-list">
                {q.options.map((option, optIndex) => (
                  <li
                    key={optIndex}
                    className={`option-item ${
                      q.correctAnswer === optIndex ? "correct-answer" : ""
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </details>
          ))
        ) : (
          <p>لا توجد أسئلة مضافة بعد.</p>
        )}
      </div>

      <button onClick={handleSubmit} className="submit-button">
        إنشاء الامتحان
      </button>

      <ToastContainer />
    </div>
  );
};

export default CreateExamComponent;

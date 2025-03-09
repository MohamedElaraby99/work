import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../../styles/dashboard/addPosts.css";

const CreatePostComponent = () => {
  // States for form fields
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedYears, setSelectedYears] = useState([]);
  const [subject, setSubject] = useState("");
  const [mathSubjects, setMathSubjects] = useState([]);

  // List of years
  const years = ["الصف الأول", "الصف الثاني", "الصف الثالث", "ثالثة إعدادي"];

  // List of math subcategories
  const mathSubjectsList = ["جبر", "هندسة", "حساب مثلثات", "تفاضل", "إحصاء"];

  // Toggle selected years
  const handleYearToggle = (year) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((y) => y !== year));
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  // Handle math subjects toggle
  const handleMathSubjectsToggle = (subject) => {
    if (mathSubjects.includes(subject)) {
      setMathSubjects(mathSubjects.filter((s) => s !== subject));
    } else {
      setMathSubjects([...mathSubjects, subject]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !details || !subject || selectedYears.length === 0) {
      toast.error("يرجى تعبئة جميع الحقول!");
      return;
    }

    const newPost = {
      title,
      description: details,
      stage: selectedYears,
      subject,
      mathSubjects: subject === "رياضيات" ? mathSubjects : [],
    };

    try {
      const accessToken = localStorage.getItem("accessToken");

      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/announcements`,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTitle("");
      setDetails("");
      setSelectedYears([]);
      setSubject("");
      setMathSubjects([]);

      toast.success("تم إنشاء الإعلان بنجاح!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("حدث خطأ أثناء إنشاء الإعلان.");
    }
  };

  return (
    <div className="create-post-component">
      <ToastContainer />
      <header className="posts-header">
        <h2>إنشاء إعلان جديد</h2>
      </header>

      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">عنوان الإعلان:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="أدخل عنوان الإعلان"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="details">تفاصيل الإعلان:</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="أدخل تفاصيل الإعلان"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>السنة الدراسية الموجهة:</label>
          <div className="years-checkboxes">
            {years.map((year) => (
              <div key={year} className="checkbox-item">
                <input
                  type="checkbox"
                  id={year}
                  checked={selectedYears.includes(year)}
                  onChange={() => handleYearToggle(year)}
                />
                <label htmlFor={year}>{year}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="subject">المادة الدراسية :</label>
          <select
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">اختر المادة </option>
            <option value="تاريخ">تاريخ</option>
            <option value="رياضيات">رياضيات</option>
            <option value="لغة فرنسية">لغة فرنسية</option>
            <option value="لغة انجليزية">لغة انجليزية</option>
          </select>
        </div>

        {subject === "رياضيات" && (
          <div className="form-group">
            <label>اختر مواد الرياضيات:</label>
            <div className="math-checkboxes">
              {mathSubjectsList.map((mathSubject) => (
                <div key={mathSubject} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={mathSubject}
                    checked={mathSubjects.includes(mathSubject)}
                    onChange={() => handleMathSubjectsToggle(mathSubject)}
                  />
                  <label htmlFor={mathSubject}>{mathSubject}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="submit-btn">
          إنشاء الإعلان
        </button>
      </form>
    </div>
  );
};

export default CreatePostComponent;

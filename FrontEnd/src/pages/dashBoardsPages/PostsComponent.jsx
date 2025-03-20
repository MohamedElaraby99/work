import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../../styles/dashboard/addPosts.css";

const CreatePostComponent = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // المراحل العربية
  const arabicYears = [
    "1 ابتدائي",
    "2 ابتدائي",
    "3 ابتدائي",
    "4 ابتدائي",
    "5 ابتدائي",
    "6 ابتدائي",
    "1 إعدادي",
    "2 إعدادي",
    "3 إعدادي",
    "1 ثانوي",
    "2 ثانوي",
    "3 ثانوي",
  ];

  // المراحل الإنجليزية
  const englishYears = [
    "KG 1",
    "KG 2",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
  ];

  // المواد الدراسية
  const subjects = [
    { label: "لغة عربية", value: "arabic1", years: arabicYears },
    { label: "Arabic", value: "arabic2", years: englishYears },
  ];

  // Toggle selected years
  const handleYearToggle = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  // Toggle selected subjects
  const handleSubjectToggle = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !details ||
      selectedSubjects.length === 0 ||
      selectedYears.length === 0
    ) {
      toast.error("يرجى تعبئة جميع الحقول!");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");

      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/announcements`,
        {
          title,
          details,
          years: selectedYears,
          subjects: selectedSubjects,
        },
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
      setSelectedSubjects([]);

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

        <div className="form-group years-subjects">
          <label>السنة الدراسية الموجهة والمادة الدراسية:</label>
          <div className="years-checkboxes">
            {subjects.map((subject) => (
              <div key={subject.value} className="subject-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id={subject.value}
                    checked={selectedSubjects.includes(subject.value)}
                    onChange={() => handleSubjectToggle(subject.value)}
                  />
                  <label htmlFor={subject.value}>{subject.label}</label>
                </div>
                {/* عرض المراحل المرتبطة بالمادة */}
                {subject.years.map((year) => (
                  <div key={year} className="checkbox-item year-subitem">
                    <input
                      type="checkbox"
                      id={`${subject.value}-${year}`}
                      checked={selectedYears.includes(year)}
                      onChange={() => handleYearToggle(year)}
                      disabled={!selectedSubjects.includes(subject.value)} // تعطيل الخيار إذا لم يتم اختيار المادة
                    />
                    <label htmlFor={`${subject.value}-${year}`}>{year}</label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          إنشاء الإعلان
        </button>
      </form>
    </div>
  );
};

export default CreatePostComponent;

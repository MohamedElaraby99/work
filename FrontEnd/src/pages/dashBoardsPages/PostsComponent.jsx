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
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isMathExpanded, setIsMathExpanded] = useState(false);

  // List of years
  const years = ["ثالثة اعدادي", "أولى ثانوي", "ثانية ثانوي", "ثالثة ثانوي"];

  // List of subjects
  const subjects = [
    { label: "تاريخ", value: "تاريخ" },
    { label: "لغة فرنسية", value: "فرنسي" },
    { label: "لغة انجليزية", value: "انجليزي" },
    {
      label: "رياضيات",
      options: [
        { label: "جبر", value: "جبر" },
        { label: "هندسة", value: "هندسة" },
        { label: "تفاضل", value: "تفاضل" },
        { label: "مثلثات", value: "مثلثات" },
        { label: "إحصاء", value: "إحصاء" },
        { label: "استاتيكا", value: "استاتيكا" },
        { label: "ديناميكا", value: "ديناميكا" }, 
      ],
    },
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

  // Toggle math options visibility
  const toggleMathOptions = () => {
    setIsMathExpanded(!isMathExpanded);
    if (!isMathExpanded) {
      // Remove "رياضيات" from selected subjects when expanding
      setSelectedSubjects((prev) => prev.filter((s) => s !== "رياضيات"));
    }
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

    const newPost = {
      title,
      description: details,
      stage: selectedYears,
      subject: selectedSubjects.filter((s) => s !== "رياضيات"), // Exclude "رياضيات"
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
      setSelectedSubjects([]);
      setIsMathExpanded(false);

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
          <div className="years-checkboxes">
            {subjects.map((subjectGroup) =>
              subjectGroup.options ? (
                <div key={subjectGroup.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={subjectGroup.value}
                    checked={isMathExpanded}
                    onChange={toggleMathOptions}
                  />
                  <label htmlFor={subjectGroup.value}>
                    {subjectGroup.label}
                  </label>
                  {isMathExpanded && (
                    <div className="sub-options">
                      {subjectGroup.options.map((option) => (
                        <div key={option.value} className="checkbox-item">
                          <input
                            type="checkbox"
                            id={option.value}
                            checked={selectedSubjects.includes(option.value)}
                            onChange={() => handleSubjectToggle(option.value)}
                          />
                          <label htmlFor={option.value}>{option.label}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div key={subjectGroup.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={subjectGroup.value}
                    checked={selectedSubjects.includes(subjectGroup.value)}
                    onChange={() => handleSubjectToggle(subjectGroup.value)}
                  />
                  <label htmlFor={subjectGroup.value}>
                    {subjectGroup.label}
                  </label>
                </div>
              )
            )}
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

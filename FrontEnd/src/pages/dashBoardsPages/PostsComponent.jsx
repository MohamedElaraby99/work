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

  // المواد الدراسية مع المراحل وقيمها
  const subjects = [
    {
      label: "مجاني",
      value: "مجاني",
      years: [
        { label: "مجاني", value: "free" },
      ],
    },
    {
      label: "لغة عربية",
      value: "arabic1",
      years: [
        { label: "1 ابتدائي", value: "arabic1_grade1" },
        { label: "2 ابتدائي", value: "arabic1_grade2" },
        { label: "3 ابتدائي", value: "arabic1_grade3" },
        { label: "4 ابتدائي", value: "arabic1_grade4" },
        { label: "5 ابتدائي", value: "arabic1_grade5" },
        { label: "6 ابتدائي", value: "arabic1_grade6" },
        { label: "1 إعدادي", value: "arabic1_grade7" },
        { label: "2 إعدادي", value: "arabic1_grade8" },
        { label: "3 إعدادي", value: "arabic1_grade9" },
        { label: "1 ثانوي", value: "arabic1_grade10" },
        { label: "2 ثانوي", value: "arabic1_grade11" },
        { label: "3 ثانوي", value: "arabic1_grade12" },
      ],
    },
    {
      label: "Arabic",
      value: "arabic2",
      years: [
        { label: "KG 1", value: "arabic2_kg1" },
        { label: "KG 2", value: "arabic2_kg2" },
        { label: "Grade 1", value: "arabic2_grade1" },
        { label: "Grade 2", value: "arabic2_grade2" },
        { label: "Grade 3", value: "arabic2_grade3" },
        { label: "Grade 4", value: "arabic2_grade4" },
        { label: "Grade 5", value: "arabic2_grade5" },
        { label: "Grade 6", value: "arabic2_grade6" },
        { label: "Grade 7", value: "arabic2_grade7" },
        { label: "Grade 8", value: "arabic2_grade8" },
        { label: "Grade 9", value: "arabic2_grade9" },
        { label: "Grade 10", value: "arabic2_grade10" },
        { label: "Grade 11", value: "arabic2_grade11" },
      ],
    },
  ];

  // Toggle selected years
  const handleYearToggle = (yearValue) => {
    setSelectedYears((prev) =>
      prev.includes(yearValue)
        ? prev.filter((y) => y !== yearValue)
        : [...prev, yearValue]
    );
  };

  // Toggle selected subjects
  const handleSubjectToggle = (subjectValue) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectValue)
        ? prev.filter((s) => s !== subjectValue)
        : [...prev, subjectValue]
    );

    // إذا تم إلغاء اختيار المادة، قم بإزالة جميع المراحل المرتبطة بها من selectedYears
    if (selectedSubjects.includes(subjectValue)) {
      const subjectYears = subjects
        .find((s) => s.value === subjectValue)
        .years.map((y) => y.value);
      setSelectedYears((prev) => prev.filter((y) => !subjectYears.includes(y)));
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

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token is missing.");
      }

      const newPost = {
        title,
        description: details, // تغيير "details" إلى "description" لتتناسب مع معظم واجهات الـ API
        stages: selectedYears, // استخدام "stages" بدلاً من "years" للتوافق
        subjects: selectedSubjects,
      };

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

      toast.success("تم إنشاء الإعلان بنجاح!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء إنشاء الإعلان."
      );
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
          <div className="subjects-checkboxes">
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
                {selectedSubjects.includes(subject.value) && (
                  <div className="years-suboptions">
                    {subject.years.map((year) => (
                      <div
                        key={year.value}
                        className="checkbox-item year-subitem"
                      >
                        <input
                          type="checkbox"
                          id={year.value}
                          checked={selectedYears.includes(year.value)}
                          onChange={() => handleYearToggle(year.value)}
                        />
                        <label htmlFor={year.value}>{year.label}</label>
                      </div>
                    ))}
                  </div>
                )}
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

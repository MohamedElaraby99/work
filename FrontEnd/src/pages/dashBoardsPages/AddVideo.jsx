import React, { useState } from "react";
import axios from "axios";
import "./../../styles/dashboard/AddVideo.css";

const AddVideo = () => {
  const [videoData, setVideoData] = useState({
    title: "",
    lesson_link: "",
    stage: "",
    subject: "",
    description: "",
    notes: "",
    unit: "",
    lesson_number: "",
  });

  const [mathTopic, setMathTopic] = useState(""); // New state for math topic
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideoData({ ...videoData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      lesson_link,
      stage,
      description,
      notes,
      subject,
      unit,
      lesson_number,
    } = videoData;

    // Validate that fields are not empty
    if (
      !title ||
      !lesson_link ||
      !stage ||
      !description ||
      !notes ||
      !subject ||
      !lesson_number ||
      !unit ||
      (subject === "رياضيات" && !mathTopic) // Ensure math topic is selected if subject is math
    ) {
      setMessage("");
      setError("الرجاء ملء جميع الحقول.");
      return;
    }

    // Prepare the data to send to the API
    const requestData = {
      title,
      lesson_link,
      stage,
      description,
      notes,
      subject,// Use math topic if subject is math
      unit,
      lesson_number,
    };

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const accessToken = localStorage.getItem("accessToken"); // Retrieve the token from localStorage
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/lessons`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage("تم إضافة الفيديو بنجاح!");
      setError("");

      // Reset the form
      setVideoData({
        title: "",
        lesson_link: "",
        stage: "",
        subject: "",
        description: "",
        notes: "",
        unit: "",
        lesson_number: "",
      });
      setMathTopic(""); // Reset math topic
    } catch (err) {
      setError("حدث خطأ أثناء إضافة الفيديو. الرجاء المحاولة مرة أخرى.");
      console.error("Error adding video:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-video-container">
      <h2>إضافة فيديو جديد</h2>
      {message && <p className="message success-message">{message}</p>}
      {error && <p className="message error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="add-video-form">
        <div className="form-group">
          <label htmlFor="title">عنوان الفيديو:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={videoData.title}
            onChange={handleChange}
            placeholder="أدخل عنوان الفيديو"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lesson_link">رابط الفيديو على يوتيوب:</label>
          <input
            type="text"
            id="lesson_link"
            name="lesson_link"
            value={videoData.lesson_link}
            onChange={handleChange}
            placeholder="أدخل رابط يوتيوب"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">اختر المادة:</label>
          <select
            id="subject"
            name="subject"
            value={videoData.subject}
            onChange={handleChange}
          >
            <option value="" disabled>
              اختر المادة
            </option>
            <option value="arabic1">لغة عربية</option>
            <option value="arabic2">Arabic</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="stage">المرحلة الدراسية:</label>
          <select
            id="stage"
            name="stage"
            value={videoData.stage}
            onChange={handleChange}
          >
            <option value="" disabled>
              اختر المرحلة الدراسية
            </option>
            <optgroup label="لغة عربية">
              <option value="arabic1_grade1">1 ابتدائي</option>
              <option value="arabic1_grade2">2 ابتدائي</option>
              <option value="arabic1_grade3">3 ابتدائي</option>
              <option value="arabic1_grade4">4 ابتدائي</option>
              <option value="arabic1_grade5">5 ابتدائي</option>
              <option value="arabic1_grade6">6 ابتدائي</option>
              <option value="arabic1_grade7">1 إعدادي</option>
              <option value="arabic1_grade8">2 إعدادي</option>
              <option value="arabic1_grade9">3 إعدادي</option>
              <option value="arabic1_grade10">1 ثانوي</option>
              <option value="arabic1_grade11">2 ثانوي</option>
              <option value="arabic1_grade12">3 ثانوي</option>
            </optgroup>
            <optgroup label="Arabic">
              <option value="arabic2_kg1">KG 1</option>
              <option value="arabic2_kg2">KG 2</option>
              <option value="arabic2_grade1">Grade 1</option>
              <option value="arabic2_grade2">Grade 2</option>
              <option value="arabic2_grade3">Grade 3</option>
              <option value="arabic2_grade4">Grade 4</option>
              <option value="arabic2_grade5">Grade 5</option>
              <option value="arabic2_grade6">Grade 6</option>
              <option value="arabic2_grade7">Grade 7</option>
              <option value="arabic2_grade8">Grade 8</option>
              <option value="arabic2_grade9">Grade 9</option>
              <option value="arabic2_grade10">Grade 10</option>
              <option value="arabic2_grade11">Grade 11</option>
            </optgroup>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="unit">اختر الوحدة:</label>
          <select name="unit" value={videoData.unit} onChange={handleChange}>
            <option value="" disabled>
              اختر الوحدة
            </option>
            <option value="1">الوحدة الأولى</option>
            <option value="2">الوحدة الثانية</option>
            <option value="3">الوحدة الثالثة</option>
            <option value="4">الوحدة الرابعة</option>
            <option value="5">الوحدة الخامسة</option>
            <option value="6">الوحدة السادسة</option>
            <option value="7">الوحدة السابعة</option>
            <option value="8">الوحدة الثامنة</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="lesson_number">اختر الدرس:</label>
          <select
            name="lesson_number"
            value={videoData.lesson_number}
            onChange={handleChange}
          >
            <option value="" disabled>
              اختر رقم الدرس
            </option>
            <option value="1">الدرس الاول</option>
            <option value="2">الدرس الثاني</option>
            <option value="3">الدرس الثالث</option>
            <option value="4">الدرس الرابع</option>
            <option value="5">الدرس الخامس</option>
            <option value="6">الدرس السادس</option>
            <option value="7">الدرس السابع</option>
            <option value="8">الدرس الثامن</option>
            <option value="9">الدرس التاسع</option>
            <option value="10">الدرس العاشر</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">وصف الفيديو:</label>
          <textarea
            id="description"
            name="description"
            value={videoData.description}
            onChange={handleChange}
            placeholder="أدخل وصف الفيديو"
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">ملاحظات الفيديو:</label>
          <textarea
            id="notes"
            name="notes"
            value={videoData.notes}
            onChange={handleChange}
            placeholder="أدخل ملاحظات الفيديو"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "جارٍ الإضافة..." : "إضافة فيديو"}
        </button>
      </form>
    </div>
  );
};

export default AddVideo;

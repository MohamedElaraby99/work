import React, { useState } from "react";
import axios from "axios";
import "./../../styles/dashboard/AddVideo.css";

const AddVideo = () => {
  const [videoData, setVideoData] = useState({
    title: "",
    lesson_link: "",
    stage: "",
    subjects: [], // تأكد من أنها مصفوفة فارغة في البداية
    mathTopics: [], // تأكد من أنها مصفوفة فارغة في البداية
    description: "",
    notes: "",
    unit: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideoData({ ...videoData, [name]: value });
    // تحديث القيمة المختارة في المواضيع
    if (name === "subjects") {
      if (e.target.checked) {
        setVideoData({
          ...videoData,
          subjects: [...videoData.subjects, value],
        });
      } else {
        setVideoData({
          ...videoData,
          subjects: videoData.subjects.filter((subject) => subject !== value),
        });
      }
    }
    // تحديث القيمة المختارة في مواضيع الرياضيات
    if (name === "mathTopics") {
      if (e.target.checked) {
        setVideoData({
          ...videoData,
          mathTopics: [...videoData.mathTopics, value],
        });
      } else {
        setVideoData({
          ...videoData,
          mathTopics: videoData.mathTopics.filter((topic) => topic !== value),
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, youtubeLink, stage, description, notes, subject, unit } =
      videoData;

    // تحقق من أن الحقول ليست فارغة
    if (
      !title ||
      !youtubeLink ||
      !stage ||
      !description ||
      !notes ||
      !subject ||
      !unit
    ) {
      setMessage("");
      setError("الرجاء ملء جميع الحقول.");
      return;
    }

    // إعداد البيانات لإرسالها إلى API
    const requestData = {
      title,
      lesson_link: youtubeLink, // تحويل youtubeLink إلى lesson_link (الاسم المتوقع في API)
      stage,
      description,
      notes,
      subject,
      unit,
    };

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const accessToken = localStorage.getItem("accessToken"); // جلب التوكن من LocalStorage
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/lessons`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // تضمين التوكن في الرؤوس
          },
        }
      );

      setMessage("تم إضافة الفيديو بنجاح!");
      setError("");

      // إعادة تعيين النموذج
      setVideoData({
        title: "",
        youtubeLink: "",
        stage: "",
        description: "",
        notes: "",
        subject: "",
        unit: "",
      });
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
          <label htmlFor="youtubeLink">رابط الفيديو على يوتيوب:</label>
          <input
            type="text"
            id="youtubeLink"
            name="youtubeLink"
            value={videoData.youtubeLink}
            onChange={handleChange}
            placeholder="أدخل رابط يوتيوب"
          />
        </div>
        <div className="form-group">
          <label htmlFor="stage">المرحلة الدراسية:</label>
          <select
            id="stage"
            name="stage"
            value={videoData.stage}
            onChange={handleChange}
          >
            <option value="">اختر المرحلة الدراسية</option>
            <option value="ثالث اعدادي ">ثالث اعدادي</option>
            <option value="أولى ثانوي">أولى ثانوي</option>
            <option value="ثانية ثانوي">ثانية ثانوي</option>
            <option value="ثالثة ثانوي">ثالثة ثانوي</option>
          </select>
        </div>
        <label>
          المواد:
          <div>
            <label>
              <input
                type="checkbox"
                name="subjects"
                value="تاريخ"
                checked={
                  videoData.subjects && videoData.subjects.includes("تاريخ")
                }
                onChange={handleChange}
              />
              تاريخ
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="subjects"
                value="لغة انجليزية"
                checked={videoData.subjects.includes("لغة انجليزية")}
                onChange={handleChange}
              />
              لغة انجليزية
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="subjects"
                value="لغة فرنسية"
                checked={videoData.subjects.includes("لغة فرنسية")}
                onChange={handleChange}
              />
              لغة فرنسية
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="subjects"
                value="رياضيات"
                checked={videoData.subjects.includes("رياضيات")}
                onChange={handleChange}
              />
              رياضيات
            </label>
          </div>
        </label>

        {videoData.subjects.includes("رياضيات") && (
          <div>
            <label>
              مواضيع الرياضيات:
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="mathTopics"
                    value="الجبر"
                    checked={videoData.mathTopics.includes("الجبر")}
                    onChange={handleChange}
                  />
                  الجبر
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="mathTopics"
                    value="الهندسة"
                    checked={videoData.mathTopics.includes("الهندسة")}
                    onChange={handleChange}
                  />
                  الهندسة
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="mathTopics"
                    value="حساب المثلثات"
                    checked={videoData.mathTopics.includes("حساب المثلثات")}
                    onChange={handleChange}
                  />
                  حساب المثلثات
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="mathTopics"
                    value="التفاضل"
                    checked={videoData.mathTopics.includes("التفاضل")}
                    onChange={handleChange}
                  />
                  التفاضل
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="mathTopics"
                    value="الإحصاء"
                    checked={videoData.mathTopics.includes("الإحصاء")}
                    onChange={handleChange}
                  />
                  الإحصاء
                </label>
              </div>
            </label>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="subject"> اختر الوحدة :</label>
          <select
            name="unit"
            type="number"
            value={videoData.unit}
            onChange={handleChange}
          >
            <option value="disabled">اختر الوحدة</option>
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

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./../styles/courses.css";
import Loader from "./Loader";

const CoursesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {subject, unit} = location.state;

  // حالة لتخزين الفيديوهات
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ

  // جلب الفيديوهات من API عند تحميل الصفحة
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // الحصول على رمز المصادقة
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/lessons?subject=${subject}&unit=${unit}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // تضمين التوكن
          },
        });

        setVideos(response.data); // تخزين البيانات القادمة من API
        setError(null); // إعادة تعيين الخطأ إذا نجحت العملية
      } catch (err) {
        setError("حدث خطأ أثناء تحميل الفيديوهات."); // التعامل مع الأخطاء
      } finally {
        setLoading(false); // إنهاء حالة التحميل
      }
    };

    fetchVideos();
  }, []);

  // استخراج Video ID من الرابط
  const extractVideoId = (url) => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null; // إذا تم العثور على ID
  };

  // التعامل مع النقر على فيديو
  const handleVideoClick = (video) => {
    navigate(`/video-details/${video._id}`, {
      state: { video },
    }); // التنقل إلى صفحة التفاصيل مع id الفيديو
  };

  if (loading) {
    return <Loader />; // عرض حالة التحميل
  }

  if (error) {
    return <p className="error-message">{error}</p>; // عرض رسالة الخطأ إذا حدثت مشكلة
  }

  return (
    <div className="courses-page">
      <h2 className="section-title">
        <span className="material-icons">book</span>
        فيديوهات الشرح
      </h2>
      <section className="video-section">
        <div className="videos-grid">
          {videos.map((video) => {
            const videoId = extractVideoId(video.lesson_link); // استخراج Video ID
            const thumbnailUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : "https://via.placeholder.com/300x200.png?text=No+Thumbnail"; // صورة افتراضية

            return (
              <div
                className="video-container"
                key={video._id}
                onClick={() => handleVideoClick(video)} // تمرير id الفيديو
              >
                <img
                  src={thumbnailUrl}
                  alt={video.title}
                  className="video-thumbnail"
                />
                <div className="video-info">
                  <h1 className="video-titlee">{video.title}</h1>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;

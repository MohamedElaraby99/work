import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./../styles/courses.css";
import Loader from "./Loader";

const CoursesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, unit, lesson } = location.state;

  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState(
    localStorage.getItem("stage") || ""
  ); // المرحلة الافتراضية من localStorage
  const role = localStorage.getItem("role"); // جلب الدور من localStorage

  const stages = ["ثالثة إعدادي", "أولى ثانوي", "ثانية ثانوي", "ثالثة ثانوي"];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/lessons?subject=${subject}&unit=${unit}&lesson_number=${lesson}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setVideos(response.data);
        setFilteredVideos(response.data); // تعيين الفيديوهات الأولية
        setError(null);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل الفيديوهات.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [subject, unit, lesson]);

  // تصفية الفيديوهات بناءً على المرحلة الدراسية
  useEffect(() => {
    if (role !== "admin" && selectedStage) {
      // إذا لم يكن أدمن، استخدم المرحلة من localStorage فقط
      setFilteredVideos(
        videos.filter((video) => video.stage === selectedStage)
      );
    } else if (selectedStage) {
      // إذا كان أدمن وتم اختيار مرحلة، قم بالتصفية
      setFilteredVideos(
        videos.filter((video) => video.stage === selectedStage)
      );
    } else {
      // إذا لم يتم اختيار مرحلة (الكل)، اعرض جميع الفيديوهات
      setFilteredVideos(videos);
    }
  }, [selectedStage, videos, role]);

  const extractVideoId = (url) => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleVideoClick = (video) => {
    navigate(`/video-details/${video._id}`, {
      state: { video },
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="courses-page">
      <h2 className="section-title">
        <span className="material-icons">book</span>
        فيديوهات الشرح
      </h2>

      {/* فلتر المرحلة الدراسية للأدمن فقط */}
      {role === "admin" && (
        <div className="stage-filter">
          <label htmlFor="stage-select">اختر المرحلة الدراسية: </label>
          <select
            id="stage-select"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="stage-dropdown"
          >
            <option value="">الكل</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
      )}

      <section className="video-section">
        <div className="videos-grid">
          {filteredVideos.map((video) => {
            const videoId = extractVideoId(video.lesson_link);
            const thumbnailUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : "https://via.placeholder.com/300x200.png?text=No+Thumbnail";

            return (
              <div
                className="video-container"
                key={video._id}
                onClick={() => handleVideoClick(video)}
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

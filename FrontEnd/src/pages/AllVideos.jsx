import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/AllVideos.css";
import Loader from "./Loader";

const AllVideos = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedMathTopic, setSelectedMathTopic] = useState("");
  const [editingVideo, setEditingVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("Access token is missing.");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/lessons`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setVideos(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to fetch videos. Please check your credentials.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedMathTopic("");
  };

  const handleMathTopicChange = (e) => {
    setSelectedMathTopic(e.target.value);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا الفيديو؟");
    if (confirmDelete) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/lessons/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setVideos(videos.filter((video) => video._id !== id));
      } catch (err) {
        console.error("Error deleting video:", err);
        alert("حدث خطأ أثناء حذف الفيديو.");
      }
    }
  };

  const handleEdit = (video) => {
    setEditingVideo({ ...video });
  };

  const handleSaveEdit = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/lessons/${editingVideo._id}`,
        editingVideo,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const updatedVideos = videos.map((video) =>
        video._id === editingVideo._id ? response.data : video
      );
      setVideos(updatedVideos);
      setEditingVideo(null);
    } catch (err) {
      console.error("Error saving video edits:", err);
      alert("حدث خطأ أثناء تعديل الفيديو.");
    }
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingVideo({ ...editingVideo, [name]: value });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const filteredVideos = videos.filter(
    (video) =>
      (video.title.includes(searchTerm) || video.stage.includes(searchTerm)) &&
      (selectedSubject === "" ||
        selectedSubject === "رياضيات" ||
        video.subject === selectedSubject) &&
      (selectedSubject !== "رياضيات" ||
        selectedMathTopic === "" ||
        video.subject === selectedMathTopic)
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="all-videos-container">
      <h2>إدارة الفيديوهات</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="ابحث باسم الفيديو أو الفئة"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <select
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="subject-filter"
        >
          <option value="">كل المواد</option>
          <option value="تاريخ">تاريخ</option>
          <option value="انجليزي">لغة انجليزية</option>
          <option value="فرنسي">لغة فرنسية</option>
          <option value="رياضيات">رياضيات</option>
        </select>
        {selectedSubject === "رياضيات" && (
          <select
            value={selectedMathTopic}
            onChange={handleMathTopicChange}
            className="subject-filter"
          >
            <option value="">كل مواد الرياضيات</option>
            <option value="جبر">جبر</option>
            <option value="هندسة">هندسة</option>
            <option value="مثلثات">مثلثات</option>
            <option value="تفاضل">تفاضل</option>
            <option value="إحصاء">إحصاء</option>
          </select>
        )}
      </div>
      <div className="videos-table">
        <table>
          <thead>
            <tr>
              <th>اسم الفيديو</th>
              <th>الرابط</th>
              <th>المرحلة الدراسية</th>
              <th>المادة الدراسية</th>
              <th>الوحدة</th>
              <th>الوصف</th>
              <th>الملاحظات</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map((video) => (
              <tr key={video._id}>
                <td>
                  {editingVideo && editingVideo._id === video._id ? (
                    <input
                      type="text"
                      name="title"
                      value={editingVideo.title}
                      onChange={handleEditChange}
                      className="edit-input"
                    />
                  ) : (
                    truncateText(video.title, 20)
                  )}
                </td>
                <td>
                  {editingVideo && editingVideo._id === video._id ? (
                    <input
                      type="text"
                      name="lesson_link"
                      value={editingVideo.lesson_link}
                      onChange={handleEditChange}
                      className="edit-input"
                    />
                  ) : (
                    <a
                      className="youtube-link"
                      href={video.lesson_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      رابط الفيديو
                    </a>
                  )}
                </td>
                <td>
                  {editingVideo && editingVideo._id === video._id ? (
                    <select
                      name="stage"
                      value={editingVideo.stage}
                      onChange={handleEditChange}
                      className="edit-input"
                    >
                      <option value="ثالثة اعدادي ">ثالثة اعدادي </option>
                      <option value="اولي ثانوي">اولي ثانوي</option>
                      <option value="ثاني ثانوي">ثاني ثانوي</option>
                      <option value="ثالث ثانوي">ثالث ثانوي</option>
                    </select>
                  ) : (
                    video.stage
                  )}
                </td>
                {editingVideo && editingVideo._id === video._id ? (
                  <td>
                    <select
                      name="subject"
                      value={editingVideo.subject}
                      onChange={handleEditChange}
                    >
                      <option value="تاريخ">تاريخ</option>
                      <option value="انجليزي">لغة انجليزية</option>
                      <option value="فرنسي">لغة فرنسية</option>
                      <option value="جبر">جبر</option>
                      <option value="هندسة">هندسة</option>
                      <option value="مثلثات">مثلثات</option>
                      <option value="تفاضل">تفاضل</option>
                      <option value="إحصاء">إحصاء</option>
                    </select>
                  </td>
                ) : (
                  <td>{video.subject}</td>
                )}

                {editingVideo && editingVideo._id === video._id ? (
                  <td>
                    <select
                      name="unit"
                      value={editingVideo.unit}
                      onChange={handleEditChange}
                    >
                      <option value="1">الوحدة الأولى</option>
                      <option value="2">الوحدة الثانية</option>
                      <option value="3 "> الوحدة الثالثة</option>
                      <option value="4">الوحدة الرابعة</option>
                      <option value="5">الوحدة الخامسة</option>
                      <option value="6">الوحدة السادسة</option>
                      <option value="7">الوحدة السابعة</option>
                      <option value="8">الوحدة الثامنة</option>
                    </select>
                  </td>
                ) : (
                  <td>{video.unit}</td>
                )}

                <td>
                  {editingVideo && editingVideo._id === video._id ? (
                    <textarea
                      name="description"
                      value={editingVideo.description}
                      onChange={handleEditChange}
                      className="edit-input"
                    />
                  ) : (
                    truncateText(video.description, 50)
                  )}
                </td>
                <td>
                  {editingVideo && editingVideo._id === video._id ? (
                    <textarea
                      name="notes"
                      value={editingVideo.notes}
                      onChange={handleEditChange}
                      className="edit-input"
                    />
                  ) : (
                    video.notes
                  )}
                </td>
                <td>
                  {editingVideo && editingVideo._id === video._id ? (
                    <>
                      <button onClick={handleSaveEdit} className="save-button">
                        حفظ
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancel-button"
                      >
                        إلغاء
                      </button>
                    </>
                  ) : (
                    <div className="actions">
                      <button
                        onClick={() => handleEdit(video)}
                        className="edit-button"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(video._id)}
                        className="delete-button"
                      >
                        حذف
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllVideos;

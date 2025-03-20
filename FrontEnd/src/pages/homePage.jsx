import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/HomePage.css";
import Loader from "./Loader";
import About from "./about";

const HomePage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [errorAnnouncements, setErrorAnnouncements] = useState(null); // Error state for announcements

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Get the token
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/announcements`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Include the token
            },
          }
        );

        setAnnouncements(response.data); // Set the announcements data
        setErrorAnnouncements(null); // Clear any errors
      } catch (err) {
        setErrorAnnouncements("حدث خطأ أثناء تحميل الإعلانات."); // Handle errors
      } finally {
        setLoadingAnnouncements(false); // Stop loading
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="home-page">
      {/* Announcements Section */}
      <section className="section announcements-section">
        <h2>
          <span className="material-icons">campaign</span>
          إعلانات مهمة
        </h2>
        {loadingAnnouncements ? (
          <h2>
            <span className="material-icons">campaign</span>
            <Loader />
          </h2>
        ) : errorAnnouncements ? (
          <p className="error-message">{errorAnnouncements}</p>
        ) : announcements.length > 0 ? (
          <ul className="announcements-list">
            {announcements.map((announcement) => (
              <li key={announcement._id} className="announcement-item">
                <h4 className="announcement-title">{announcement.title}</h4>
                <p className="announcement-description">
                  {announcement.description}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>لا توجد إعلانات في الوقت الحالي.</p>
        )}
      </section>

      {/* About Section */}
      <About />
      <div className="footer">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} - منصة Ali Elian- جميع الحقوق - محفوظة
        </p>
      </div>
    </div>
  );
};

export default HomePage;

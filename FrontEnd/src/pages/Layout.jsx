import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./../styles/Layout.css";

const Layout = ({ children, role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prevState) => !prevState);
  }, []);

  // إدارة حالة التمرير
  useEffect(() => {
    
    if (isSidebarOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isSidebarOpen]);

  // إغلاق القائمة عند النقر خارجها
  const handleClickOutside = useCallback(
    (e) => {
      if (
        isSidebarOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".burger-menu")
      ) {
        setIsSidebarOpen(false);
      }
    },
    [isSidebarOpen]
  );

  // إضافة/إزالة مستمع الأحداث
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className={`layout ${isSidebarOpen ? "menu-open" : ""}`}>
      <header className="header">
        <div className="burger-menu" onClick={toggleSidebar}>
          <img
            className="burger-icon"
            src={require(`./../images/${
              isSidebarOpen ? "close-icon.png" : "menu-bar.png"
            }`)}
            alt="Menu"
          />
        </div>
        <div className="logo-container" onClick={() => navigate("/home")}>
          <img
            className="logo"
            src={require("./../images/0d231dfe-f53b-42fb-aa49-90b4d32966af.png")}
            alt="محمود توكل"
          />
          <h1>
            مــنص<span className="highlight-dot">ـة</span> الــتوك
            <span className="highlight-dot">ـل</span>
          </h1>
        </div>

        <div className="user-menu">
          <Link to="/user">
            <div
              className={`user-avatar ${
                location.pathname === "/user" ? "active" : ""
              }`}
            ></div>
          </Link>
        </div>
      </header>

      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      <main className={`main-content ${isSidebarOpen ? "blur-effect" : ""}`}>
        <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <ul>
            <li className={location.pathname === "/home" ? "active" : ""}>
              <Link to="/home">
                <span className="material-icons">home</span> الرئيسية
              </Link>
            </li>
            <li className={location.pathname === "/history" ? "active" : ""}>
              <Link to="/history">
                <span class="material-icons">history_edu</span>
                التاريخ
              </Link>
            </li>
            <li className={location.pathname === "/geog" ? "active" : ""}>
              <Link to="/geog">
                <span class="material-icons">public</span>
                الجغرافيا
              </Link>
            </li>
            {role === "admin" && (
              <li
                className={
                  location.pathname.startsWith("/dashboard") ? "active" : ""
                }
              >
                <Link to="/dashboard">
                  <span className="material-icons">settings</span>  التحكم
                </Link>
              </li>
            )}
          </ul>
        </aside>

        <div className="page-content">
          <div
            className={` ${isSidebarOpen ? "content-top-open" : "content-top"}`}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

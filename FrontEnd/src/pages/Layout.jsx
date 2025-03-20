import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./../styles/Layout.css";
import FloatingButton from "./FloatingButton"; // Import the FloatingButton component

const Layout = ({ children, role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prevState) => !prevState);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isSidebarOpen]);

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
            src={require("./../images/mongezlogo.png")}
            alt="mongez logo"
          />
          <h1>منصة المنجز</h1>
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
            <li className={location.pathname === "/chemistry" ? "active" : ""}>
              <Link to="/chemistry">
                <span className="material-icons">science</span>
                كيمياء
              </Link>
            </li>
            <li className={location.pathname === "/science" ? "active" : ""}>
              <Link to="/science">
                <span className="material-icons">biotech</span>
                علوم طبيعية
              </Link>
            </li>

            {role === "admin" && (
              <li
                className={
                  location.pathname.startsWith("/dashboard") ? "active" : ""
                }
              >
                <Link to="/dashboard">
                  <span className="material-icons">settings</span> التحكم
                </Link>
              </li>
            )}
          </ul>
          <FloatingButton />
          <p className="developer">
            <a
              href="https://www.facebook.com/share/15yTFSwF4n/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link developer-link"
            >
              Fikra Software
            </a>
          </p>
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

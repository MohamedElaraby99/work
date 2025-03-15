import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./pages/LoginPage";
import HomePage from "./pages/homePage";
import CoursesPage from "./pages/CoursesPage";
import ExamsPage from "./pages/ExamsPage";
import PdfPage from "./pages/PdfPage";
import DashboardPage from "./pages/DashboardPage";
import Layout from "./pages/Layout";
import ExamDetails from "./pages/examDetails";
import ExamsSystem from "./pages/ExamsSysytem";
import UserPage from "./pages/User";
import AddUser from "./pages/dashBoardsPages/AddUser";
import AddVideo from "./pages/dashBoardsPages/AddVideo";
import AddPdf from "./pages/dashBoardsPages/AddPdf";
import CreateExam from "./pages/dashBoardsPages/AddExam";
import VideoDetailsPage from "./pages/VideoDetailsPage";
import AllUsers from "./pages/AllUsers";
import AllExams from "./pages/AllExams";
import AllVideos from "./pages/AllVideos";
import AllPdfs from "./pages/AllPDFs";
import PostsComponent from "./pages/dashBoardsPages/PostsComponent";
import AllPostsComponent from "./pages/AllPostsComponent";
import ScrollToTop from "./components/ScrollTop";
import About from "./pages/about";
import ResultComponent from "./pages/ResultComponent";
import History from "./pages/History";
import Math from "./pages/Math";
import Ai from "./pages/AiChat";
import French from "./pages/French";
import English from "./pages/English";
import SelesctMath from "./pages/SelesctMath";

const App = () => {
  const [role, setRole] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole);
    setIsInitialized(true);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("accessToken");
    setRole(null);
  };

  return (
    <Router>
      <ScrollToTop />
      <div style={{ direction: "rtl" }}>
        {!isInitialized ? (
          <p>Loading...</p>
        ) : !role ? (
          <Routes>
            <Route path="/login" element={<LoginForm setRole={setRole} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        ) : (
          <Layout role={role} onSignOut={handleSignOut}>
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/history" element={<History />} />
              <Route path="/math" element={<Math />} />
              <Route path="/french" element={<French />} />
              <Route path="/english" element={<English />} />
              <Route path="/select-math" element={<SelesctMath />} />
              <Route path="/video-details/:id" element={<VideoDetailsPage />} />
              <Route path="/exams" element={<ExamsPage />} />
              <Route path="/exams/details/:id" element={<ExamDetails />} />
              <Route path="/exams/start/:id" element={<ExamsSystem />} />
              <Route path="/exams/end/:id" element={<ResultComponent />} />
              <Route path="/pdf" element={<PdfPage />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/user"
                element={<UserPage onSignOut={handleSignOut} />}
              />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/add-video" element={<AddVideo />} />
              <Route path="/add-pdf" element={<AddPdf />} />
              <Route path="/add-exam" element={<CreateExam />} />
              <Route path="/add-post" element={<PostsComponent />} />
              <Route path="/all-users" element={<AllUsers />} />
              <Route path="/all-exams" element={<AllExams />} />
              <Route path="/all-videos" element={<AllVideos />} />
              <Route path="/all-pdfs" element={<AllPdfs />} />
              <Route path="/all-posts" element={<AllPostsComponent />} />
              <Route path="/AiChat" element={<Ai />} />
              {role === "admin" && (
                <Route path="/dashboard" element={<DashboardPage />} />
              )}
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
            
          </Layout>
        )}
      </div>
    </Router>
  );
};

export default App;

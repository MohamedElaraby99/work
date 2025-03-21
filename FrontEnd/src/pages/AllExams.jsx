import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/AllExams.css";
import Loader from "./Loader";

const AllExams = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("أولى ثانوي");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // جلب البيانات من الـ API
  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const url = `${process.env.REACT_APP_BASE_URL}/exams/submit/?stage=${selectedStage}`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
          role: "admin",
        });
        setExams(response.data || []);
        setFilteredExams(response.data || []);
      } catch (error) {
        toast.error("لا يوجد امتحانات حاليا لهذه المرحلة.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [selectedStage]);

  useEffect(() => {
    const filtered = exams.filter(
      (exam) =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedSubject === "" || exam.subject === selectedSubject)
    );
    setFilteredExams(filtered);
  }, [searchTerm, exams, selectedSubject]);

  useEffect(() => {
    setSelectedExam(null); // إغلاق جدول النتائج عند تغيير المرحلة
  }, [selectedStage]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleStageChange = (e) => setSelectedStage(e.target.value);

  const handleSubjectChange = (e) => setSelectedSubject(e.target.value);

  const handleViewSubmissions = (exam) => {
    setSelectedExam(exam); // تعيين الامتحان الحالي لعرض الـ submissions
  };

  const handleCloseSubmissions = () => {
    setSelectedExam(null); // إغلاق عرض الـ submissions
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل تريد حذف هذا الامتحان؟");
    if (confirmDelete) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/exams/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          role: "admin",
        });
        setExams(exams.filter((exam) => exam.examId !== id));
        toast.success("تم حذف الامتحان بنجاح!");
      } catch (error) {
        console.error("حدث خطأ أثناء حذف الامتحان:", error);
        toast.error("تعذر حذف الامتحان. حاول مرة أخرى.");
      }
    }
  };

  return (
    <div className="all-exams-container">
      <h2>إدارة الامتحانات</h2>
      <div className="search-container">
        <select
          name="stage"
          value={selectedStage}
          onChange={handleStageChange}
          className="stage-dropdown"
        >
          <option value="" disabled>
            اختر المرحلة الدراسية
          </option>
          <option value="stage1">1 ثانوي</option>
          <option value="stage2">2 ثانوي</option>
          <option value="stage3">3 ثانوي</option>
        </select>
        <select
          name="subject"
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="subject-dropdown"
        >
          <option value="" disabled>
            اختر المادة
          </option>

          <option value="">كل المواد</option>
          <option value="chemistry">كيمياء</option>
          <option value="science">علوم متكاملة</option>
        </select>
        <input
          type="text"
          placeholder="ابحث باسم الامتحان"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="exams-table">
          {filteredExams.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>اسم الامتحان</th>
                  <th>تاريخ الامتحان</th>
                  <th>وقت الامتحان</th>
                  <th>نوع الامتحان </th>
                  <th>مادة الامتحان</th>
                  <th>مدة الامتحان (دقائق)</th>
                  <th>حالة الامتحان</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map((exam) => (
                  <tr key={exam.examId}>
                    <td>{exam.title}</td>
                    <td>{new Date(exam.date).toLocaleDateString()}</td>
                    <td>{new Date(exam.date).toLocaleTimeString()}</td>
                    <td>{exam.exam}</td>
                    <td>{exam.subject}</td>
                    <td>{exam.duration}</td>
                    <td>{exam.exam_status}</td>
                    <td className="actionss">
                      <button
                        className="view-students-button"
                        onClick={() => handleViewSubmissions(exam)}
                      >
                        النتائج
                      </button>
                      <button
                        onClick={() => handleDelete(exam.examId)}
                        className="deletee-button"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-exams-message">لا توجد امتحانات لهذه المرحلة.</p>
          )}

          {/* عرض جدول النتائج إذا تم تحديد امتحان */}
          {selectedExam && (
            <div className="submissions-table">
              <h3>نتائج الطلاب - {selectedExam.title}</h3>
              <table>
                <thead>
                  <tr>
                    <th>اسم الطالب</th>
                    <th>المرحلة الدراسية</th>
                    <th>الدرجة</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedExam.submissions.map((submission, index) => (
                    <tr key={index}>
                      <td>{submission.student.name}</td>
                      <td>{submission.student.stage}</td>
                      <td>{submission.score}</td>
                      <td>{submission.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={handleCloseSubmissions}
                className="close-results-button"
              >
                إغلاق النتائج
              </button>
            </div>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AllExams;

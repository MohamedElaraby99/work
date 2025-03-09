import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../../styles/dashboard/AddUser.css";

const AddUser = () => {
  const [user, setUser] = useState({
    type: "student",
    name: "",
    username: "",
    password: "",
    stage: [],
    subject: [],
    mathSubjects: [], // Added for math subcategories
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "stage" || name === "subject") {
      setUser((prevState) => ({
        ...prevState,
        [name]: checked
          ? [...prevState[name], value] // Add to the array if checked
          : prevState[name].filter((item) => item !== value), // Remove from the array if unchecked
      }));
    } else {
      setUser({
        ...user,
        [name]: value,
      });
    }
  };

  const handleMathSubjectsChange = (e) => {
    const { value, checked } = e.target;
    setUser((prevState) => ({
      ...prevState,
      mathSubjects: checked
        ? [...prevState.mathSubjects, value] // Add to array
        : prevState.mathSubjects.filter((subject) => subject !== value), // Remove from array
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.name) {
      toast.error("الرجاء إدخال الاسم!");
      return;
    }
    if (!user.username) {
      toast.error("الرجاء إدخال اسم المستخدم!");
      return;
    }
    if (!user.password) {
      toast.error("الرجاء إدخال كلمة المرور!");
      return;
    }
    if (user.type === "student" && user.stage.length === 0) {
      toast.error("الرجاء اختيار المرحلة الدراسية!");
      return;
    }

    const requestData = {
      ...user,
      mathSubjects: user.subject.includes("رياضيات")
        ? user.mathSubjects
        : undefined,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/register`,
        requestData
      );
      toast.success("تم إضافة المستخدم بنجاح!");

      setUser({
        type: "student",
        name: "",
        username: "",
        password: "",
        stage: [],
        subject: [],
        mathSubjects: [],
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء إضافة المستخدم!"
      );
    }
  };

  return (
    <div className="add-user">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="add-user-container">
        <h2>إضافة مستخدم جديد</h2>
        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="form-group">
            <label htmlFor="type">نوع المستخدم:</label>
            <select
              id="type"
              name="type"
              value={user.type}
              onChange={handleChange}
            >
              <option value="student">طالب</option>
              <option value="admin">مشرف</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="name">الاسم:</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="أدخل الاسم الكامل"
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">اسم المستخدم:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              placeholder="أدخل اسم المستخدم"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">كلمة المرور:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور"
            />
          </div>
          {user.type === "student" && (
            <div className="form-group">
              <div>
                <label>المادة:</label>
              </div>
              <div className="subject-checkboxes">
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="subject"
                      value="تاريخ"
                      checked={user.subject.includes("تاريخ")}
                      onChange={handleChange}
                    />
                    تاريخ
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="subject"
                      value="رياضيات"
                      checked={user.subject.includes("رياضيات")}
                      onChange={handleChange}
                    />
                    رياضيات
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="subject"
                      value="لغة فرنسية"
                      checked={user.subject.includes("لغة فرنسية")}
                      onChange={handleChange}
                    />
                    لغة فرنسية
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="subject"
                      value="لغة انجليزية"
                      checked={user.subject.includes("لغة انجليزية")}
                      onChange={handleChange}
                    />
                    لغة انجليزية
                  </label>
                </div>
              </div>
            </div>
          )}
          {user.subject.includes("رياضيات") && (
            <div className="form-group">
              <label>اختر مواد الرياضيات:</label>
              <div className="subject-checkboxes">
                <div>
                  <label>
                    <input
                      type="checkbox"
                      value="جبر"
                      onChange={handleMathSubjectsChange}
                    />
                    جبر
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      value="هندسة"
                      onChange={handleMathSubjectsChange}
                    />
                    هندسة
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      value="حساب مثلثات"
                      onChange={handleMathSubjectsChange}
                    />
                    حساب مثلثات
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      value="تفاضل"
                      onChange={handleMathSubjectsChange}
                    />
                    تفاضل
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      value="إحصاء"
                      onChange={handleMathSubjectsChange}
                    />
                    إحصاء
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="stage">المرحلة الدراسية:</label>
            <select
              id="stage"
              name="stage"
              value={user.stage}
              onChange={
                (e) => setUser({ ...user, stage: [e.target.value] }) // تخزين المرحلة كعنصر داخل مصفوفة
              }
            >
              <option value="">اختر المرحلة الدراسية</option>
              <option value="ثالثة اعدادي">ثالثة اعدادي</option>
              <option value="أولى ثانوي">أولى ثانوي</option>
              <option value="ثانية ثانوي">ثانية ثانوي</option>
              <option value="ثالثة ثانوي">ثالثة ثانوي</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            {user.type === "student" ? "إضافة طالب" : "إضافة مشرف"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;

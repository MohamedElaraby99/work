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
    stage: "",
    subject: "",
    mathSubjects: [], // Added for math subcategories
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleMathSubjectsChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setUser((prevState) => ({
        ...prevState,
        mathSubjects: [...prevState.mathSubjects, value],
      }));
    } else {
      setUser((prevState) => ({
        ...prevState,
        mathSubjects: prevState.mathSubjects.filter(
          (subject) => subject !== value
        ),
      }));
    }
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
    if (user.type === "student" && !user.stage) {
      toast.error("الرجاء اختيار المرحلة الدراسية!");
      return;
    }

    const requestData = {
      ...user,
      mathSubjects: user.subject === "رياضيات" ? user.mathSubjects : undefined,
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
        stage: "",
        subject: "",
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
              <label htmlFor="stage">المرحلة الدراسية:</label>
              <select
                id="stage"
                name="stage"
                value={user.stage}
                onChange={handleChange}
              >
                <option value="">اختر المرحلة الدراسية</option>
                <option value="ثالثة اعدادي">ثالثة اعدادي</option>
                <option value="أولى ثانوي">أولى ثانوي</option>
                <option value="ثانية ثانوي">ثانية ثانوي</option>
                <option value="ثالثة ثانوي">ثالثة ثانوي</option>
              </select>
              <label htmlFor="subject">المادة:</label>
              <select
                id="subject"
                name="subject"
                value={user.subject}
                onChange={handleChange}
              >
                <option value="">اختر المادة</option>
                <option value="تاريخ">تاريخ</option>
                <option value="رياضيات">رياضيات</option>
                <option value="لغة فرنسية">لغة فرنسية</option>
                <option value="لغة انجليزية">لغة انجليزية</option>
              </select>
            </div>
          )}
          {user.subject === "رياضيات" && (
            <div className="form-group">
              <label>اختر مواد الرياضيات:</label>
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="جبر"
                    onChange={handleMathSubjectsChange}
                  />{" "}
                  جبر
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="هندسة"
                    onChange={handleMathSubjectsChange}
                  />{" "}
                  هندسة
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="حساب مثلثات"
                    onChange={handleMathSubjectsChange}
                  />{" "}
                  حساب مثلثات
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="تفاضل"
                    onChange={handleMathSubjectsChange}
                  />{" "}
                  تفاضل
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="إحصاء"
                    onChange={handleMathSubjectsChange}
                  />{" "}
                  إحصاء
                </label>
              </div>
            </div>
          )}
          <button type="submit" className="submit-button">
            {user.type === "student" ? "إضافة طالب" : "إضافة مشرف"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;

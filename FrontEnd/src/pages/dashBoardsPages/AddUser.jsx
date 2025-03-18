import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../../styles/dashboard/AddUser.css";

const AddUser = () => {
  const [user, setUser] = useState({
    role: "student",
    name: "",
    username: "",
    password: "",
    stage: "", // Default value is an empty string
    subject: [], // Array for subjects
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "stage") {
      setUser((prevState) => ({
        ...prevState,
        stage: checked ? value : "", // Assign value or empty string
      }));
    } else if (name === "subject") {
      setUser((prevState) => ({
        ...prevState,
        subject: checked
          ? [...prevState.subject, value] // Add selected subject
          : prevState.subject.filter((item) => item !== value), // Remove unselected subject
      }));
    }
  };

  const handleMathSubjectsChange = (e) => {
    const { value, checked } = e.target;
    setUser((prevState) => ({
      ...prevState,
      subject: checked
        ? [...prevState.subject, value] // Add selected math subject
        : prevState.subject.filter((item) => item !== value), // Remove unselected math subject
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
    if (user.role === "student" && user.stage === "") {
      toast.error("الرجاء اختيار المرحلة الدراسية!");
      return;
    }

    const requestData = {
      ...user,
      subject: user.subject.filter((item) => item !== "رياضيات"),
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/register`,
        requestData
      );
      toast.success("تم إضافة المستخدم بنجاح!");

      setUser({
        role: "student",
        name: "",
        username: "",
        password: "",
        stage: "", // Reset stage to an empty string
        subject: [],
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
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
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
              onChange={(e) => setUser({ ...user, name: e.target.value })}
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
              onChange={(e) => setUser({ ...user, username: e.target.value })}
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
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="أدخل كلمة المرور"
            />
          </div>
          {user.role === "student" && (
            <>
              <div className="form-group">
                <label>المادة:</label>
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
                        value="فرنسي"
                        checked={user.subject.includes("فرنسي")}
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
                        value="انجليزي"
                        checked={user.subject.includes("انجليزي")}
                        onChange={handleChange}
                      />
                      لغة انجليزية
                    </label>
                  </div>
                </div>
              </div>
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
                          value="مثلثات"
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
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          value="استاتيكا"
                          onChange={handleMathSubjectsChange}
                        />
                        استاتيكا
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          value="ديناميكا"
                          onChange={handleMathSubjectsChange}
                        />
                        ديناميكا
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {user.role === "student" && (
            <div className="form-group">
              <label htmlFor="stage">المرحلة الدراسية:</label>
              <select
                id="stage"
                name="stage"
                value={user.stage}
                onChange={(e) => setUser({ ...user, stage: e.target.value })}
              >
                <option value="">اختر المرحلة الدراسية</option>
                <option value="ثالثة اعدادي">ثالثة اعدادي</option>
                <option value="أولى ثانوي">أولى ثانوي</option>
                <option value="ثانية ثانوي">ثانية ثانوي</option>
                <option value="ثالثة ثانوي">ثالثة ثانوي</option>
              </select>
            </div>
          )}

          <button type="submit" className="submit-button">
            {user.role === "student" ? "إضافة طالب" : "إضافة مشرف"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;

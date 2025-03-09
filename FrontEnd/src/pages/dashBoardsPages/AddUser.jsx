import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../../styles/dashboard/AddUser.css";

const AddUser = () => {
  const [user, setUser] = useState({
    type: "student", // Default to student
    name: "",
    username: "",
    password: "",
    stage: "",
    subject: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
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
    if (user.type === "admin" && (!user.stage || !user.subject)) {
      toast.error("الرجاء اختيار المرحلة الدراسية والمادة!");
      return;
    }

    // إعداد بيانات الطلب
    const requestData = {
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.type,
      stage: user.type === "student" ? user.stage : undefined, // إذا كان مشرفًا، لا يتم إرسال المرحلة الدراسية
      subject: user.type === "student" ? user.subject : undefined,
    };

    try {
      // إرسال الطلب إلى الـ API
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/register`,
        requestData
      );

      // عرض رسالة نجاح
      toast.success("تم إضافة المستخدم بنجاح!");

      // إعادة تعيين النموذج
      setUser({
        type: "student",
        name: "",
        username: "",
        password: "",
        stage: "",
        subject: "",
      });
    } catch (error) {
      // معالجة الأخطاء
      console.error("Error adding user:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء إضافة المستخدم!"
      );
    }
  };

  return (
    <div className="add-user">
      {/* Toast Notifications */}
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
            <label htmlFor="name">الاسم :</label>
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
              placeholder="أدخل اسم المستخدم (على سبيل المثال: ali123)"
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
                <option value="أولى ثانوي">أولى ثانوي</option>
                <option value="ثانية ثانوي">ثانية ثانوي</option>
                <option value="ثالثة ثانوي">ثالثة ثانوي</option>
              </select>
              <label htmlFor="stage">المادة :</label>
              <select
                id="subject"
                name="subject"
                value={user.subject}
                onChange={handleChange}
              >
                <option value="">اختر المادة </option>
                <option value="تاريخ">تاريخ </option>
                <option value="جغرافيا">جغرافيا </option>
                <option value="تاريخ وجغرافيا">تاريخ وجغرافيا </option>
              </select>
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

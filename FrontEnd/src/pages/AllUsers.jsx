import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/AllUsers.css";
import Loader from "./Loader";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [editData, setEditData] = useState({
    name: "",
    username: "",
    stage: "",
    password: "",
    role: "",
    subject: "",
  });
  const [selectedTable, setSelectedTable] = useState("students");
  const [selectedStage, setSelectedStage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setUsers(response.data);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditData({ ...user });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleEditSave = async () => {
    if (!editData.name || !editData.username || !editData.password) {
      alert("يرجى ملء جميع الحقول قبل الحفظ!");
      return;
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/users/${editingUser._id}`,
        editData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setUsers(
        users.map((user) =>
          user._id === editingUser._id ? response.data : user
        )
      );
      setEditingUser(null);
    } catch (err) {
      alert("حدث خطأ أثناء تحديث المستخدم.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUsers(users.filter((user) => user._id !== id));
      } catch (err) {
        alert("حدث خطأ أثناء حذف المستخدم.");
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const matchesSubject = (user) => {
    if (selectedSubject === "") return true;

    // إذا تم اختيار "رياضيات" بشكل عام
    if (selectedSubject === "رياضيات") {
      return ["جبر", "هندسة", "مثلثات", "تفاضل", "إحصاء"].includes(
        user.subject
      );
    }

    // التصفية العادية للمواد الأخرى
    return user.subject === selectedSubject;
  };
  const students = filteredUsers.filter(
    (user) =>
      user.role === "student" &&
      (selectedStage ? user.stage === selectedStage : true) &&
      matchesSubject(user)
  );

  const admins = filteredUsers.filter((user) => user.role === "admin");

  if (loading) return <Loader />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="all-users-container">
      <h2>إدارة المستخدمين</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="ابحث بالاسم"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="table-selector"
        >
          <option value="students">جدول الطلاب</option>
          <option value="admins">جدول المشرفين</option>
        </select>
        {selectedTable === "students" && (
          <>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="subject-selector"
            >
              <option value="">كل المواد</option>
              <option value="تاريخ">تاريخ</option>
              <option value="انجليزي">لغة إنجليزية</option>
              <option value="فرنسي">لغة فرنسية</option>

              {/* مجموعة الرياضيات مع المواد الفرعية */}
              <optgroup label="رياضيات">
                <option value="رياضيات">الكل</option>
                <option value="جبر">جبر</option>
                <option value="هندسة">هندسة</option>
                <option value="مثلثات">مثلثات</option>
                <option value="تفاضل">تفاضل</option>
                <option value="إحصاء">إحصاء</option>
              </optgroup>
            </select>
          </>
        )}
      </div>
      {selectedTable === "students" && (
        <div>
          <h3>جدول الطلاب</h3>
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>اسم المستخدم</th>
                <th>المرحلة</th>
                <th>المادة الدراسية</th>
                <th>كلمة المرور</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  {editingUser?._id === student._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="username"
                          value={editData.username}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <select
                          name="stage"
                          value={editData.stage}
                          onChange={handleEditChange}
                        >
                          <option value="ثالثة اعدادي">ثالثة اعدادي</option>
                          <option value="أولى ثانوي">أولى ثانوي</option>
                          <option value="ثانية ثانوي">ثانية ثانوي</option>
                          <option value="ثالثة ثانوي">ثالثة ثانوي</option>
                        </select>
                      </td>
                      <td>
                        <select
                          name="subject"
                          value={editData.subject}
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
                      <td>
                        <input
                          type="text"
                          name="password"
                          value={editData.password}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <button
                          className="save-button"
                          onClick={handleEditSave}
                        >
                          حفظ
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => setEditingUser(null)}
                        >
                          إلغاء
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{student.name}</td>
                      <td>{student.username}</td>
                      <td>{student.stage}</td>
                      <td>{student.subject}</td>
                      <td>{"*".repeat(student.password.length)}</td>
                      <td className="actions-cell">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(student)}
                        >
                          تعديل
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(student._id)}
                        >
                          حذف
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedTable === "admins" && (
        <div>
          <h3>جدول المشرفين</h3>
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>اسم المستخدم</th>
                <th>كلمة المرور</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  {editingUser?._id === admin._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="username"
                          value={editData.username}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="password"
                          value={editData.password}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <button
                          className="save-button"
                          onClick={handleEditSave}
                        >
                          حفظ
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => setEditingUser(null)}
                        >
                          إلغاء
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{admin.name}</td>
                      <td>{admin.username}</td>
                      <td>{"*".repeat(admin.password.length)}</td>
                      <td className="actions-cell">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(admin)}
                        >
                          تعديل
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(admin._id)}
                        >
                          حذف
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllUsers;

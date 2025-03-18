import React, { useState } from "react";
import Dropzone from "react-dropzone";
import "./../../styles/dashboard/AddFile.css";
import axios from "axios";
import { toast } from "react-toastify";

const AddPdf = () => {
  const [pdfData, setPdfData] = useState({
    name: "",
    file: null,
    stage: "",
    subject: "",
    mathTopic: "",
    unit: "",
    lesson_number: "",
  });
  const [loading, setLoading] = useState(false); // State to track loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPdfData({
      ...pdfData,
      [name]: value,
    });
  };

  const handleFileDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      toast.error("يرجى اختيار ملف PDF صالح");
      return;
    }

    const file = acceptedFiles[0];
    if (file.type !== "application/pdf") {
      toast.error("يرجى اختيار ملف بصيغة PDF فقط");
      return;
    }

    setPdfData({
      ...pdfData,
      file: file,
    });

    toast.success("تم اختيار الملف بنجاح");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !pdfData.name ||
      !pdfData.file ||
      !pdfData.stage ||
      !pdfData.subject ||
      !pdfData.unit ||
      !pdfData.lesson_number
    ) {
      toast.error("الرجاء ملء جميع الحقول");
      return;
    }

    setLoading(true); // Set loading to true when upload starts

    const finalSubject =
      pdfData.subject === "رياضيات" ? pdfData.mathTopic : pdfData.subject;

    const formData = new FormData();
    formData.append("title", pdfData.name);
    formData.append("file", pdfData.file);
    formData.append("stage", pdfData.stage);
    formData.append("subject", finalSubject);
    formData.append("unit", pdfData.unit);
    formData.append("lesson_number", pdfData.lesson_number);

    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("تم رفع الملف بنجاح!");

      setPdfData({
        name: "",
        file: null,
        stage: "",
        subject: "",
        mathTopic: "",
        unit: "",
        lesson_number: "",
      });
    } catch (error) {
      console.error("Error adding file:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء إضافة الملف!"
      );
    } finally {
      setLoading(false); // Set loading to false when upload completes
    }
  };

  return (
    <div className="add-pdf">
      <div className="add-pdf-container">
        <h2>إضافة ملف PDF جديد</h2>
        <form onSubmit={handleSubmit} className="add-pdf-form">
          <div className="form-group">
            <label htmlFor="name">اسم الملف:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={pdfData.name}
              onChange={handleChange}
              placeholder="أدخل اسم الملف"
            />
          </div>

          <div className="form-group">
            <label>تحميل ملف PDF:</label>
            <Dropzone onDrop={handleFileDrop} accept=".pdf" maxFiles={1}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="dropzone"
                  style={{
                    border: "2px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: "5px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <input {...getInputProps()} />
                  {pdfData.file ? (
                    <p>تم اختيار الملف: {pdfData.file.name}</p>
                  ) : (
                    <p>اسحب وأسقط ملف PDF هنا أو انقر لاختيار ملف</p>
                  )}
                </div>
              )}
            </Dropzone>
          </div>

          <div className="form-group">
            <label htmlFor="stage">المرحلة الدراسية:</label>
            <select
              id="stage"
              name="stage"
              value={pdfData.stage}
              onChange={handleChange}
            >
              <option value="" disabled>
                اختر المرحلة الدراسية
              </option>
              <option value="ثالثة اعدادي">ثالثة اعدادي</option>
              <option value="أولى ثانوي">أولى ثانوي</option>
              <option value="ثانية ثانوي">ثانية ثانوي</option>
              <option value="ثالثة ثانوي">ثالثة ثانوي</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">اختر المادة الدراسية:</label>
            <select
              id="subject"
              name="subject"
              value={pdfData.subject}
              onChange={handleChange}
            >
              <option value="" disabled>
                اختر المادة
              </option>
              <option value="تاريخ">تاريخ</option>
              <option value="فرنسي">اللغة الفرنسية</option>
              <option value="انجليزي">لغة انجليزية</option>
              <option value="رياضيات">رياضيات</option>
            </select>
          </div>

          {pdfData.subject === "رياضيات" && (
            <div className="form-group">
              <label htmlFor="mathTopic">اختر مادة الرياضيات:</label>
              <select
                id="mathTopic"
                name="mathTopic"
                value={pdfData.mathTopic}
                onChange={handleChange}
              >
                <option value="" disabled>
                  اختر الموضوع
                </option>
                <option value="جبر">الجبر</option>
                <option value="هندسة">الهندسة</option>
                <option value="مثلثات">حساب المثلثات</option>
                <option value="تفاضل">التفاضل</option>
                <option value="إحصاء">الإحصاء</option>
                <option value="استاتيكا">استاتيكا</option>
                <option value="ديناميكا">ديناميكا</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="unit">اختر الوحدة:</label>
            <select
              id="unit"
              name="unit"
              value={pdfData.unit}
              onChange={handleChange}
            >
              <option value="" disabled>
                اختر الوحدة
              </option>
              <option value="1">الوحدة الأولى</option>
              <option value="2">الوحدة الثانية</option>
              <option value="3">الوحدة الثالثة</option>
              <option value="4">الوحدة الرابعة</option>
              <option value="5">الوحدة الخامسة</option>
              <option value="6">الوحدة السادسة</option>
              <option value="7">الوحدة السابعة</option>
              <option value="8">الوحدة الثامنة</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="unit">اختر الدرس:</label>
            <select
              id="lesson_number"
              name="lesson_number"
              value={pdfData.lesson_number}
              onChange={handleChange}
            >
              <option value="" disabled>
                اختر الدرس
              </option>
              <option value="1">الدرس الاول</option>
              <option value="2">الدرس الثاني</option>
              <option value="3">الدرس الثالث</option>
              <option value="4">الدرس الرابع</option>
              <option value="5">الدرس الخامس</option>
              <option value="6">الدرس السادس</option>
              <option value="7">الدرس السابع</option>
              <option value="8">الدرس الثامن</option>
              <option value="9">الدرس التاسع</option>
              <option value="10">الدرس العاشر</option>
            </select>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "جاري التحميل..." : "إضافة ملف PDF"}
          </button>
        </form>
        {loading && <p>يرجى الانتظار، جاري تحميل الملف...</p>}
      </div>
    </div>
  );
};

export default AddPdf;

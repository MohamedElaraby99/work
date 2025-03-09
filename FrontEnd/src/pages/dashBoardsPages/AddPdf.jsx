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
    unit: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPdfData({
      ...pdfData,
      [name]: value,
    });
  };

  const handleFileDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      setMessage("يرجى اختيار ملف PDF صالح");
      return;
    }

    const file = acceptedFiles[0];
    if (file.type !== "application/pdf") {
      setMessage("يرجى اختيار ملف بصيغة PDF فقط");
      return;
    }

    setPdfData({
      ...pdfData,
      file: file,
    });

    setMessage("تم اختيار الملف بنجاح");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !pdfData.name ||
      !pdfData.file ||
      !pdfData.stage ||
      !pdfData.subject ||
      !pdfData.unit
    ) {
      setMessage("الرجاء ملء جميع الحقول");
      return;
    }

    const formData = new FormData();
    formData.append("title", pdfData.name);
    formData.append("file", pdfData.file);
    formData.append("stage", pdfData.stage);
    formData.append("subject", pdfData.subject);
    formData.append("unit", pdfData.unit);

    const accessToken = localStorage.getItem("accessToken");

    try {
      // إرسال الطلب إلى الـ API
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // تضمين التوكن في الرؤوس
          },
        }
      );

      // عرض رسالة نجاح
      setMessage("تم رفع الملف بنجاح!");
      toast.success("تم رفع الملف بنجاح!");

      // إعادة تعيين البيانات
      setPdfData({
        name: "",
        file: null,
        stage: "",
        subject: "",
        unit: "",
      });
    } catch (error) {
      console.error("Error adding file:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء إضافة الملف!"
      );
    }
  };

  return (
    <div className="add-pdf">
      <div className="add-pdf-container">
        <h2>إضافة ملف PDF جديد</h2>
        {message && (
          <p
            className={`message ${
              message.includes("نجاح") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
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
              <option value="disabled">اختر المرحلة الدراسية</option>
              <option value="أولى ثانوي"> أولى ثانوي </option>
              <option value="ثانية ثانوي"> ثانية ثانوي </option>
              <option value="ثالثة ثانوي"> ثالثة ثانوي </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">المادة الدراسية :</label>
            <select
              id="subject"
              name="subject"
              value={pdfData.subject}
              onChange={handleChange}
            >
              <option value="disabled">اختر المادة </option>
              <option value="تاريخ">تاريخ </option>
              <option value="جغرافيا">جغرافيا </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject"> اختر الوحدة :</label>
            <select
              id="unit"
              name="unit"
              value={pdfData.unit}
              onChange={handleChange}
            >
              <option value="disabled">اختر الوحدة</option>
              <option value="0">الوحدة التمهيدية </option>
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

          <button type="submit" className="submit-button">
            إضافة ملف PDF
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPdf;

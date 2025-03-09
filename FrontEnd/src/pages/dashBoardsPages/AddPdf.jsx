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
    subjects: [], // تأكد من أنها مصفوفة فارغة في البداية
    mathTopics: [], // تأكد من أنها مصفوفة فارغة في البداية
    unit: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPdfData({
      ...pdfData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setPdfData((prevData) => {
      if (name === "subjects") {
        return {
          ...prevData,
          subjects: checked
            ? [...prevData.subjects, value]
            : prevData.subjects.filter((subject) => subject !== value),
          mathTopics:
            value === "رياضيات" && !checked ? [] : prevData.mathTopics,
        };
      } else if (name === "mathTopics") {
        return {
          ...prevData,
          mathTopics: checked
            ? [...prevData.mathTopics, value]
            : prevData.mathTopics.filter((topic) => topic !== value),
        };
      }
      return prevData;
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
      pdfData.subjects.length === 0 ||
      !pdfData.unit
    ) {
      toast.error("الرجاء ملء جميع الحقول");
      return;
    }

    const formData = new FormData();
    formData.append("title", pdfData.name);
    formData.append("file", pdfData.file);
    formData.append("stage", pdfData.stage);
    formData.append("subjects", JSON.stringify(pdfData.subjects));
    formData.append("mathTopics", JSON.stringify(pdfData.mathTopics));
    formData.append("unit", pdfData.unit);

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
        subjects: [],
        mathTopics: [],
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
              <option value="أولى ثانوي">أولى ثانوي</option>
              <option value="ثانية ثانوي">ثانية ثانوي</option>
              <option value="ثالثة ثانوي">ثالثة ثانوي</option>
            </select>
          </div>

          <div className="form-group">
            <label>المواد الدراسية:</label>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="subjects"
                  value="تاريخ"
                  checked={pdfData.subjects.includes("تاريخ")}
                  onChange={handleCheckboxChange}
                />
                تاريخ
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="subjects"
                  value="جغرافيا"
                  checked={pdfData.subjects.includes("جغرافيا")}
                  onChange={handleCheckboxChange}
                />
                جغرافيا
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="subjects"
                  value="قرنساوي"
                  checked={pdfData.subjects.includes("قرنساوي")}
                  onChange={handleCheckboxChange}
                />
                اللغة الفرنسية
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="subjects"
                  value="رياضيات"
                  checked={pdfData.subjects.includes("رياضيات")}
                  onChange={handleCheckboxChange}
                />
                رياضيات
              </label>
            </div>
          </div>

          {pdfData.subjects.includes("رياضيات") && (
            <div className="form-group">
              <label>مواضيع الرياضيات:</label>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="mathTopics"
                    value="الجبر"
                    checked={pdfData.mathTopics.includes("الجبر")}
                    onChange={handleCheckboxChange}
                  />
                  الجبر
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="mathTopics"
                    value="الهندسة"
                    checked={pdfData.mathTopics.includes("الهندسة")}
                    onChange={handleCheckboxChange}
                  />
                  الهندسة
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="mathTopics"
                    value="حساب المثلثات"
                    checked={pdfData.mathTopics.includes("حساب المثلثات")}
                    onChange={handleCheckboxChange}
                  />
                  حساب المثلثات
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="mathTopics"
                    value="التفاضل"
                    checked={pdfData.mathTopics.includes("التفاضل")}
                    onChange={handleCheckboxChange}
                  />
                  التفاضل
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="mathTopics"
                    value="الإحصاء"
                    checked={pdfData.mathTopics.includes("الإحصاء")}
                    onChange={handleCheckboxChange}
                  />
                  الإحصاء
                </label>
              </div>
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
              <option value="0">الوحدة التمهيدية</option>
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

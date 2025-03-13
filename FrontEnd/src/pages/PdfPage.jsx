import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./../styles/pdfs.css";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";

// تهيئة العامل لـ pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfPage = () => {
  const location = useLocation();
  const { subject, unit } = location.state;

  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true); // لتحميل قائمة الملفات
  const [pdfLoading, setPdfLoading] = useState(false); // لتحميل صفحات PDF
  const [error, setError] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/files?subject=${subject}&unit=${unit}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPdfFiles(response.data);
        setLoading(false);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل الملفات.");
        setLoading(false);
      }
    };

    fetchPdfs();
  }, [subject, unit]);

  const handleViewPdf = async (url) => {
    setPdfLoading(true); // إظهار الـ Loader
    try {
      const fullUrl = `${process.env.REACT_APP_PDF}${
        url.split("/uploads/")[1]
      }`;
      console.log("PDF URL:", fullUrl);

      const loadingTask = pdfjsLib.getDocument(fullUrl);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const pages = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;

        const imageData = canvas.toDataURL("image/png");
        pages.push(imageData);
      }

      setPdfPages(pages);
      setPdfLoading(false); // إخفاء الـ Loader بعد اكتمال التحميل
    } catch (error) {
      console.error("Error rendering PDF:", error);
      setError("حدث خطأ أثناء تحميل صفحات الملف.");
      setPdfLoading(false); // إخفاء الـ Loader في حالة الخطأ
    }
  };

  const handleClosePdf = () => {
    setPdfPages([]);
  };

  // إعدادات السلايدر الأساسية بدون تحسينات
  const sliderSettings = {
    dots: false, // إظهار النقاط
    infinite: true, // تكرار السلايدر
    speed: 500, // سرعة الانتقال
    slidesToShow: 1, // عرض صورة واحدة فقط
    slidesToScroll: 1, // التمرير بصورة واحدة
    rtl: true, // من اليمين إلى اليسار
    arrows: true, // إظهار الأسهم
  };

  if (loading) return <Loader />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="pdf-page">
      <h2>المذكرات أو الملخصات</h2>
      <div className="pdf-container">
        {pdfFiles.map((pdf) => (
          <div key={pdf._id} className="pdf-card">
            <h3>{pdf.title}</h3>
            <div className="pdf-actions">
              <button
                onClick={() => handleViewPdf(pdf.file)}
                className="pdf-button"
                disabled={pdfLoading}
              >
                {pdfLoading ? "جاري التحميل..." : "عرض الملف"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {pdfLoading && <Loader />}
      {!pdfLoading && pdfPages.length > 0 && (
        <div className="pdf-viewer" style={{ marginBottom: "60px" }}>
          <Slider {...sliderSettings}>
            {pdfPages.map((page, index) => (
              <div className="pdf-page" key={index} style={{ position: "relative" }}>
                <img
                  src={page}
                  alt={`صفحة ${index + 1}`}
                  style={{ width: "100%", userSelect: "none" }}
                  draggable="false"
                />
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    zIndex: 10,
                  }}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default PdfPage;

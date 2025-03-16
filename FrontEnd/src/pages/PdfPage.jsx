import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./../styles/pdfs.css";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfPage = () => {
  const location = useLocation();
  const { subject, unit } = location.state;

  const [pdfFiles, setPdfFiles] = useState([]);
  const [filteredPdfFiles, setFilteredPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStage, setSelectedStage] = useState(
    localStorage.getItem("stage") || ""
  ); // المرحلة الافتراضية من localStorage
  const role = localStorage.getItem("role"); // جلب الدور من localStorage

  const stages = ["ثالثة إعدادي", "أولى ثانوي", "ثانية ثانوي", "ثالثة ثانوي"];

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
        setFilteredPdfFiles(response.data); // تعيين الملفات الأولية
        setLoading(false);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل الملفات.");
        setLoading(false);
      }
    };

    fetchPdfs();
  }, [subject, unit]);

  // تصفية ملفات الـ PDF بناءً على المرحلة الدراسية
  useEffect(() => {
    if (role !== "admin" && selectedStage) {
      // إذا لم يكن أدمن، استخدم المرحلة من localStorage فقط
      setFilteredPdfFiles(
        pdfFiles.filter((pdf) => pdf.stage === selectedStage)
      );
    } else if (selectedStage) {
      // إذا كان أدمن وتم اختيار مرحلة، قم بالتصفية
      setFilteredPdfFiles(
        pdfFiles.filter((pdf) => pdf.stage === selectedStage)
      );
    } else {
      // إذا لم يتم اختيار مرحلة (الكل)، اعرض جميع الملفات
      setFilteredPdfFiles(pdfFiles);
    }
  }, [selectedStage, pdfFiles, role]);

  const handleViewPdf = async (url) => {
    setPdfLoading(true);
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
      setPdfLoading(false);
    } catch (error) {
      console.error("Error rendering PDF:", error);
      setError("حدث خطأ أثناء تحميل صفحات الملف.");
      setPdfLoading(false);
    }
  };

  const handleClosePdf = () => {
    setPdfPages([]);
    setCurrentPage(1);
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: true,
    arrows: true,
    initialSlide: 0,
    afterChange: (current) => setCurrentPage(current + 1),
    swipe: true,
    touchThreshold: 10,
    swipeToSlide: true,
  };

  if (loading) return <Loader />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="pdf-page">
      <h2>المذكرات أو الملخصات</h2>

      {/* فلتر المرحلة الدراسية للأدمن فقط */}
      {role === "admin" && (
        <div className="stage-filter">
          <label htmlFor="stage-select">اختر المرحلة الدراسية: </label>
          <select
            id="stage-select"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="stage-dropdown"
          >
            <option value="">الكل</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="pdf-container">
        {filteredPdfFiles.map((pdf) => (
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
        <div className="pdf-viewer">
          <div className="slider-container">
            <Slider {...sliderSettings}>
              {pdfPages.map((page, index) => (
                <div className="pdf-page" key={index}>
                  <img
                    src={page}
                    alt={`صفحة ${index + 1}`}
                    className="pdf-image"
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div className="pdf-controls">
            <span className="page-counter">
              صفحة {currentPage} من {pdfPages.length}
            </span>
            <button onClick={handleClosePdf} className="close-button">
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfPage;

import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";
import axios from "axios";
import "./../styles/pdfs.css";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfPage = ({ state }) => {
  const location = useLocation();
  const { subject, unit } = location.state;
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const pdfRef = useRef(null);

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
    const encodedUrl = encodeURIComponent(url);
    setSelectedPdfUrl(encodedUrl);

    const loadingTask = pdfjsLib.getDocument(decodeURIComponent(encodedUrl));
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = pdfRef.current;
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    page.render(renderContext);
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
                onClick={() =>
                  handleViewPdf(
                    process.env.REACT_APP_PDF + pdf.file.split("/uploads/")[1]
                  )
                }
                className="pdf-button"
              >
                عرض الملف
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedPdfUrl && (
        <div className="pdf-viewer">
          <canvas ref={pdfRef}></canvas>
        </div>
      )}
    </div>
  );
};

export default PdfPage;

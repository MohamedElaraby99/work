import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/pdfs.css";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";

const PdfPage = ({ state }) => {
  const location = useLocation();
  const { subject, unit } = location.state;
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);

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

  const handleViewPdf = (url) => {
    const encodedUrl = encodeURIComponent(url);
    console.log("Constructed PDF URL:", decodeURIComponent(encodedUrl)); // Debugging line
    setSelectedPdfUrl(encodedUrl);
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
        <div className="pdf-viewer" onContextMenu={(e) => e.preventDefault()}>
          <iframe
            src={`${decodeURIComponent(
              selectedPdfUrl
            )}#toolbar=0&navpanes=0&scrollbar=0`}
            title="PDF Viewer"
            style={{ border: "none", width: "100%", height: "100%" }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default PdfPage;

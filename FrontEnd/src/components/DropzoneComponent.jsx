import React from "react";
import { useDropzone } from "react-dropzone";

const DropzoneComponent = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".bmp", ".tiff"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? "active-dropzone" : ""}`}
      style={{
        border: isDragActive ? "2px dashed #4caf50" : "2px dashed #ccc",
        padding: "20px",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <input {...getInputProps()} />
      <p>اسحب وأسقط صورة أو ملف PDF هنا، أو انقر لاختيار ملف</p>
    </div>
  );
};

export default DropzoneComponent;

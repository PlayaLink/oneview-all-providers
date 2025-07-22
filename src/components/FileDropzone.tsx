import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFilesAccepted }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => onFilesAccepted(acceptedFiles),
    multiple: true,
    accept: {
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'text/plain': [],
      'text/rtf': [],
      'image/gif': [],
      'image/jpeg': [],
      'image/png': [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#fafafa] ${
        isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
      style={{ width: '100%', height: '200px' }}
      data-testid="file-dropzone"
      role="button"
      tabIndex={0}
      aria-label="File upload area. Drop files here or click to browse."
      aria-describedby="file-dropzone-description"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center" id="file-dropzone-description">
        <FontAwesomeIcon icon={faUpload} className="text-2xl mb-2 text-gray-600" aria-label="upload" />
        <span className="text-gray-700">Drop documents here or <span className="text-blue-600 underline">Click here to browse</span></span>
        <span className="text-xs text-gray-400 mt-2">PDF, DOCX, TXT, RTF, GIF, JPG, PNG</span>
      </div>
    </div>
  );
};

export default FileDropzone; 
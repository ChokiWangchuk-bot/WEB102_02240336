'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const API_UPLOAD = 'http://localhost:8000/api/upload';
const MAX_BYTES = 5 * 1024 * 1024;

const accept = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
};

export default function Page() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError('');
    setSuccess(null);
    setProgress(0);

    if (fileRejections.length > 0) {
      const r = fileRejections[0];
      if (r.errors.some((e) => e.code === 'file-too-large')) {
        setError('File is too large. Maximum size is 5MB.');
      } else if (r.errors.some((e) => e.code === 'file-invalid-type')) {
        setError('Invalid type. Only JPEG, PNG, and PDF are allowed.');
      } else {
        setError(r.errors[0]?.message || 'File was rejected.');
      }
      setFile(null);
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxSize: MAX_BYTES,
      multiple: false,
      // PDFs: explicit mime + extension handling via accept map above
    });

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError('Please choose a file first.');
      return;
    }

    setError('');
    setSuccess(null);
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await axios.post(API_UPLOAD, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const pct = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(pct);
          }
        },
      });
      setSuccess(data);
      setProgress(100);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Upload failed. Is the server running on port 8000?';
      setError(msg);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  }

  const isPdf = file?.type === 'application/pdf';

  return (
    <main>
      <h1>File upload</h1>
      <p className="lead">
        Practical 3 — upload JPEG, PNG, or PDF to the Express server (
        <code style={{ color: '#1d9bf0' }}>{API_UPLOAD}</code>
        ).
      </p>

      <form onSubmit={onSubmit}>
        <div
          {...getRootProps()}
          className={
            'dropzone' +
            (isDragActive ? ' active' : '') +
            (isDragReject ? ' reject' : '')
          }
        >
          <input {...getInputProps()} />
          <p>
            <strong>Drag and drop</strong> a file here, or click to browse
          </p>
          <p>JPEG, PNG, or PDF · max 5MB</p>
        </div>

        {file && (
          <section className="preview">
            <h3>Selected file</h3>
            {isPdf ? (
              <div className="pdf-name">
                <span aria-hidden="true">📄</span>
                <span>{file.name}</span>
              </div>
            ) : (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
              />
            )}
          </section>
        )}

        <button
          type="submit"
          className="submit"
          disabled={uploading || !file}
        >
          {uploading ? 'Uploading…' : 'Upload'}
        </button>

        {(uploading || progress > 0) && (
          <div className="progress-wrap">
            <div className="progress-bar">
              <div style={{ width: `${progress}%` }} />
            </div>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#8b98a5' }}>
              {progress}%
            </p>
          </div>
        )}
      </form>

      {error && (
        <div className="msg error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="msg success" role="status">
          <strong>{success.message}</strong>
          <br />
          Saved as: {success.filename} ({success.size} bytes)
        </div>
      )}
    </main>
  );
}

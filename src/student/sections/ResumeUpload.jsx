import React, { useEffect, useState, useRef } from 'react';

const ResumeUpload = ({ data, setData }) => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  const isMobile = window.innerWidth <= 600;

  // Initialize component based on existing data
  useEffect(() => {
    if (data?.resume instanceof File) {
      setFile(data.resume);
      setFilename(data.resume.name || data.resumeName || 'Resume file');
      
      // Set success message when returning to this component
      if (data.resumeConfirmed) {
        setSuccess('Resume is ready for form submission!');
      }
    } else if (data?.resumeName) {
      setFilename(data.resumeName);
      setFile(true); // Not the actual file object, but indicates we have data
      
      // Show success message if previously confirmed
      if (data.resumeConfirmed) {
        setSuccess('Resume is ready for form submission!');
      }
    } else {
      setFile(null);
      setFilename('');
      setSuccess('');
    }
  }, [data?.resume, data?.resumeName, data?.resumeConfirmed]);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setSuccess('');

    if (!selectedFile) return;

    // Validate file type
    const isValidType = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ].includes(selectedFile.type);
    
    // Validate file size
    const isValidSize = selectedFile.size <=25 * 1024 * 1024; // 150KB

    if (!isValidType) {
      setError('Only PDF, DOC, or DOCX files are allowed.');
      return;
    }

    if (!isValidSize) {
      setError('File size must be less than 150KB.');
      return;
    }

    // Update local state and parent component state with confirmation flag
    setFile(selectedFile);
    setFilename(selectedFile.name);
    setData(prev => ({ 
      ...prev, 
      resume: selectedFile, 
      resumeName: selectedFile.name
    }));
    setSuccess('Resume selected successfully!');
    
    // Reset file input for mobile Safari compatibility
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Create responsive styles
  const styles = {
    container: {
      background: '#fff',
      padding: isMobile ? '20px' : '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      border: '1px solid #ccc',
      maxWidth: '600px',
      width: '100%',
      margin: '30px auto',
      textAlign: 'center',
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto'
    },
    header: {
      backgroundColor: '#1e1e3f',
      color: 'white',
      padding: isMobile ? '10px 15px' : '12px 20px',
      borderRadius: '8px 8px 0 0',
      fontSize: isMobile ? '16px' : '18px',
      marginBottom: isMobile ? '15px' : '25px'
    },
    uploadBox: {
      width: isMobile ? '220px' : '280px',
      height: isMobile ? '120px' : '150px',
      border: '3px dashed #1e3a8a',
      borderRadius: '12px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto 15px auto',
      backgroundColor: '#f0f4ff',
      padding: '10px',
      fontSize: isMobile ? '14px' : '15px',
      color: '#000',
      position: 'relative',
      flexDirection: 'column'
    },
    filename: {
      wordBreak: 'break-word',
      maxWidth: '100%',
      display: 'block',
      fontWeight: '500'
    },
    successBadge: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      backgroundColor: 'rgba(16,185,129,0.85)',
      color: 'white',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      zIndex: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    noFileText: {
      color: '#999'
    },
    fileInputLabel: {
      cursor: 'pointer',
      backgroundColor: '#1e3a8a',
      color: '#fff',
      padding: isMobile ? '8px 18px' : '10px 22px',
      borderRadius: '10px',
      fontWeight: 'bold',
      fontSize: isMobile ? '14px' : '15px',
      marginBottom: '10px',
      display: 'inline-block',
      touchAction: 'manipulation', // Improves touch on mobile
      userSelect: 'none', // Prevent text selection
      WebkitTapHighlightColor: 'transparent', // Remove tap highlight on mobile
    },
    errorText: {
      color: 'red',
      marginTop: '8px',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '500'
    },
    successText: {
      color: '#059669',
      marginTop: '8px',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '600'
    },
    helpText: {
      fontSize: isMobile ? '12px' : '14px',
      color: '#444',
      marginTop: '6px'
    },
    formatText: {
      fontSize: isMobile ? '12px' : '14px',
      color: 'red',
      marginTop: '4px'
    },
    uploadButton: {
      cursor: file ? 'pointer' : 'not-allowed',
      backgroundColor: file ? '#1e3a8a' : '#888',
      color: '#fff',
      padding: isMobile ? '8px 24px' : '10px 32px',
      borderRadius: '10px',
      fontWeight: 'bold',
      fontSize: isMobile ? '14px' : '15px',
      border: 'none',
      marginTop: '18px',
      transition: 'background-color 0.3s ease',
      touchAction: 'manipulation',
      WebkitTapHighlightColor: 'transparent',
    },
    footerText: {
      fontSize: '12px', 
      color: '#64748b',
      textAlign: 'center',
      marginTop: '25px',
      padding: '10px 0',
      borderTop: '1px solid #f1f5f9'
    }
  };

  return (
  <div style={styles.container}>
    <div style={styles.header}>
      Upload Resume  <span style={{ color: 'red' }}>*</span>    
    </div>

    <div style={styles.uploadBox}>
      {/* Only show badge if confirmed with button click */}
      {filename && data?.resumeConfirmed && (
        <div style={styles.successBadge}>Confirmed ✓</div>
      )}
      
      {filename ? (
        <div style={styles.filename}>
          {filename}
        </div>
      ) : (
        <span style={styles.noFileText}>No Resume Selected</span>
      )}
    </div>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        style={{ display: 'none' }}
        aria-label="Choose resume file"
        id="resumeInput"
        ref={fileInputRef}
      />

      <label htmlFor="resumeInput" style={styles.fileInputLabel}>
        Choose Resume
      </label>

      {error && (
        <p style={styles.errorText}>{error}</p>
      )}
      
      {success && (
        <p style={styles.successText}>{success}</p>
      )}

      <p style={styles.helpText}>
        Upload your resume. Max size: <strong>150KB</strong>
      </p>
      <p style={styles.formatText}>
        Accepted formats: <strong>.pdf</strong>, <strong>.doc</strong>, <strong>.docx</strong>
      </p>

      <button
        onClick={() => {
          if (file) {
            // Set confirmation flag in parent state
            setData(prev => ({ ...prev, resumeConfirmed: true }));
            setSuccess('Resume is ready for form submission!');
            setError('');
            
            alert('Resume confirmed successfully!');
          } else {
            setError('Please select a valid resume file first.');
          }
        }}
        disabled={!file}
        style={styles.uploadButton}
      >
        Confirm Resume
      </button>
    </div>
  );
};

export default ResumeUpload;
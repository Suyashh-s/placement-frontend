import React, { useEffect, useState, useRef } from 'react';

const Profile = ({ data, setData  }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  const previousObjectUrl = useRef(null);

  // Handle preview changes and cleanup for memory leaks
  useEffect(() => {
    // Cleanup previous object URL to prevent memory leaks
    if (previousObjectUrl.current) {
      URL.revokeObjectURL(previousObjectUrl.current);
      previousObjectUrl.current = null;
    }

    // Handle different types of profile_photo data
    if (data?.profile_photo instanceof File) {
      const objectUrl = URL.createObjectURL(data.profile_photo);
      setPreview(objectUrl);
      previousObjectUrl.current = objectUrl;
      setFile(data.profile_photo);

      // Set success message when returning to this component
      setSuccess('Photo is ready for form submission!');
    } else if (typeof data?.profile_photo === 'string' && data.profile_photo) {
      setPreview(data.profile_photo);
      setFile(true); // Not the actual file, but indicates we have data

      // Show success message for string URLs too if confirmed
      if (data.photoConfirmed) {
        setSuccess('Photo is ready for form submission!');
      }
    } else {
      setPreview(null);
      setFile(null);
      setSuccess(''); // Clear success when no photo
    }

    return () => {
      // Cleanup when component unmounts
      if (previousObjectUrl.current) {
        URL.revokeObjectURL(previousObjectUrl.current);
      }
    };
  }, [data?.profile_photo, data?.photoConfirmed, setData]);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setSuccess('');

    if (!selectedFile) return;

    const isValidType = ['image/png', 'image/jpeg', 'image/jpg'].includes(selectedFile.type);
    const isValidSize = selectedFile.size <= 300 * 1024; // 300KB

    if (!isValidType) {
      setError('Only PNG, JPG, or JPEG files are allowed.');
      return;
    }

    if (!isValidSize) {
      setError('File size must be less than 300KB.');
      return;
    }

    // Important: Store the file in the parent component's state
    // This ensures it persists between section changes
    setData(prev => ({
      ...prev,
      profile_photo: selectedFile,
    }));

    setFile(selectedFile);
    setSuccess('Photo selected successfully!');

    // Reset file input for mobile Safari compatibility
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle image loading errors
  const handleImageError = () => {
    setError('Unable to display image preview.');
    setPreview(null);
  };

  // Create responsive styles
  const getStyles = () => {
    const isMobile = window.innerWidth < 500;

    return {
      container: {
        background: '#fff',
        padding: isMobile ? '15px' : '30px',
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
      previewContainer: {
        width: isMobile ? '220px' : '280px',
        height: isMobile ? '180px' : '220px',
        border: '3px dashed #1e3a8a',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        margin: '0 auto 15px auto',
        backgroundColor: '#f0f4ff',
        position: 'relative'
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
      previewImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '8px'
      },
      noPhotoText: {
        color: '#999',
        fontSize: isMobile ? '14px' : '16px'
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
  };

  const styles = getStyles();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        Upload Profile Photo *
      </div>

      <div style={styles.previewContainer}>
        {/* Only show badge when confirmed with button click */}
        {preview && data?.photoConfirmed && (
          <div style={styles.successBadge}>Confirmed ✓</div>
        )}
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            style={styles.previewImage}
            onError={handleImageError}
          />
        ) : (
          <span style={styles.noPhotoText}>
            No Photo Selected
          </span>
        )}
      </div>

      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleChange}
        style={{ display: 'none' }}
        id="fileInput"
        ref={fileInputRef}
        aria-label="Choose profile photo"
      />

      <label htmlFor="fileInput" style={styles.fileInputLabel}>
        Choose Photo
      </label>

      {error && <p style={styles.errorText}>{error}</p>}
      {success && <p style={styles.successText}>{success}</p>}

      <p style={styles.helpText}>
        Upload a photo with a plain background. Max size: <strong>300KB</strong>
      </p>
      <p style={styles.formatText}>
        Accepted formats: <strong>.png</strong>, <strong>.jpg</strong>, <strong>.jpeg</strong>
      </p>

      <button
        onClick={() => {
          if (file) {
            // Store confirmation in parent state to persist between section changes
            setData(prev => ({ ...prev, photoConfirmed: true }));
            setSuccess('Photo is ready for form submission!');
            setError('');       
            // Add alert notification
             alert('Profile Photo confirmed successfully!');
          } else {
            setError('Please select a valid photo first.');
          }
        }}
        disabled={!file}
        style={styles.uploadButton}
      >
        Confirm Photo
      </button>

    </div>
  );
};

export default Profile;
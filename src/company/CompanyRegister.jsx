import React, { useState } from 'react';
import CollegeHeader from '../shared/CollegeHeader'; // adjust path if needed
import { useEffect } from 'react';
const CompanyRegister = () => {
  const [data, setData] = useState({
    companyName: '',
    companyEmail: '',
    companyLogo: null,
    hrName: '',
    hrPhone: '',
    website: '',
  });
    useEffect(() => {
  const storedName = localStorage.getItem('company_name') || '';
  const storedEmail = localStorage.getItem('email') || '';

  setData((prev) => ({
    ...prev,
    companyName: storedName,
    companyEmail: storedEmail,
  }));
}, []);



  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setData({
      ...data,
      [name]: type === 'file' ? files[0] : value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const formDataToSend = new FormData();
  formDataToSend.append('company_name', data.companyName);
  formDataToSend.append('email', data.companyEmail); // Optional if JWT handles this on backend
  if (data.companyLogo) {
    formDataToSend.append('company_logo', data.companyLogo);
  }
  formDataToSend.append('hr_person_name', data.hrName);
  formDataToSend.append('hr_person_contact', data.hrPhone);
  formDataToSend.append('company_website', data.website);

  try {
    const response = await fetch(
      'https://placement-portal-backend.placementportal.workers.dev/api/company/profile/create',
      {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include', // send auth cookie if set as HttpOnly
      }
    );

    const result = await response.json();

    if (result.success) {
      alert('✅ Company registered successfully!');
       window.location.href = '/company-dashboard';
    } else {
      alert('❌ Registration failed: ' + (result.error || 'Unknown error'));
    }

    console.log('Server Response:', result);
  } catch (error) {
    console.error('❌ Error submitting form:', error);
    alert('❌ An error occurred during submission.');
  }
};
  return (
    <>
      <CollegeHeader />

      <div style={styles.container}>
        <div style={styles.header}>🏢 Company Registration</div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Company Name *</label>
            <input
              name="companyName"
              placeholder="e.g. Infosys Ltd"
              value={data.companyName}
              disabled
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Company Email *</label>
            <input
              type="email"
              name="companyEmail"
              placeholder="e.g. hr@company.com"
              value={data.companyEmail}
              disabled
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Company Logo</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              name="companyLogo"
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>HR Contact Person *</label>
            <input
              name="hrName"
              placeholder="e.g. Anjali Mehta"
              value={data.hrName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>HR Phone Number *</label>
            <input
              name="hrPhone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={data.hrPhone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Company Website</label>
            <input
              name="website"
              type="url"
              placeholder="e.g. https://www.company.com"
              value={data.website}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <button type="submit" style={styles.button}>
              Register
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    border: '1px solid #ccc',
  },
  header: {
    backgroundColor: '#1e1e3f',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '8px 8px 0 0',
    fontSize: '20px',
    marginBottom: '25px',
    textAlign: 'center',
  },
  form: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '6px',
    color: '#1e1e3f',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    fontSize: '14px',
    color: '#000',
  },
  button: {
    padding: '12px 30px',
    backgroundColor: '#1e1e3f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default CompanyRegister;

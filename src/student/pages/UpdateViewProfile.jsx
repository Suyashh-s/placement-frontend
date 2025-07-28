import React, { useEffect, useState } from "react";
import axios from "axios";
import CollegeHeader from "../../shared/CollegeHeader";
import { useNavigate } from "react-router-dom";
import {
  FaUser, FaGraduationCap, FaCode, FaTrophy, FaBuilding,
  FaSave, FaTimes, FaLink, FaGithub, FaLinkedin, FaGlobe
} from 'react-icons/fa';
import { SiCodeforces } from "react-icons/si";
import './ViewProfile.css';

const TABS = [
  { id: 'basic', label: 'Basic', icon: <FaUser /> },
  { id: 'academic', label: 'Academics', icon: <FaGraduationCap /> },
  { id: 'skills', label: 'Skills', icon: <FaCode /> },
  { id: 'projects', label: 'Projects', icon: <FaCode /> },
  { id: 'experience', label: 'Experience', icon: <FaBuilding /> },
  { id: 'achievements', label: 'Awards', icon: <FaTrophy /> },
  { id: 'certifications', label: 'Links', icon: <FaLink /> }
];

const Section = ({ title, icon, children }) => (
  <div className="section">
    <h3 className="section-title">{icon} {title}</h3>
    {children}
  </div>
);

const EditableItem = ({ label, children }) => (
  <div className="item">
    <div className="item-label">{label}</div>
    <div className="item-value">{children}</div>
  </div>
);

const EditableInput = ({ value, name, onChange, type = "text", ...props }) => (
  <input
    type={type}
    className="edit-input"
    name={name}
    value={value || ""}
    onChange={onChange}
    {...props}
  />
);

const EditableTextArea = ({ value, name, onChange, ...props }) => (
  <textarea
    className="edit-textarea"
    name={name}
    value={value || ""}
    onChange={onChange}
    {...props}
  />
);

const UpdateViewProfile = () => {
  const [data, setData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://placement-portal-backend.placementportal.workers.dev/api/student/profile/view",
          { withCredentials: true }
        );
        setData(res.data.profile);
        setEditData(res.data.profile);
      } catch (err) {
        setMsg("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await axios.put(
        "https://placement-portal-backend.placementportal.workers.dev/api/student/profile/update",
        editData,
        { withCredentials: true }
      );
      setMsg("Profile updated!");
      setTimeout(() => {
        navigate("/viewprofile");
      }, 1200);
    } catch {
      setMsg("Failed to update. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/viewprofile");
  };

  if (loading) {
    return (
      <div className="profile-container">
        <CollegeHeader />
        <div className="profile-card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Editable Sections ---
  const renderBasicInfoEdit = () => (
    <div className="content-grid">
      <Section title="Personal Information" icon={<FaUser />}>
        <EditableItem label="Full Name">
          <EditableInput name="first_name" value={editData?.first_name} onChange={handleChange} placeholder="First Name" style={{marginRight: 8, width: 100}} />
          <EditableInput name="middle_name" value={editData?.middle_name} onChange={handleChange} placeholder="Middle Name" style={{marginRight: 8, width: 100}} />
          <EditableInput name="last_name" value={editData?.last_name} onChange={handleChange} placeholder="Last Name" style={{width: 100}} />
        </EditableItem>
        <EditableItem label="Student ID">
          <EditableInput name="student_id" value={editData?.student_id} onChange={handleChange} />
        </EditableItem>
        <EditableItem label="Gender">
          <select name="gender" value={editData?.gender || ""} onChange={handleChange} className="edit-input">
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </EditableItem>
        <EditableItem label="Date of Birth">
          <EditableInput name="date_of_birth" value={editData?.date_of_birth || ""} onChange={handleChange} type="date" />
        </EditableItem>
      </Section>
      <Section title="Contact Information" icon={<FaUser />}>
        <EditableItem label="Primary Contact">
          <EditableInput name="contact_number_primary" value={editData?.contact_number_primary} onChange={handleChange} />
        </EditableItem>
        <EditableItem label="Alternate Contact">
          <EditableInput name="contact_number_alternate" value={editData?.contact_number_alternate} onChange={handleChange} />
        </EditableItem>
        <EditableItem label="Email Address">
          <EditableInput name="email" value={editData?.email} onChange={handleChange} />
        </EditableItem>
        <EditableItem label="Aadhaar Number">
          <EditableInput name="aadhaar_number" value={editData?.aadhaar_number} onChange={handleChange} />
        </EditableItem>
        <EditableItem label="Alternate Email">
          <EditableInput name="alternate_email" value={editData?.alternate_email} onChange={handleChange} />
        </EditableItem>
        <EditableItem label="PAN Number">
          <EditableInput name="pan_number" value={editData?.pan_number} onChange={handleChange} />
        </EditableItem>
      </Section>
    </div>
  );

  const renderAcademicInfoEdit = () => (
    <div className="content-single">
      <Section title="Current Academic Status" icon={<FaGraduationCap />}>
        <div className="content-grid">
          <EditableItem label="Department">
            <EditableInput name="department" value={editData?.department} onChange={handleChange} />
          </EditableItem>
          <EditableItem label="Current Year">
            <EditableInput name="current_year" value={editData?.current_year} onChange={handleChange} />
          </EditableItem>
          <EditableItem label="PRN Number">
            <EditableInput name="prn" value={editData?.prn} onChange={handleChange} />
          </EditableItem>
          <EditableItem label="Division">
            <EditableInput name="division" value={editData?.division} onChange={handleChange} />
          </EditableItem>
          <EditableItem label="Year of Admission">
            <EditableInput name="year_of_admission" value={editData?.year_of_admission} onChange={handleChange} />
          </EditableItem>
          <EditableItem label="Expected Graduation">
            <EditableInput name="expected_graduation_year" value={editData?.expected_graduation_year} onChange={handleChange} />
          </EditableItem>
          <EditableItem label="Current CGPA">
            <EditableInput name="cgpa" value={editData?.cgpa} onChange={handleChange} />
          </EditableItem>
          <EditableItem label="Last Semester">
            <EditableInput name="last_semester" value={editData?.last_semester} onChange={handleChange} />
          </EditableItem>
        </div>
      </Section>
      {/* Add more editable academic fields as needed */}
    </div>
  );

  const renderSkillsEdit = () => (
    <div className="content-grid">
      <Section title="Technical Skills" icon={<FaCode />}>
        <EditableItem label="Programming Languages">
          <EditableInput
            name="programming_languages"
            value={editData?.programming_languages}
            onChange={handleChange}
            placeholder="Comma separated"
          />
        </EditableItem>
        <EditableItem label="Technical Skills">
          <EditableInput
            name="skills"
            value={editData?.skills}
            onChange={handleChange}
            placeholder="Comma separated"
          />
        </EditableItem>
      </Section>
    </div>
  );

  // Expand for projects, experience, achievements, certifications...

  const renderContent = () => {
    switch (activeTab) {
      case 'basic': return renderBasicInfoEdit();
      case 'academic': return renderAcademicInfoEdit();
      case 'skills': return renderSkillsEdit();
      // Expand for other tabs
      default: return <div>Edit mode not implemented for this section.</div>;
    }
  };

  return (
    <div className="profile-container">
      <CollegeHeader />
      <div className="profile-card">
        <div className="profile-header">
          <h2>Update Your Profile</h2>
        </div>
        <div className="nav-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              disabled={saving}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <div className="profile-content fade-in">
          {renderContent()}
        </div>
      </div>
      <div className="edit-actions">
        <button className="edit-button" onClick={handleSave} disabled={saving}>
          {saving ? <span>Saving...</span> : <><FaSave /> Save</>}
        </button>
        <button className="edit-button cancel" onClick={handleCancel} disabled={saving}>
          <FaTimes /> Cancel
        </button>
        {msg && <div className="save-msg">{msg}</div>}
      </div>
    </div>
  );
};

export default UpdateViewProfile;
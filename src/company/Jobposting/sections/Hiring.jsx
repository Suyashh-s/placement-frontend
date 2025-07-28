import React from 'react';
import { FaArrowRight, FaRegCalendarAlt } from 'react-icons/fa';

const Hiring = ({ data = {}, setData, onNext }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNext = () => {
    if (!data.selectionRounds || !data.driveDate || !data.interviewMode) {
      return;
    }
    onNext?.();
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#000',
    fontSize: '14px',
    width: '100%',
  };

  const labelStyle = {
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '5px',
    color: '#1e1e3f',
  };

  const dateWrapper = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const iconStyle = {
    position: 'absolute',
    right: '12px',
    color: '#1e1e3f',
    fontSize: '16px',
    pointerEvents: 'none',
  };

  return (
    <div style={{
      background: '#fff',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      border: '1px solid #ccc',
      marginBottom: '20px'
    }}>
      <div style={{
        backgroundColor: '#1e1e3f',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px 8px 0 0',
        fontSize: '18px',
        marginBottom: '25px',
        fontWeight: 'bold',
      }}>
        🧩 Hiring Process Details
      </div>

      <form
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        }}
        autoComplete="off"
      >
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Selection Rounds *</label>
          <textarea
            name="selectionRounds"
            placeholder="e.g. Online Test, Technical Interview, HR Interview"
            value={data.selectionRounds || ''}
            onChange={handleChange}
            style={{ ...inputStyle, height: '90px', resize: 'vertical' }}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Tentative Drive Date *</label>
          <div style={dateWrapper}>
            <input
              name="driveDate"
              type="date"
              value={data.driveDate || ''}
              onChange={handleChange}
              style={{ ...inputStyle, paddingRight: '35px' }}
              required
            />
            <FaRegCalendarAlt style={iconStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Mode of Interview *</label>
          <select
            name="interviewMode"
            value={data.interviewMode || ''}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div
          style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            gap: 12
          }}
        >
          <button
            type="button"
            className="save-next-btn"
            onClick={handleSaveNext}
            style={{
              padding: '12px 34px',
              backgroundColor: '#1e1e3f',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '16px',
              gap: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Save and Next <FaArrowRight size={16} />
          </button>
        </div>
      </form>

      <style>
        {`
          @media (max-width: 768px) {
            .save-next-btn {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Hiring;

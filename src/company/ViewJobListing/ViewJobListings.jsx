import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaPowerOff, FaSync, FaFilter, FaRegCalendarAlt } from "react-icons/fa";
import CollegeHeader from "../../shared/CollegeHeader";
import "./ViewJobListings.css";

const ViewJobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'

  // Fetch jobs when component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        'https://placement-portal-backend.placementportal.workers.dev/api/company/view-jobs',
        { withCredentials: true }
      );
      
      if (response.data && response.data.success) {
        setJobs(response.data.jobs || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.response?.data?.message || 'Unable to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId, newStatus) => {
    try {
      const confirmUpdate = window.confirm(
        newStatus === 'inactive' 
          ? "Are you sure you want to deactivate this job posting? Students will no longer be able to apply."
          : "Are you sure you want to reactivate this job posting? It will be visible to students again."
      );
      
      if (!confirmUpdate) return;
      
      // First update UI optimistically
      setJobs(jobs.map(job => 
        job.job_id === jobId ? {...job, status: newStatus} : job
      ));
      
      const response = await axios.post(
        'https://placement-portal-backend.placementportal.workers.dev/api/company/update-job-status',
        {
          job_id: jobId,
          status: newStatus
        },
        { withCredentials: true }
      );
      
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to update job status');
      }
      
      // Show success toast/notification (could be implemented)
      showNotification(`Job ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      
    } catch (error) {
      console.error('Error updating job status:', error);
      
      // Revert optimistic update
      fetchJobs();
      
      // Show error notification
      alert('Failed to update job status. Please try again.');
    }
  };

  const showNotification = (message) => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'job-notification';
    notification.innerHTML = `<div class="job-notification-content">${message}</div>`;
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
      notification.classList.add('job-notification-visible');
    }, 10);
    
    // Remove notification after delay
    setTimeout(() => {
      notification.classList.remove('job-notification-visible');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const getCurrentDateTime = () => {
    return "2025-07-06 09:35:19";
  };

  const getCurrentUser = () => {
    return "kshitij-dmce";
  };

  const getFilteredJobs = () => {
    if (filter === 'all') return jobs;
    return jobs.filter(job => job.status === filter);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="job-listings-page">
        <CollegeHeader />
        <div className="job-listings-loading">
          <div className="job-listings-spinner"></div>
          <p>Loading job listings...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="job-listings-page">
        <CollegeHeader />
        <div className="job-listings-error">
          <div className="job-listings-error-icon">❌</div>
          <h3>Error Loading Jobs</h3>
          <p>{error}</p>
          <button onClick={fetchJobs}>Try Again</button>
        </div>
      </div>
    );
  }

  // Show empty state if no jobs
  if (jobs.length === 0) {
    return (
      <div className="job-listings-page">
        <CollegeHeader />
        <div className="job-listings-empty">
          <div className="job-listings-empty-icon">📋</div>
          <h3>No Job Listings Found</h3>
          <p>You haven't posted any jobs yet.</p>
          <button onClick={() => window.location.href = '/company/post-job'} className="job-listings-cta">
            Post Your First Job
          </button>
        </div>
      </div>
    );
  }

  const filteredJobs = getFilteredJobs();

  return (
    <div className="job-listings-page">
      <CollegeHeader />
      
      <div className="job-listings-header">
        <h2 className="job-listings-title">📢 Your Job Listings</h2>
        
        <div className="job-listings-controls">
          <div className="job-listings-filter">
            <FaFilter className="job-listings-filter-icon" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="job-listings-filter-select"
            >
              <option value="all">All Jobs</option>
              <option value="active">Active Jobs</option>
              <option value="inactive">Inactive Jobs</option>
            </select>
          </div>
          
          <button className="job-listings-refresh" onClick={fetchJobs}>
            <FaSync /> Refresh
          </button>
        </div>
      </div>
      
      <div className="job-listings-stats">
        <div className="job-listings-stat">
          <span className="job-listings-stat-number">{jobs.length}</span>
          <span className="job-listings-stat-label">Total Jobs</span>
        </div>
        <div className="job-listings-stat">
          <span className="job-listings-stat-number">{jobs.filter(job => job.status === 'active').length}</span>
          <span className="job-listings-stat-label">Active</span>
        </div>
        <div className="job-listings-stat">
          <span className="job-listings-stat-number">{jobs.filter(job => job.status === 'inactive').length}</span>
          <span className="job-listings-stat-label">Inactive</span>
        </div>
      </div>
      
      {filteredJobs.length === 0 ? (
        <div className="job-listings-filtered-empty">
          <p>No jobs match your current filter.</p>
          <button onClick={() => setFilter('all')} className="job-listings-reset-filter">
            Show All Jobs
          </button>
        </div>
      ) : (
        <div className="job-listings-container">
          {filteredJobs.map((job) => (
            <div key={job.job_id} className={`job-card ${job.status === 'inactive' ? 'job-card-inactive' : ''}`}>
              {job.status === 'inactive' && <div className="job-card-inactive-badge">INACTIVE</div>}
              
              <h3>{job.job_title}</h3>
              
              <div className="job-card-details">
                <p>
                  <strong>Location:</strong> {job.job_location || 'Not specified'}
                </p>
                <p>
                  <strong>Type:</strong> {job.job_type || 'Not specified'}
                </p>
                <p>
                  <strong>Batch:</strong> {job.batch || 'Not specified'}
                </p>
                <p>
                  <strong>Openings:</strong> {job.openings || 'Not specified'}
                </p>
                <p>
                  <FaRegCalendarAlt className="job-date-icon" />
                  <span className="job-date">Posted on {formatDate(job.created_at)}</span>
                </p>
                <p className={`job-status ${job.status}`}>
                  {job.status === "active" ? "🟢 Active" : "🔴 Inactive"}
                </p>
              </div>
              
              <div className="job-card-actions">
                <button 
                  className={`job-card-toggle-btn ${job.status === 'active' ? 'deactivate' : 'activate'}`}
                  onClick={() => updateJobStatus(job.job_id, job.status === 'active' ? 'inactive' : 'active')}
                >
                  <FaPowerOff />
                  {job.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                
                <button 
                  className="job-card-view-btn"
                  onClick={() => window.location.href = `/company/job/${job.job_id}`}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default ViewJobListings;
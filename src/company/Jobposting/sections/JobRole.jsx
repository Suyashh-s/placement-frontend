import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaTimes, FaPlus } from 'react-icons/fa';
import './JobRole.css';

const JobRole = ({ formData, setFormData, onNext }) => {
  // Comprehensive list of programming languages categorized
  const programmingLanguages = [
    // Front-end
    "JavaScript", "TypeScript", "HTML", "CSS", "Dart", "Elm",
    "CoffeeScript", "ClojureScript", "JSX", "EJS", "Pug", "LESS", "SASS", "Stylus",
    
    // Back-end
    "Python", "Java", "Ruby", "PHP", "Go", "C#", "Rust", "Node.js", "Kotlin", 
    "Scala", "Groovy", "Perl", "Haskell", "Elixir", "Clojure", "Erlang",
    
    // Mobile
    "Swift", "Objective-C", "Kotlin", "Java", "React Native", "Flutter", "Xamarin",
    
    // Systems & Low-level
    "C", "C++", "Assembly", "Fortran", "COBOL", "Ada", "D", "Zig", "V", "Nim",
    
    // ML & Data Science
    "Python", "R", "Julia", "MATLAB", "SAS", "Scala", "OCaml", "F#", 
    "TensorFlow", "PyTorch", "Keras", "Pandas", "NumPy",
    
    // Database
    "SQL", "PL/SQL", "T-SQL", "PostgreSQL", "MySQL", "MariaDB", "SQLite", "Oracle",
    "MongoDB", "Cassandra", "Redis", "Neo4j", "GraphQL", "Cypher", "DynamoDB",
    
    // DevOps & Cloud
    "Bash", "Shell Script", "PowerShell", "HCL (Terraform)", "YAML", "Ansible",
    "Docker", "Kubernetes", "CloudFormation", "ARM Templates", "Pulumi",
    
    // Web Frameworks & Libraries
    "React", "Angular", "Vue.js", "Svelte", "Express", "Django", "Flask",
    "Spring Boot", "Laravel", "Ruby on Rails", "ASP.NET", "Next.js", "Nuxt.js",
    
    // Other
    "Lisp", "Prolog", "Lua", "Solidity", "Apex", "ABAP", "VBA", "Crystal", 
    "WebAssembly", "Delphi", "Visual Basic", "ActionScript", "ColdFusion"
  ].sort();

  // Comprehensive list of technical and non-technical skills
  const allSkills = [
    // Software Engineering
    "Data Structures", "Algorithms", "Object-Oriented Programming", "Functional Programming",
    "Design Patterns", "Software Architecture", "API Design", "System Design", 
    "Microservices", "Serverless", "RESTful Services", "GraphQL", "gRPC", "WebSockets",
    "Distributed Systems", "Concurrent Programming", "Parallel Computing",
    
    // Web Development
    "Front-end Development", "Back-end Development", "Full-stack Development",
    "Responsive Design", "Web Accessibility", "Progressive Web Apps", "Single Page Applications",
    "State Management", "Component Design", "Web Performance Optimization", "Web Security",
    "Authentication", "Authorization", "OAuth", "JWT", "SEO", "Web Analytics",
    
    // Mobile Development
    "iOS Development", "Android Development", "Cross-platform Development",
    "Mobile UI/UX", "Push Notifications", "Offline Storage", "Geolocation",
    "App Store Optimization", "Mobile Security", "Responsive Layouts",
    
    // DevOps & Infrastructure
    "CI/CD", "Infrastructure as Code", "Configuration Management", "Containerization",
    "Orchestration", "Cloud Services", "Monitoring", "Logging", "Alerting",
    "Site Reliability Engineering", "Performance Tuning", "Load Balancing", "CDN",
    "Networking", "Firewall Configuration", "VPN", "DNS Management",
    
    // Database
    "Database Design", "Query Optimization", "Indexing", "Normalization",
    "Transactions", "ACID Properties", "ORM", "Database Migration", "Data Modeling",
    "Caching Strategies", "Connection Pooling", "Sharding", "Replication",
    
    // Data Science & ML
    "Machine Learning", "Deep Learning", "Natural Language Processing",
    "Computer Vision", "Data Mining", "Statistical Analysis", "A/B Testing",
    "Feature Engineering", "Model Deployment", "Data Visualization", "Big Data",
    "ETL", "Data Warehousing", "Business Intelligence", "Predictive Analytics",
    
    // Security
    "Penetration Testing", "Security Auditing", "Vulnerability Assessment",
    "Encryption", "Secure Coding Practices", "Threat Modeling", "OWASP", "GDPR Compliance",
    "Security Architecture", "Identity Management", "Zero Trust", "Blockchain",
    
    // Non-Technical Skills
    "Problem Solving", "Critical Thinking", "Analytical Skills", "Teamwork",
    "Communication", "Project Management", "Time Management", "Leadership",
    "Documentation", "Technical Writing", "Code Review", "Mentoring",
    "Client Management", "Stakeholder Management", "Agile Methodology", "Scrum",
    "Presentation Skills", "Public Speaking", "Negotiation", "Conflict Resolution",
    "Strategic Planning", "Business Analysis", "Requirements Gathering", "Risk Management",
    
    // Finance & Business
    "Financial Analysis", "Budgeting", "Forecasting", "Market Research",
    "Business Development", "Sales", "Marketing", "Customer Service",
    "Operations Management", "Supply Chain Management", "Quality Assurance",
    "Compliance", "Audit", "Accounting", "Taxation", "Investment Analysis",
    
    // Creative & Design
    "UI/UX Design", "Graphic Design", "Web Design", "Brand Design",
    "Typography", "Color Theory", "Wireframing", "Prototyping",
    "User Research", "Usability Testing", "Adobe Creative Suite",
    "Figma", "Sketch", "Video Editing", "Animation", "Photography",
    
    // Tools & Platforms
    "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence", "Jenkins", "CircleCI",
    "Travis CI", "GitHub Actions", "Docker", "Kubernetes", "Terraform", "AWS", "Azure", 
    "GCP", "Digital Ocean", "Heroku", "Firebase", "Vercel", "Netlify", "Cloudflare",
    "Salesforce", "HubSpot", "Slack", "Microsoft Office", "Google Workspace",
    "Tableau", "Power BI", "Excel", "SAP", "Oracle", "Workday"
  ].sort();

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentField, setCurrentField] = useState('');

  // Initialize skills_required if not present
  useEffect(() => {
    if (!formData.skills_required) {
      setFormData(prev => ({ ...prev, skills_required: '' }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'skills_required') {
      fetchSuggestions(value);
      setCurrentField(name);
    }
  };

  const getLastTypedWord = (value) => {
    const skills = value.split(',').map(skill => skill.trim());
    const lastSkill = skills[skills.length - 1];
    return lastSkill || '';
  };

  const fetchSuggestions = (value) => {
    const lastTypedWord = getLastTypedWord(value);
    
    if (lastTypedWord.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Combine programming languages and skills for comprehensive search
    const allOptions = [...new Set([...programmingLanguages, ...allSkills])];
    
    const filteredSuggestions = allOptions.filter(
      skill => skill.toLowerCase().includes(lastTypedWord.toLowerCase())
    ).slice(0, 15);

    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0);
  };

  const handleSelectSuggestion = (selectedSkill) => {
    const currentValue = formData.skills_required || '';
    const skills = currentValue.split(',').map(skill => skill.trim()).filter(Boolean);
    
    // Replace the last skill with the selected suggestion
    skills.pop();
    skills.push(selectedSkill);
    
    // Set the updated value with a trailing comma and space
    const newValue = skills.join(', ') + (skills.length > 0 ? ', ' : '');
    
    setFormData(prev => ({ ...prev, skills_required: newValue }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSaveNext = () => {
    if (
      !formData.job_title ||
      !formData.job_description ||
      !formData.jobLocation ||
      !formData.openings ||
      !formData.jobType ||
      !formData.roleType ||
      !formData.skills_required?.trim()
    ) {
      alert('Please fill all required fields including Role and skills before proceeding.');
      return;
    }
    if (onNext) onNext();
  };

  // Helper function to process comma-separated values into array for display
  const processCsvToArray = (csvString) => {
    if (!csvString || typeof csvString !== 'string') return [];
    return csvString.split(',')
      .map(item => item.trim())
      .filter(Boolean);
  };

  return (
    <div className="job-role-container">
      <div className="job-role-header">
        💼 Job Role & Description
      </div>

      <form className="job-role-form">
        <div className="form-group">
          <label className="form-label">Job Title / Role *</label>
          <input
            className="form-input"
            name="job_title"
            placeholder="e.g. Software Engineer Intern"
            value={formData.job_title || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Job Description *</label>
          <textarea
            className="form-textarea"
            name="job_description"
            placeholder="Brief about job responsibilities, skills required, etc."
            value={formData.job_description || ''}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Job Location *</label>
          <select
            className="form-select"
            name="jobLocation"
            value={formData.jobLocation || ''}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Onsite">Onsite</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Number of Openings *</label>
          <input
            className="form-input"
            type="number"
            name="openings"
            placeholder="e.g. 5"
            value={formData.openings || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Job Type *</label>
          <select
            className="form-select"
            name="jobType"
            value={formData.jobType || ''}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="PPO">PPO</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Role *</label>
          <select
            className="form-select"
            name="roleType"
            value={formData.roleType || ''}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Tech">Tech</option>
            <option value="Non-Tech">Non-Tech</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Industry / Domain</label>
          <input
            className="form-input"
            name="industry"
            placeholder="e.g. IT, Finance, Healthcare"
            value={formData.industry || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Skills Required *</label>
          <div className="skills-input-container">
            <input
              className="form-input skills-input"
              name="skills_required"
              placeholder="e.g. JavaScript, Python, Communication Skills"
              value={formData.skills_required || ''}
              onChange={handleChange}
              autoComplete="off"
              required
            />
            <div className="skills-helper-text">
              Enter multiple skills separated by commas. Start typing to see suggestions.
            </div>
            
            {/* Display tagged skills below input */}
            <div className="skills-tags">
              {processCsvToArray(formData.skills_required).map((skill, idx) => (
                <div key={idx} className="skill-tag">
                  {skill}
                </div>
              ))}
            </div>
            
            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="suggestion-item"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="save-next-btn"
            onClick={handleSaveNext}
          >
            Save and Next <FaArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobRole;
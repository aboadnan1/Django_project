// src/pages/Projects.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchDate) {
      loadProjects();
      return;
    }

    try {
      const response = await projectsAPI.search(searchDate);
      setProjects(response.data);
    } catch (error) {
      console.error('Error searching projects:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="display-5 fw-bold text-primary">Explore Projects</h1>
          <p className="lead text-muted">Discover amazing ideas and support innovation</p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link to="/create-project" className="btn btn-primary-custom">
            <i className="bi bi-plus-circle me-2"></i>
            Start a Project
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-3">
            <div className="col-md-6">
              <label htmlFor="searchDate" className="form-label">Search by Date</label>
              <input
                type="date"
                className="form-control"
                id="searchDate"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <button type="submit" className="btn btn-primary me-2">
                <i className="bi bi-search me-2"></i>
                Search
              </button>
              {searchDate && (
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearchDate('');
                    loadProjects();
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <h3 className="mt-3 text-muted">No Projects Found</h3>
          <p className="text-muted">Be the first to start a project!</p>
          <Link to="/create-project" className="btn btn-primary-custom">
            Start Your Project
          </Link>
        </div>
      ) : (
        <div className="row">
          {projects.map(project => (
            <div key={project.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card card-hover h-100">
                <div className="project-image position-relative">
                  <i className="bi bi-lightbulb"></i>
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge bg-primary">
                      {calculateDaysLeft(project.end_time)} days left
                    </span>
                  </div>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{project.title}</h5>
                  <p className="card-text flex-grow-1 text-muted">
                    {project.details.length > 100 
                      ? `${project.details.substring(0, 100)}...` 
                      : project.details
                    }
                  </p>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Target</span>
                      <strong className="text-primary">
                        EGP {parseFloat(project.total_target).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                      <span>By {project.user_name}</span>
                      <span>Ends {formatDate(project.end_time)}</span>
                    </div>
                    
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-primary">
                        <i className="bi bi-heart me-2"></i>
                        Support Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
// // src/pages/MyProjects.jsx


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingProject, setDeletingProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getMyProjects();
      
      const projectsData = response.data.projects || 
                          response.data || 
                          response.data.results || 
                          [];
      
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeletingProject(projectId);
    
    try {
      await projectsAPI.delete(projectId);
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    } finally {
      setDeletingProject(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">My Projects</h2>
          <p className="text-muted mb-0">Manage your crowdfunding projects</p>
        </div>
        <Link to="/create-project" className="btn btn-primary-custom">
          <i className="bi bi-plus me-2"></i>
          New Project
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your projects...</p>
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="row">
          {projects.map(project => (
            <div key={project.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card card-hover h-100">
                <div className="project-image position-relative">
                  <i className="bi bi-lightbulb"></i>
                  {project.featured && (
                    <span className="position-absolute top-0 start-0 badge bg-warning m-2">
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{project.title}</h5>
                  
                  <p className="card-text text-muted flex-grow-1">
                    {project.description ? 
                      (project.description.length > 100 
                        ? `${project.description.substring(0, 100)}...` 
                        : project.description)
                      : 'No description available'
                    }
                  </p>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>Progress</span>
                      <span>{calculateProgress(project.current_total || 0, project.total_target)}%</span>
                    </div>
                    <div className="progress" style={{height: '6px'}}>
                      <div 
                        className="progress-bar" 
                        style={{width: `${calculateProgress(project.current_total || 0, project.total_target)}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">
                        <i className="bi bi-currency-dollar me-1"></i>
                        EGP {parseFloat(project.total_target).toLocaleString()}
                      </small>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {formatDate(project.end_time)}
                      </small>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <Link 
                        to={`/edit-project/${project.id}`}
                        className="btn btn-outline-primary btn-sm flex-fill"
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={deletingProject === project.id}
                        className="btn btn-outline-danger btn-sm flex-fill"
                      >
                        {deletingProject === project.id ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-1" role="status">
                              <span className="visually-hidden">Deleting...</span>
                            </div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="empty-state">
            <i className="bi bi-folder-x display-1 text-muted mb-3"></i>
            <h3 className="text-muted">No Projects Yet</h3>
            <p className="text-muted mb-4">Start your first crowdfunding project and make a difference!</p>
            <Link to="/create-project" className="btn btn-primary-custom btn-lg">
              <i className="bi bi-plus-circle me-2"></i>
              Create Your First Project
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
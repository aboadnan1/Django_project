// src/components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, showActions = false, onDelete }) => {
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

  const daysLeft = calculateDaysLeft(project.end_time);

  return (
    <div className="card card-hover h-100">
      <div className="project-image position-relative">
        <i className="bi bi-lightbulb"></i>
        <div className="position-absolute top-0 end-0 m-3">
          <span className={`badge ${daysLeft > 0 ? 'bg-primary' : 'bg-secondary'}`}>
            {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
          </span>
        </div>
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{project.title}</h5>
        
        <p className="card-text flex-grow-1 text-muted small">
          {project.details.length > 100 
            ? `${project.details.substring(0, 100)}...` 
            : project.details
          }
        </p>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted small">Target</span>
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
          
          {showActions ? (
            <div className="d-flex gap-2">
              <Link 
                to={`/edit-project/${project.id}`}
                className="btn btn-outline-primary btn-sm flex-fill"
              >
                <i className="bi bi-pencil me-1"></i>
                Edit
              </Link>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDelete(project.id)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ) : (
            <div className="d-grid">
              <button className="btn btn-outline-primary btn-sm">
                <i className="bi bi-heart me-1"></i>
                Support Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
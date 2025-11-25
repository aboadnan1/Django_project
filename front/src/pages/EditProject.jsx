// src/pages/EditProject.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useForm } from 'react-hook-form';

const EditProject = () => {
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await projectsAPI.get(id);
      const projectData = response.data;
      setProject(projectData);
      
      // Set form values
      setValue('title', projectData.title);
      setValue('details', projectData.details);
      setValue('total_target', projectData.total_target);
      setValue('start_time', projectData.start_time.slice(0, 16));
      setValue('end_time', projectData.end_time.slice(0, 16));
    } catch (error) {
      setError('Project not found');
      console.error('Error loading project:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      // Validate dates
      const startTime = new Date(data.start_time);
      const endTime = new Date(data.end_time);
      
      if (startTime >= endTime) {
        throw new Error('End time must be after start time');
      }

      await projectsAPI.update(id, {
        title: data.title,
        details: data.details,
        total_target: parseFloat(data.total_target),
        start_time: data.start_time,
        end_time: data.end_time
      });
      
      navigate('/my-projects');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error && !project) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  if (!project) {
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
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header hero-gradient text-white py-4">
              <h2 className="card-title mb-0 text-center">
                <i className="bi bi-pencil-square me-2"></i>
                Edit Project
              </h2>
            </div>
            <div className="card-body p-5">
              {error && (
                <div className="alert alert-danger fade-in" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-semibold">Project Title</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    {...register('title', { 
                      required: 'Project title is required',
                      minLength: { value: 5, message: 'Title must be at least 5 characters' }
                    })}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title.message}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="details" className="form-label fw-semibold">Project Details</label>
                  <textarea
                    className={`form-control ${errors.details ? 'is-invalid' : ''}`}
                    id="details"
                    rows="6"
                    {...register('details', { 
                      required: 'Project details are required',
                      minLength: { value: 50, message: 'Details must be at least 50 characters' }
                    })}
                  ></textarea>
                  {errors.details && (
                    <div className="invalid-feedback">{errors.details.message}</div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label htmlFor="total_target" className="form-label fw-semibold">Funding Goal (EGP)</label>
                      <input
                        type="number"
                        className={`form-control ${errors.total_target ? 'is-invalid' : ''}`}
                        id="total_target"
                        min="100"
                        step="100"
                        {...register('total_target', { 
                          required: 'Funding goal is required',
                          min: { value: 100, message: 'Minimum funding goal is EGP 100' }
                        })}
                      />
                      {errors.total_target && (
                        <div className="invalid-feedback">{errors.total_target.message}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label htmlFor="start_time" className="form-label fw-semibold">Start Date</label>
                      <input
                        type="datetime-local"
                        className={`form-control ${errors.start_time ? 'is-invalid' : ''}`}
                        id="start_time"
                        {...register('start_time', { 
                          required: 'Start date is required'
                        })}
                      />
                      {errors.start_time && (
                        <div className="invalid-feedback">{errors.start_time.message}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label htmlFor="end_time" className="form-label fw-semibold">End Date</label>
                      <input
                        type="datetime-local"
                        className={`form-control ${errors.end_time ? 'is-invalid' : ''}`}
                        id="end_time"
                        {...register('end_time', { 
                          required: 'End date is required'
                        })}
                      />
                      {errors.end_time && (
                        <div className="invalid-feedback">{errors.end_time.message}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary me-md-2"
                    onClick={() => navigate('/my-projects')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary-custom px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Update Project
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
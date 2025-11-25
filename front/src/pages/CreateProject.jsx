// src/pages/CreateProject.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useForm } from 'react-hook-form';

const CreateProject = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      await projectsAPI.create({
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

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header hero-gradient text-white py-4">
              <h2 className="card-title mb-0 text-center">
                <i className="bi bi-rocket-takeoff me-2"></i>
                Start Your Project
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
                    placeholder="Enter a catchy title for your project"
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
                    placeholder="Describe your project in detail. What problem does it solve? Why should people support it?"
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
                        placeholder="50000"
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
                        min={today}
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
                        min={today}
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

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary-custom btn-lg py-3 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Project...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-rocket-takeoff me-2"></i>
                        Launch Your Project
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

export default CreateProject;
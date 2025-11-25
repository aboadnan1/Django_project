// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

const Login = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      await login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 card-hover">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="card-title fw-bold text-primary">Welcome Back</h2>
                <p className="text-muted">Sign in to your CrowdFund account</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    placeholder="john@example.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email.message}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    placeholder="••••••••"
                    {...register('password', { 
                      required: 'Password is required'
                    })}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password.message}</div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary-custom w-100 py-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Don't have an account? <Link to="/register" className="text-primary text-decoration-none fw-semibold">Sign Up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
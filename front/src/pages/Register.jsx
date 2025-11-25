// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

const Register = () => {
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      // Validate Egyptian mobile number
      const egyptian = /^01[0125][0-9]{8}$/;
      if (!egyptian.test(data.mobile)) {
        throw new Error('Please enter a valid Egyptian mobile number (e.g., 01012345678)');
      }

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        mobile: data.mobile,
        confirm_password: data.confirmPassword 
      });
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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
                <h2 className="card-title fw-bold text-primary">Join CrowdFund</h2>
                <p className="text-muted">Start your crowdfunding journey today</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        id="firstName"
                        placeholder="John"
                        {...register('firstName', { 
                          required: 'First name is required',
                          minLength: { value: 2, message: 'First name must be at least 2 characters' }
                        })}
                      />
                      {errors.firstName && (
                        <div className="invalid-feedback">{errors.firstName.message}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        id="lastName"
                        placeholder="Doe"
                        {...register('lastName', { 
                          required: 'Last name is required',
                          minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                        })}
                      />
                      {errors.lastName && (
                        <div className="invalid-feedback">{errors.lastName.message}</div>
                      )}
                    </div>
                  </div>
                </div>

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

                <div className="mb-3">
                  <label htmlFor="mobile" className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                    id="mobile"
                    placeholder="01012345678"
                    {...register('mobile', { 
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^01[0125][0-9]{8}$/,
                        message: 'Please enter a valid Egyptian mobile number'
                      }
                    })}
                  />
                  {errors.mobile && (
                    <div className="invalid-feedback">{errors.mobile.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    placeholder="••••••••"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password.message}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    placeholder="••••••••"
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === watch('password') || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword.message}</div>
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
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-semibold">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
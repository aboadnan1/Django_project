// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, projectsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        mobile: user.mobile || ''
      });
      loadUserProjects();
    }
  }, [user]);

  const loadUserProjects = async () => {
    try {
      const response = await projectsAPI.getMyProjects();
      setUserProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const updateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        mobile: formData.mobile
      };
      
      await updateProfile(updateData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      await authAPI.changePassword(passwordData);
      setMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (!deletePassword) {
      alert('Please enter your password to confirm account deletion.');
      return;
    }

    if (!window.confirm('Are you absolutely sure? This will permanently delete your account and all your projects. This action cannot be undone!')) {
      return;
    }

    setDeletingAccount(true);
    
    try {
      await deleteAccount(deletePassword);
      logout();
      navigate('/login');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Incorrect password. Please try again.');
      } else {
        alert('Error deleting account. Please try again.');
      }
    } finally {
      setDeletingAccount(false);
      setDeletePassword('');
      setShowDeleteAccount(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container py-4">
      {/* Profile Header */}
      <div className="profile-header rounded-3 mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-5 fw-bold mb-2">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="lead mb-1">{user?.email}</p>
              <p className="mb-0">Mobile: {user?.mobile}</p>
              <p className="mb-0">Member since: {user?.date_joined ? formatDate(user.date_joined) : 'N/A'}</p>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="bg-white rounded-pill px-4 py-2 d-inline-block">
                <span className="text-primary fw-bold fs-4">{userProjects.length}</span>
                <span className="text-muted ms-2">Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="bi bi-person me-2"></i>
            Profile Info
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <i className="bi bi-shield-lock me-2"></i>
            Change Password
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <i className="bi bi-folder me-2"></i>
            My Projects ({userProjects.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'delete' ? 'active' : ''}`}
            onClick={() => setActiveTab('delete')}
          >
            <i className="bi bi-trash me-2"></i>
            Delete Account
          </button>
        </li>
      </ul>

      {/* Messages */}
      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} fade-in`}>
          {message}
        </div>
      )}

      {/* Profile Info Tab */}
      {activeTab === 'profile' && (
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Personal Information</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleProfileUpdate}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      pattern="^01[0125][0-9]{8}$"
                      title="Please enter a valid Egyptian mobile number"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary-custom"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div className="row">
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Change Password</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      minLength="6"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      minLength="6"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary-custom"
                    disabled={loading}
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Projects Tab */}
      {activeTab === 'projects' && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">My Projects</h5>
                <a href="/create-project" className="btn btn-primary-custom btn-sm">
                  <i className="bi bi-plus me-1"></i>
                  New Project
                </a>
              </div>
              <div className="card-body">
                {userProjects.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-folder-x display-1 text-muted"></i>
                    <h5 className="mt-3 text-muted">No Projects Yet</h5>
                    <p className="text-muted">Start your first crowdfunding project today!</p>
                    <a href="/create-project" className="btn btn-primary-custom">
                      Create Your First Project
                    </a>
                  </div>
                ) : (
                  <div className="row">
                    {userProjects.map(project => (
                      <div key={project.id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card card-hover h-100">
                          <div className="project-image">
                            <i className="bi bi-lightbulb"></i>
                          </div>
                          <div className="card-body">
                            <h6 className="card-title">{project.title}</h6>
                            <p className="card-text small text-muted">
                              Target: EGP {parseFloat(project.total_target).toLocaleString()}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                Ends: {formatDate(project.end_time)}
                              </small>
                              <a 
                                href={`/edit-project/${project.id}`}
                                className="btn btn-outline-primary btn-sm"
                              >
                                Edit
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Tab */}
      {activeTab === 'delete' && (
        <div className="row">
          <div className="col-lg-8">
            <div className="card border-danger">
              <div className="card-header bg-danger text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Delete Account
                </h5>
              </div>
              <div className="card-body">
                <h6 className="text-danger mb-3">Permanently Delete Your Account</h6>
                <p className="text-muted mb-3">
                  Once you delete your account, there is no going back. This will permanently delete:
                </p>
                <ul className="text-muted mb-4">
                  <li>Your personal information and profile</li>
                  <li>All your projects ({userProjects.length} projects)</li>
                  <li>All project data, images, and contributions</li>
                  <li>Your account history and activity</li>
                </ul>
                
                {!showDeleteAccount ? (
                  <button 
                    onClick={() => setShowDeleteAccount(true)}
                    className="btn btn-outline-danger"
                  >
                    <i className="bi bi-trash me-2"></i>
                    Delete My Account
                  </button>
                ) : (
                  <form onSubmit={handleDeleteAccount}>
                    <div className="mb-3">
                      <label className="form-label text-danger fw-bold">
                        Enter your password to confirm account deletion
                      </label>
                      <input
                        type="password"
                        className="form-control border-danger"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter your current password"
                        required
                      />
                      <div className="form-text text-danger">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        This action cannot be undone. Please be certain.
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-danger"
                        disabled={deletingAccount}
                      >
                        {deletingAccount ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Deleting...</span>
                            </div>
                            Deleting Account...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-trash me-2"></i>
                            Permanently Delete Account
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setShowDeleteAccount(false);
                          setDeletePassword('');
                        }}
                        className="btn btn-outline-secondary"
                        disabled={deletingAccount}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
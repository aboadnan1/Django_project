// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark hero-gradient shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <span className="me-2">💰</span>
          CrowdFund
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/projects">Explore Projects</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/create-project">Start a Project</Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle d-flex align-items-center user-dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <div className="user-avatar me-2">
                    <div className="avatar-circle bg-primary text-white">
                      {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                    </div>
                  </div>
                  <div className="user-info">
                    <div className="user-name fw-semibold">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="user-email small text-light opacity-75">
                      {user.email}
                    </div>
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg dropdown-custom animate-slideDown">
                  {/* Header */}
                  <li className="dropdown-header">
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle-lg bg-primary text-white me-3">
                        {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{user.first_name} {user.last_name}</div>
                        <div className="small text-muted">{user.email}</div>
                      </div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  
                  {/* Menu Items */}
                  <li>
                    <Link className="dropdown-item dropdown-item-custom" to="/profile">
                      <i className="bi bi-person me-3 text-primary"></i>
                      <div>
                        <div className="fw-medium">My Profile</div>
                        <div className="small text-muted">Manage your account</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item dropdown-item-custom" to="/my-projects">
                      <i className="bi bi-folder me-3 text-success"></i>
                      <div>
                        <div className="fw-medium">My Projects</div>
                        <div className="small text-muted">View your projects</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item dropdown-item-custom" to="/create-project">
                      <i className="bi bi-plus-circle me-3 text-info"></i>
                      <div>
                        <div className="fw-medium">Create Project</div>
                        <div className="small text-muted">Start new campaign</div>
                      </div>
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  
                  {/* Logout */}
                  <li>
                    <button 
                      className="dropdown-item dropdown-item-custom text-danger" 
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-3"></i>
                      <div>
                        <div className="fw-medium">Logout</div>
                        <div className="small text-muted">Sign out of your account</div>
                      </div>
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary-custom ms-2" to="/register">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
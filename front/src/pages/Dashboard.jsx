// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Bring Creative Projects to Life
              </h1>
              <p className="lead mb-4">
                Join thousands of creators who've funded their dreams through our crowdfunding platform. 
                Whether you're an artist, innovator, or entrepreneur, start your journey today.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/create-project" className="btn btn-light btn-lg fw-semibold px-4">
                  Start a Project
                </Link>
                <Link to="/projects" className="btn btn-outline-light btn-lg fw-semibold px-4">
                  Explore Projects
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="display-1">🚀</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="text-primary fw-bold">500+</h3>
                  <p className="text-muted mb-0">Projects Funded</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="text-primary fw-bold">$2M+</h3>
                  <p className="text-muted mb-0">Total Raised</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="text-primary fw-bold">10K+</h3>
                  <p className="text-muted mb-0">Active Backers</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="text-primary fw-bold">95%</h3>
                  <p className="text-muted mb-0">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-5">
              <div className="card border-0 card-hover h-100">
                <div className="card-body text-center p-5">
                  <div className="text-primary mb-3" style={{fontSize: '3rem'}}>💡</div>
                  <h4 className="fw-bold mb-3">For Creators</h4>
                  <p className="text-muted mb-4">
                    Turn your ideas into reality. Raise funds, build a community, 
                    and bring your creative vision to life with the support of backers who believe in you.
                  </p>
                  <Link to="/create-project" className="btn btn-primary-custom">
                    Start Your Project
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-5">
              <div className="card border-0 card-hover h-100">
                <div className="card-body text-center p-5">
                  <div className="text-primary mb-3" style={{fontSize: '3rem'}}>🌟</div>
                  <h4 className="fw-bold mb-3">For Backers</h4>
                  <p className="text-muted mb-4">
                    Discover innovative projects and support creators you believe in. 
                    Be part of their journey and get exclusive rewards for your backing.
                  </p>
                  <Link to="/projects" className="btn btn-primary-custom">
                    Explore Projects
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      {user && (
        <section className="py-5 bg-light">
          <div className="container">
            <h3 className="text-center mb-5 fw-bold">Quick Actions</h3>
            <div className="row justify-content-center">
              <div className="col-md-4 mb-3">
                <Link to="/create-project" className="card card-hover text-decoration-none">
                  <div className="card-body text-center p-4">
                    <i className="bi bi-plus-circle display-6 text-primary mb-3"></i>
                    <h5 className="card-title">Start New Project</h5>
                    <p className="card-text text-muted">Launch your next big idea</p>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-3">
                <Link to="/my-projects" className="card card-hover text-decoration-none">
                  <div className="card-body text-center p-4">
                    <i className="bi bi-folder display-6 text-primary mb-3"></i>
                    <h5 className="card-title">My Projects</h5>
                    <p className="card-text text-muted">Manage your existing projects</p>
                  </div>
                </Link>
              </div>
              <div className="col-md-4 mb-3">
                <Link to="/profile" className="card card-hover text-decoration-none">
                  <div className="card-body text-center p-4">
                    <i className="bi bi-person display-6 text-primary mb-3"></i>
                    <h5 className="card-title">My Profile</h5>
                    <p className="card-text text-muted">Update your account settings</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
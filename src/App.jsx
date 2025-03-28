import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
import HomePage from './Pages/Homepage';
import JobFindings from './pages/JobFinding';
import ResourceFinder from './Pages/ResourceFinder';  // Import Resource Finder
import DashboardPage from './Pages/DashboardPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Health from './Pages/Health';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Persistent Navbar */}
        <Navbar />

        {/* User Profile Display for Signed-In Users */}
        <SignedIn>
          <UserProfile />
        </SignedIn>

        {/* Application Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobfindings" element={<JobFindings />} />
          <Route path="/resource-finder" element={<ResourceFinder />} /> {/* ✅ Resource Finder Route */}

          {/* Authentication Routes */}
          <Route
            path="/sign-in"
            element={
              <>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                  <SignIn routing="path" path="/sign-in" />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/sign-up"
            element={
              <>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                  <SignUp routing="path" path="/sign-up" />
                </SignedOut>
              </>
            }
          />

          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <DashboardPage />
              </SignedIn>
            }
          />

          <Route
            path="/health"
            element={
              <Health />
            }
          />

          {/* 404 Not Found Route */}
          <Route path="*" element={<div className="not-found">404 - Page Not Found</div>} />
        </Routes>

        {/* Persistent Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

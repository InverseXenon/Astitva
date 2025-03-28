import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
import HomePage from './Pages/Homepage';
import JobFindings from './pages/JobFinding';
import DashboardPage from './Pages/DashboardPage';
import HealthAnalysis from './components/HealthAnalysis';
import CommunityPage from './Pages/CommunityPage'; // Add this import
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <SignedIn>
          <UserProfile />
        </SignedIn>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobfindings" element={<JobFindings />} />
          <Route path="/health-wellness" element={<HealthAnalysis />} />
          <Route path="/community" element={<CommunityPage />} /> {/* New community route */}

          {/* Authentication Routes */}
          <Route
            path="/sign-in"
            element={
              <>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                  <SignIn
                    routing="path"
                    path="/sign-in"
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                      },
                    }}
                  />
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
                  <SignUp
                    routing="path"
                    path="/sign-up"
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                      },
                    }}
                  />
                </SignedOut>
              </>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <DashboardPage />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            }
          />

          {/* 404 Not Found Route */}
          <Route path="*" element={<div className="not-found">404 - Page Not Found</div>} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
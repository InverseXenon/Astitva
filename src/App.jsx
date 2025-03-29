import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import HomePage from "./Pages/Homepage";
import JobFindings from "./pages/JobFinding";
import DashboardPage from "./Pages/DashboardPage";
import HealthAnalysis from "./components/HealthAnalysis";
import CommunityPage from "./Pages/CommunityPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserProfile from "./components/UserProfile";
import "./App.css";
import FloatingChat from "./components/FloatingChat";
import ResourceFinderPage from "./Pages/ResourceFinderPage";

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
                    afterSignInUrl="/dashboard"
                    appearance={{
                      elements: {
                        formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
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
                    afterSignUpUrl="/dashboard"
                    appearance={{
                      elements: {
                        formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
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
                  <Navigate to="/" state={{ showLoginPrompt: true }} replace />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/jobfindings"
            element={
              <>
                <SignedIn>
                  <JobFindings />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" state={{ showLoginPrompt: true }} replace />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/health-wellness"
            element={
              <>
                <SignedIn>
                  <HealthAnalysis />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" state={{ showLoginPrompt: true }} replace />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/community"
            element={
              <>
                <SignedIn>
                  <CommunityPage />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" state={{ showLoginPrompt: true }} replace />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/resources"
            element={
              <>
                <SignedIn>
                  <ResourceFinderPage />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" state={{ showLoginPrompt: true }} replace />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/education"
            element={
              <>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" state={{ showLoginPrompt: true }} replace />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/community-support"
            element={
              <>
                <SignedIn>
                  <Navigate to="/community" replace />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" state={{ showLoginPrompt: true }} replace />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/financial-freedom"
            element={
              <>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" state={{ showLoginPrompt: true }} replace />
                </SignedOut>
              </>
            }
          />

          {/* 404 Not Found Route */}
          <Route
            path="*"
            element={<div className="not-found">404 - Page Not Found</div>}
          />
        </Routes>

        <FloatingChat />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
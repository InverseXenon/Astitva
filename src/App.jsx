import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import HomePage from "./Pages/Homepage";
import JobFindings from "./Pages/JobFinding";
import DashboardPage from "./Pages/DashboardPage";
import HealthAnalysis from "./components/HealthAnalysis";
import CommunityPage from "./Pages/CommunityPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./App.css";
import FloatingChat from "./components/FloatingChat";
import ResourceFinderPage from "./Pages/ResourceFinderPage";
import Education from './Pages/Education';
import BackendTest from './components/BackendTest';

function App() {
  return (
    <Router>
      <div className="app-container min-h-screen flex flex-col">
        <Navbar />



        <main className="flex-grow pt-20">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/education" element={<Education />} />
            <Route path="/backend-test" element={<BackendTest />} />
            
            {/* Authentication Routes */}
            <Route
              path="/sign-in"
              element={
                <>
                  <SignedIn>
                    <Navigate to="/dashboard" replace />
                  </SignedIn>
                  <SignedOut>
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
                      <div className="bg-white p-8 rounded-2xl shadow-2xl">
                        <SignIn
                          routing="path"
                          path="/sign-in"
                          afterSignInUrl="/dashboard"
                          appearance={{
                            elements: {
                              formButtonPrimary: "bg-purple-600 hover:bg-purple-700 transition-all duration-200",
                              card: "shadow-none",
                              headerTitle: "text-purple-700",
                              headerSubtitle: "text-gray-600",
                            },
                          }}
                        />
                      </div>
                    </div>
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
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
                      <div className="bg-white p-8 rounded-2xl shadow-2xl">
                        <SignUp
                          routing="path"
                          path="/sign-up"
                          afterSignUpUrl="/dashboard"
                          appearance={{
                            elements: {
                              formButtonPrimary: "bg-purple-600 hover:bg-purple-700 transition-all duration-200",
                              card: "shadow-none",
                              headerTitle: "text-purple-700",
                              headerSubtitle: "text-gray-600",
                            },
                          }}
                        />
                      </div>
                    </div>
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

            {/* Redirect legacy routes */}
            <Route path="/education-hub" element={<Navigate to="/education" replace />} />
            <Route path="/community-support" element={<Navigate to="/community" replace />} />
            <Route path="/financial-freedom" element={<Navigate to="/dashboard" replace />} />
            <Route path="/legal-support" element={<Navigate to="/community" replace />} />

            {/* 404 Not Found Route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
                    <a
                      href="/"
                      className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        <FloatingChat />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
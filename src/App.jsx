// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/Homepage';
import React from 'react';
import JobFindings from './Pages/JobFinding';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <>
    <Navbar />
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/jobfindings" element={<JobFindings />} />
        {/* <Route path="/health-wellness" element={<Health/>} /> */}

        {/* Add other routes */}
      </Routes>
    </Router>
    <Footer />
    </>
  );``
}

export default  App
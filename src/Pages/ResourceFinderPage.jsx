// src/pages/ResourceFinderPage.jsx
import React from 'react';
import ResourceFinder from '../components/ResourceFinder';
import ResourceMap from '../components/ResourceMap';

const ResourceFinderPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Modern header with subtle gradient */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-extrabold text-center text-white tracking-tight">
            Discover Essential Services
          </h1>
          <p className="mt-2 text-center text-purple-100 max-w-2xl mx-auto">
            Find the resources you need with our interactive map and smart filters
          </p>
        </div>
      </header>

      {/* Main content with elegant spacing */}
      <main className="container mx-auto px-4 py-12">
        {/* Map section with card styling */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500">
              <div className="bg-white p-1">
                <ResourceMap />
              </div>
            </div>
          </div>
        </section>

        {/* Finder section with glass morphism effect */}
        <section className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-purple-900 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Refine Your Search
          </h2>
          <ResourceFinder />
        </section>
      </main>

      {/* Sexy footer */}
      <footer className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-purple-200">© {new Date().getFullYear()} Resource Finder Pro</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="text-purple-300 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-purple-300 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-purple-300 hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResourceFinderPage;
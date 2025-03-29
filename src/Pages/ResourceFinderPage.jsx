// src/pages/ResourceFinderPage.jsx
import React from 'react';
import ResourceFinder from '../components/ResourceFinder';
import ResourceMap from '../components/ResourceMap';

const ResourceFinderPage = () => {
  return (
    <div>
      {/* Optional header or navigation bar can be added here */}
      <section className="py-10 bg-gray-200">
        <h1 className="text-3xl font-bold text-center text-purple-600">Find Essential Services</h1>
      </section>
      <section className="py-10">
        <ResourceMap />
      </section>
      <section className="py-10">
        <ResourceFinder />
      </section>
      {/* Optional footer can be added here */}
    </div>
  );
};

export default ResourceFinderPage;

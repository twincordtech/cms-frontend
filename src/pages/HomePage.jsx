import React, { useState, useEffect } from 'react';
import SectionRenderer from '../components/sections/SectionRenderer';
import Spinner from '../components/elements/Spinner';

const HomePage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cms/sections/published');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sections');
      }
      
      const data = await response.json();
      // Sort sections by their order property
      const sortedSections = data.data.sort((a, b) => a.order - b.order);
      setSections(sortedSections);
      setError(null);
    } catch (err) {
      console.error('Error fetching sections:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={fetchSections}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Website</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover our customizable content management system with dynamic section layouts
          </p>
        </div>
      </header>

      {sections.length > 0 ? (
        sections.map(section => (
          <SectionRenderer key={section._id} section={section} />
        ))
      ) : (
        <div className="container mx-auto py-12 px-4 text-center">
          <p className="text-gray-500">No content sections found</p>
        </div>
      )}

      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 
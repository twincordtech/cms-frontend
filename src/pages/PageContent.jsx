import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SectionRenderer from '../components/sections/SectionRenderer';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const PageContent = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchPageAndSections(slug);
    }
  }, [slug]);

  const fetchPageAndSections = async (pageSlug) => {
    try {
      setLoading(true);
      
      // Fetch page by slug
      const pageResponse = await fetch(`/api/cms/pages/slug/${pageSlug}`);
      
      if (!pageResponse.ok) {
        throw new Error(`Failed to fetch page with slug "${pageSlug}"`);
      }
      
      const pageData = await pageResponse.json();
      setPage(pageData.data);
      
      // Fetch sections for this page
      const sectionsResponse = await fetch(`/api/cms/sections/published/page/${pageData.data._id}`);
      
      if (!sectionsResponse.ok) {
        throw new Error('Failed to fetch sections for this page');
      }
      
      const sectionsData = await sectionsResponse.json();
      // Sort sections by their order property
      const sortedSections = sectionsData.data.sort((a, b) => a.order - b.order);
      setSections(sortedSections);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(`Failed to load page: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => fetchPageAndSections(slug)}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h2>
        <p className="text-gray-700">The page you are looking for does not exist or is not published.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
          {page.metaDescription && (
            <p className="text-xl max-w-2xl mx-auto">
              {page.metaDescription}
            </p>
          )}
        </div>
      </header>

      {sections.length > 0 ? (
        sections.map(section => (
          <SectionRenderer key={section._id} section={section} />
        ))
      ) : (
        <div className="container mx-auto py-12 px-4 text-center">
          <p className="text-gray-500">No content sections found for this page</p>
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

export default PageContent; 
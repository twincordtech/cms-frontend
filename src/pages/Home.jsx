import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cmsApi } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Banner Section Component
const BannerSection = ({ data }) => {
  return (
    <motion.section 
      className="py-12 bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold mb-4"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {data.title}
            </motion.h1>
            <motion.p 
              className="text-xl sm:text-2xl mb-6"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {data.subtitle}
            </motion.p>
            {data.ctaLink && (
              <motion.a
                href={data.ctaLink}
                className="inline-block bg-white text-primary-600 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Get Started
              </motion.a>
            )}
          </div>
          <motion.div 
            className="md:w-1/2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {data.imageURL && (
              <img 
                src={data.imageURL} 
                alt={data.title} 
                className="w-full h-auto rounded-lg shadow-lg" 
              />
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

// Content Section Component
const ContentSection = ({ data }) => {
  return (
    <motion.section 
      className="py-16 bg-white dark:bg-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`prose prose-lg dark:prose-invert max-w-none ${
          data.layoutType === 'centered' ? 'text-center mx-auto' : ''
        }`}>
          <div dangerouslySetInnerHTML={{ __html: data.htmlContent }} />
        </div>
      </div>
    </motion.section>
  );
};

// Grid Section Component
const GridSection = ({ data }) => {
  return (
    <motion.section 
      className="py-16 bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.cards && data.cards.map((card, index) => (
            <motion.div
              key={index}
              className="card p-6 hover:shadow-lg transition duration-300"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {card.icon && (
                <div className="text-primary-500 mb-4">
                  <div dangerouslySetInnerHTML={{ __html: card.icon }} />
                </div>
              )}
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// Section Renderer Component
const SectionRenderer = ({ section }) => {
  switch (section.type) {
    case 'banner':
      return <BannerSection data={section.data} />;
    case 'content':
      return <ContentSection data={section.data} />;
    case 'grid':
      return <GridSection data={section.data} />;
    default:
      return null;
  }
};

// Home Page Component
const Home = () => {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const { data } = await cmsApi.getSections();
        if (data.success) {
          setSections(data.data);
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSections();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }
  
  // Show a default welcome message if no sections are defined
  if (sections.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl font-bold text-primary-600 mb-6">Welcome to FentroCMS</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          No content has been published yet. Login as an admin to start creating content.
        </p>
        <div className="flex justify-center">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/login'}
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {sections.map((section) => (
        <SectionRenderer key={section._id} section={section} />
      ))}
    </div>
  );
};

export default Home; 
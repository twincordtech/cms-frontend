/* ========================================================================
 * File: DynamicComponents.jsx
 * Description: CMS Dynamic Components dashboard for managing, previewing, and editing reusable page components.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { Button, Tabs, message, Spin, Pagination } from 'antd';
import { EyeOutlined, DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { getComponentTypes, deleteComponent, getComponents } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import DeleteConfirmModal from '../../components/global/DeleteConfirmModal';
import ComponentBuilder from './ComponentBuilder';
import PreviewModal from '../../components/dynamic/PreviewModal';
import { getPlaceholderImage, getLoremIpsum, generateSampleValue, generateSampleDataFromFields } from '../../utils/sampleDataHelpers';
import Hero from '../../components/dynamic/components/Hero';
import Features from '../../components/dynamic/components/Features';
import About from '../../components/dynamic/components/About';
import Testimonials from '../../components/dynamic/components/Testimonials';
import CallToAction from '../../components/dynamic/components/CallToAction';
import Accordion from '../../components/dynamic/components/Accordion';
import TeamMembers from '../../components/dynamic/components/TeamMembers';
import Counter from '../../components/dynamic/components/Counter';
import NewsletterSignup from '../../components/dynamic/components/NewsletterSignup';
import LogosCarousel from '../../components/dynamic/components/LogosCarousel';
import Footer from '../../components/dynamic/components/Footer';
import CardGrid from '../../components/dynamic/components/CardGrid';
import ProductShowcase from '../../components/dynamic/components/ProductShowcase';
import Banner from '../../components/dynamic/components/Banner';

const { TabPane } = Tabs;

const componentMap = {
  hero: Hero,
  features: Features,
  about: About,
  testimonials: Testimonials,
  callToAction: CallToAction,
  accordion: Accordion,
  teamMembers: TeamMembers,
  counter: Counter,
  newsletter: NewsletterSignup,
  logosCarousel: LogosCarousel,
  footer: Footer,
  cardGrid: CardGrid,
  productShowcase: ProductShowcase,
  banner: Banner
};





// Component field structures
const componentFields = {
  hero: {
    title: "string",
    subtitle: "string",
    backgroundImage: "string (URL)",
    ctaText: "string",
    ctaLink: "string"
  },
  about: {
    heading: "string",
    description: "string",
    image: "string (URL)"
  },
  testimonials: {
    testimonials: [{
      name: "string",
      message: "string",
      image: "string (URL)",
      designation: "string"
    }]
  },
  features: {
    heading: "string",
    features: [{
      icon: "string (URL or icon name)",
      title: "string",
      description: "string"
    }]
  },
  callToAction: {
    title: "string",
    buttonText: "string",
    buttonLink: "string"
  },
  accordion: {
    items: [{
      question: "string",
      answer: "string"
    }]
  },
  teamMembers: {
    members: [{
      name: "string",
      role: "string",
      photo: "string",
      socialLinks: {
        linkedin: "string",
        twitter: "string"
      }
    }]
  },
  counter: {
    counters: [{
      label: "string",
      value: "number",
      icon: "string"
    }]
  },
  newsletter: {
    heading: "string",
    placeholder: "string",
    buttonText: "string"
  },
  logosCarousel: {
    title: "string",
    logos: [{
      image: "string",
      alt: "string"
    }]
  },
  footer: {
    columns: [{
      title: "string",
      links: [{
        label: "string",
        url: "string"
      }]
    }],
    social: {
      facebook: "string",
      twitter: "string"
    }
  },
  cardGrid: {
    cards: [{
      title: "string",
      description: "string",
      image: "string",
      link: "string"
    }]
  },
  productShowcase: {
    products: [{
      name: "string",
      image: "string",
      price: "string",
      buyLink: "string"
    }]
  }
};

// Sample data generators for each component type
const sampleDataGenerators = {
  hero: () => ({
    title: "Welcome to Our Platform",
    subtitle: getLoremIpsum(15),
    backgroundImage: getPlaceholderImage(1920, 1080, "Hero Background"),
    ctaText: "Get Started",
    ctaLink: "#",
    image: getPlaceholderImage(600, 400, "Hero Image")
  }),

  features: () => ({
    heading: "Our Features",
    subheading: "Discover what makes us special",
    features: [
      {
        icon: "🚀",
        title: "Lightning Fast",
        description: getLoremIpsum(10)
      },
      {
        icon: "🛡️",
        title: "Secure",
        description: getLoremIpsum(10)
      },
      {
        icon: "💡",
        title: "Innovative",
        description: getLoremIpsum(10)
      }
    ]
  }),

  about: () => ({
    heading: "About Us",
    description: getLoremIpsum(40),
    image: getPlaceholderImage(800, 600, "About Us"),
    stats: [
      { label: "Years Experience", value: "10+" },
      { label: "Projects Completed", value: "500+" },
      { label: "Happy Clients", value: "1000+" }
    ]
  }),

  testimonials: () => ({
    heading: "What Our Clients Say",
    testimonials: [
      {
        name: "John Smith",
        message: getLoremIpsum(20),
        image: getPlaceholderImage(100, 100, "Avatar 1"),
        designation: "CEO, Tech Corp"
      },
      {
        name: "Sarah Johnson",
        message: getLoremIpsum(20),
        image: getPlaceholderImage(100, 100, "Avatar 2"),
        designation: "CTO, Innovation Labs"
      }
    ]
  }),

  callToAction: () => ({
    title: "Ready to Get Started?",
    description: getLoremIpsum(15),
    buttonText: "Contact Us Now",
    buttonLink: "#",
    backgroundImage: getPlaceholderImage(1920, 400, "CTA Background")
  }),

  accordion: () => ({
    title: "Frequently Asked Questions",
    items: [
      {
        question: "How does it work?",
        answer: getLoremIpsum(20)
      },
      {
        question: "What are the benefits?",
        answer: getLoremIpsum(20)
      },
      {
        question: "Is there a free trial?",
        answer: getLoremIpsum(20)
      }
    ]
  }),

  teamMembers: () => ({
    heading: "Our Team",
    description: "Meet the amazing people behind our success",
    members: [
      {
        name: "Alex Thompson",
        role: "Founder & CEO",
        photo: getPlaceholderImage(300, 300, "Team 1"),
        socialLinks: {
          linkedin: "#",
          twitter: "#"
        }
      },
      {
        name: "Emma Wilson",
        role: "Lead Designer",
        photo: getPlaceholderImage(300, 300, "Team 2"),
        socialLinks: {
          linkedin: "#",
          twitter: "#"
        }
      }
    ]
  }),

  counter: () => ({
    counters: [
      {
        label: "Happy Clients",
        value: "1000+",
        icon: "👥"
      },
      {
        label: "Projects Done",
        value: "500+",
        icon: "✅"
      },
      {
        label: "Team Members",
        value: "50+",
        icon: "👨‍💼"
      }
    ]
  }),

  newsletter: () => ({
    heading: "Subscribe to Our Newsletter",
    description: "Stay updated with our latest news and updates",
    placeholder: "Enter your email",
    buttonText: "Subscribe Now",
    backgroundImage: getPlaceholderImage(1920, 300, "Newsletter Background")
  }),

  logosCarousel: () => ({
    title: "Trusted By",
    logos: [
      {
        image: getPlaceholderImage(200, 100, "Logo 1"),
        alt: "Company 1"
      },
      {
        image: getPlaceholderImage(200, 100, "Logo 2"),
        alt: "Company 2"
      },
      {
        image: getPlaceholderImage(200, 100, "Logo 3"),
        alt: "Company 3"
      }
    ]
  }),

  footer: () => ({
    columns: [
      {
        title: "Company",
        links: [
          { label: "About Us", url: "#" },
          { label: "Contact", url: "#" },
          { label: "Careers", url: "#" }
        ]
      },
      {
        title: "Resources",
        links: [
          { label: "Blog", url: "#" },
          { label: "Documentation", url: "#" },
          { label: "Support", url: "#" }
        ]
      }
    ],
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#"
    },
    copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`
  }),

  cardGrid: () => ({
    heading: "Our Services",
    cards: [
      {
        title: "Service 1",
        description: getLoremIpsum(15),
        image: getPlaceholderImage(400, 300, "Service 1"),
        link: "#"
      },
      {
        title: "Service 2",
        description: getLoremIpsum(15),
        image: getPlaceholderImage(400, 300, "Service 2"),
        link: "#"
      },
      {
        title: "Service 3",
        description: getLoremIpsum(15),
        image: getPlaceholderImage(400, 300, "Service 3"),
        link: "#"
      }
    ]
  }),

  productShowcase: () => ({
    heading: "Featured Products",
    products: [
      {
        name: "Product 1",
        description: getLoremIpsum(10),
        image: getPlaceholderImage(400, 400, "Product 1"),
        price: "$99.99",
        buyLink: "#"
      },
      {
        name: "Product 2",
        description: getLoremIpsum(10),
        image: getPlaceholderImage(400, 400, "Product 2"),
        price: "$149.99",
        buyLink: "#"
      }
    ]
  }),

  banner: () => ({
    title: "Special Announcement",
    content: getLoremIpsum(10),
    backgroundImage: getPlaceholderImage(1920, 200, "Banner"),
    ctaText: "Learn More",
    ctaLink: "#"
  })
};

/**
 * DynamicComponents Component
 * Main dashboard for managing dynamic page components.
 * Handles fetching, previewing, editing, and deleting components.
 * @component
 */
const DynamicComponents = () => {
  const [componentTypes, setComponentTypes] = useState([]);
  const [previewComponent, setPreviewComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('predefined');
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [builderComponentToEdit, setBuilderComponentToEdit] = useState(null);
  const navigate = useNavigate();
  const [predefinedPage, setPredefinedPage] = useState(1);
  const [userCreatedPage, setUserCreatedPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    fetchComponentTypes();
  }, []);

  /**
   * Fetches all available component types from the API.
   */
  const fetchComponentTypes = async () => {
    try {
      const response = await getComponentTypes();
      if (response.data.success) {
        const componentsArray = Object.entries(response.data.data).map(([name, data]) => ({
          type: name,
          name: name,
          fields: data.fields,
          isPredefined: data.isPredefined,
          description: `${name} component with ${data.fields?.length || 0} fields`
        }));
        setComponentTypes(componentsArray);
      }
    } catch (error) {
      message.error('Failed to fetch components');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles previewing a component in the modal.
   * @param {object} component
   */
  const handlePreview = (component) => {
    setPreviewComponent(component);
  };

  /**
   * Handles delete confirmation for a component.
   * @param {string} name
   */
  const handleDelete = (name) => {
    setComponentToDelete({
      type: name,
      name: name
    });
  };

  /**
   * Confirms and deletes a component from the API.
   */
  const handleConfirmDelete = async () => {
    if (componentToDelete && componentToDelete.name) {
      try {
        const response = await deleteComponent(componentToDelete.name);
        if (response.data.success) {
          message.success('Component deleted successfully');
          fetchComponentTypes();
        } else {
          throw new Error(response.data.message || 'Failed to delete component');
        }
      } catch (error) {
        message.error(error.response?.data?.message || error.message || 'Failed to delete component');
      } finally {
        setComponentToDelete(null);
      }
    }
  };

  /**
   * Handles editing a component by opening the builder modal.
   * @param {object} component
   */
  const handleEdit = async (component) => {
    try {
      const response = await getComponents();
      if (response.data.success) {
        const found = response.data.data.find(c => c.name === component.name);
        if (found) {
          setBuilderComponentToEdit(found);
          setShowBuilderModal(true);
        } else {
          message.error('Component not found');
        }
      } else {
        message.error('Failed to fetch components');
      }
    } catch (error) {
      message.error('Failed to fetch components');
    }
  };

  /**
   * Returns an emoji icon for a given component type.
   * @param {string} type
   * @param {object} config
   * @returns {string}
   */
  const getComponentIcon = (type) => {
    const icons = {
      'Hero': '🎯',
      'About': 'ℹ️',
      'Features': '⚡',
      'Testimonials': '💬',
      'Team': '👥',
      'Services': '🛠️',
      'Gallery': '🖼️',
      'CallToAction': '🎯',
      'Accordion': '📝',
      'Counter': '🔢',
      'ProductShowcase': '🛍️',
      'Newsletter': '📧',
      'Banner': '🎯',
    };
    return icons[type] || '📦';
  };

  /**
   * Returns a description for a given component type.
   * @param {string} type
   * @param {object} config
   * @returns {string}
   */
  const getComponentDescription = (type, config) => {
    return config.description || `${type} component`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (showBuilderModal) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-full mx-auto">
          <ComponentBuilder
            componentToEdit={builderComponentToEdit}
            onClose={() => {
              setShowBuilderModal(false);
              setBuilderComponentToEdit(null);
              fetchComponentTypes();
            }}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen" aria-label="Dynamic Components Dashboard">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-2">
          
          <h1 className="text-3xl font-bold text-gray-900">Page Components</h1>
          
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => {
              setBuilderComponentToEdit(null);
              setShowBuilderModal(true);
            }}
            className="hover:scale-105 transition-transform duration-200"
          >
            Create New Component
          </Button>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Predefined Components" key="predefined">
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {componentTypes.filter(component => component.isPredefined)
                  .slice((predefinedPage - 1) * PAGE_SIZE, predefinedPage * PAGE_SIZE)
                  .map((component) => (
                    <motion.div
                      key={component.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="cursor-pointer rounded-lg overflow-hidden relative flex flex-col items-center justify-center p-6 text-center group
                        bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                      onClick={() => handlePreview(component)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50">
                        <div className="flex gap-2">
                          <Button 
                            type="primary" 
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(component);
                            }}
                            className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                          >
                            View Fields
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-lg mb-4">
                        {getComponentIcon(component.type)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {component.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {component.description}
                      </p>
                      <span className="mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Predefined
                      </span>
                    </motion.div>
                  ))}
              </div>
              <div className="flex justify-center mt-6">
                <Pagination
                  current={predefinedPage}
                  pageSize={PAGE_SIZE}
                  total={componentTypes.filter(component => component.isPredefined).length}
                  onChange={setPredefinedPage}
                  showSizeChanger={false}
                />
              </div>
            </>
          </TabPane>

          <TabPane tab="User-Created Components" key="user-created">
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {componentTypes.filter(component => !component.isPredefined)
                  .slice((userCreatedPage - 1) * PAGE_SIZE, userCreatedPage * PAGE_SIZE)
                  .map((component) => (
                    <motion.div
                      key={component.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="cursor-pointer rounded-lg overflow-hidden relative flex flex-col items-center justify-center p-6 text-center group
                        bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                      onClick={() => handlePreview(component)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50">
                        <div className="flex gap-2">
                          <Button 
                            type="primary" 
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(component);
                            }}
                            className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                          >
                          
                          </Button>
                          <Button 
                            icon={<EditOutlined />}
                            onClick={async (e) => {
                              e.stopPropagation();
                              await handleEdit(component);
                            }}
                            className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                          >
                            
                          </Button>
                          <Button 
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(component.name);
                            }}
                            className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                          >
                            
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-lg mb-4">
                        {getComponentIcon(component.type)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {component.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {component.description}
                      </p>
                    </motion.div>
                  ))}
              </div>
              <div className="flex justify-center mt-6">
                <Pagination
                  current={userCreatedPage}
                  pageSize={PAGE_SIZE}
                  total={componentTypes.filter(component => !component.isPredefined).length}
                  onChange={setUserCreatedPage}
                  showSizeChanger={false}
                />
              </div>
            </>
          </TabPane>
        </Tabs>
      </div>

      <PreviewModal
        isOpen={!!previewComponent}
        onClose={() => setPreviewComponent(null)}
        component={previewComponent}
        sampleDataGenerator={sampleDataGenerators}
        generateSampleDataFromFields={generateSampleDataFromFields}
      />

      <DeleteConfirmModal
        isOpen={componentToDelete !== null}
        onClose={() => setComponentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Component"
        message={`Are you sure you want to delete the "${componentToDelete?.name}" component? This action cannot be undone.`}
      />
    </div>
  );
};

export default DynamicComponents;

/* ========================================================================
 * End of File: DynamicComponents.jsx
 * ======================================================================== */ 
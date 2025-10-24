/**
 * LayoutSelector.jsx
 * 
 * A comprehensive layout selector component for choosing pages and components.
 * Provides an intuitive interface for page selection and component configuration
 * with smooth animations, preview functionality, and existing layout integration.
 * 
 * Features:
 * - Page type selection with visual cards
 * - Component selection with preview
 * - Existing layout integration
 * - Smooth animations and transitions
 * - Responsive design
 * - Accessibility features
 * - Dark mode support
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Badge, Button, Tooltip, Input, message, Select, Tabs } from 'antd';
import { EyeOutlined, CheckOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Layers, ArrowLeft, ArrowRight } from 'lucide-react';    
import { cmsApi, getLayouts } from '../../services/api';

const { TabPane } = Tabs;

/**
 * LayoutSelector - Component for selecting pages and layout components
 * 
 * @param {Object} props - Component props
 * @param {Object} props.componentTypes - Available component types
 * @param {Array} props.selectedComponents - Currently selected components
 * @param {Function} props.onComponentSelect - Callback for component selection
 * @param {Function} props.onPreview - Callback for component preview
 * @param {Function} props.onPageSelect - Callback for page selection
 * @param {Object} props.selectedPage - Currently selected page
 * @param {Array} props.pages - Available pages
 * @param {Function} props.onLoadLayout - Callback for loading existing layout
 * @param {boolean} props.isSelectionDisabled - Whether component selection is disabled
 * @param {Object} props.existingPageLayout - Existing page layout data
 * @returns {JSX.Element} Layout selector component
 */
const LayoutSelector = ({ 
  componentTypes, 
  selectedComponents, 
  onComponentSelect, 
  onPreview, 
  onPageSelect, 
  selectedPage, 
  pages, 
  onLoadLayout,
  isSelectionDisabled,
  existingPageLayout
}) => {
  const [pageLayouts, setPageLayouts] = useState([]);
  const [loadingLayouts, setLoadingLayouts] = useState(false);
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [activeTab, setActiveTab] = useState('predefined');

  /**
   * Handle page selection
   * 
   * @param {Object} page - Selected page object
   */
  const handlePageSelect = useCallback((page) => {
    onPageSelect(page); 
  }, [onPageSelect]);

  /**
   * Handle component selection
   * 
   * @param {string} componentType - Component type to select
   */
  const handleComponentSelect = useCallback((componentType) => {
    onComponentSelect(componentType);
  }, [onComponentSelect]);

  /**
   * Handle component preview
   * 
   * @param {Event} e - Click event
   * @param {Object} component - Component to preview
   */
  const handlePreview = useCallback((e, component) => {
    e.stopPropagation();
    onPreview(component);
  }, [onPreview]);

  /**
   * Check if component is selected
   * 
   * @param {string} componentType - Component type to check
   * @returns {boolean} Whether component is selected
   */
  const isComponentSelected = useCallback((componentType) => {
    return selectedComponents.includes(componentType);
  }, [selectedComponents]);

  /**
   * Check if component is disabled
   * 
   * @param {string} type - Component type to check
   * @returns {boolean} Whether component is disabled
   */
  const isComponentDisabled = useCallback((type) => {
    return componentTypes[type]?.disabled || false;
  }, [componentTypes]);

  /**
   * Get component state styles
   * 
   * @param {string} type - Component type
   * @returns {string} CSS classes for component state
   */
  const getComponentStateStyles = useCallback((type) => {
    if (isComponentDisabled(type)) {
      return 'bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-600';
    }
    if (isComponentSelected(type)) {
      return 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800 shadow-blue-lg';
    }
    return 'bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-lg';
  }, [isComponentDisabled, isComponentSelected]);

  /**
   * Get disabled reason for component
   * 
   * @param {string} type - Component type
   * @returns {string} Reason for component being disabled
   */
  const getDisabledReason = useCallback((type) => {
    return "This component will be available soon";
  }, []);

  /**
   * Fetch layouts for selected page
   */
  useEffect(() => {
    if (selectedPage && selectedPage.isMultiPage) {
      fetchLayoutsForPage(selectedPage._id);
    } else {
      setPageLayouts([]);
    }
  }, [selectedPage]);
  
  /**
   * Fetch layouts for a specific page
   * 
   * @param {string} pageId - Page ID to fetch layouts for
   */
  const fetchLayoutsForPage = useCallback(async (pageId) => {
    setLoadingLayouts(true);
    try {
      const response = await getLayouts();
      if (response.data.success) {
        setPageLayouts(response.data.data || []);
      } else {
        message.error('Failed to fetch existing layouts for this page type.');
        setPageLayouts([]);
      }
    } catch (error) {
      console.error('Error fetching layouts for page:', error);
      if (error.response) {
        console.error('Server Response Status:', error.response.status);
        console.error('Server Response Data:', error.response.data);
        message.error(`Error fetching layouts: ${error.response.data?.message || error.response.statusText || 'Server error'} (Status: ${error.response.status})`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        message.error('Error fetching layouts: No response from server. Is it running?');
      } else {
        console.error('Error setting up request:', error.message);
        message.error(`Error fetching layouts: ${error.message}`);
      }
      setPageLayouts([]);
    } finally {
      setLoadingLayouts(false);
    }
  }, []);

  /**
   * Handle existing layout selection
   * 
   * @param {string} layoutId - Layout ID to select
   */
  const handleExistingLayoutSelect = useCallback((layoutId) => {
    if (!layoutId) return;

    const selectedFullLayout = pageLayouts.find(layout => layout._id === layoutId);
    if (selectedFullLayout) {
      const componentTypesToLoad = selectedFullLayout.components.map(c => c.type);
      onLoadLayout(selectedFullLayout.name, componentTypesToLoad);
    }
  }, [pageLayouts, onLoadLayout]);

  /**
   * Memoized filtered component types for predefined components
   */
  const predefinedComponents = useMemo(() => 
    Object.entries(componentTypes).filter(([type, config]) => config.isPredefined),
    [componentTypes]
  );

  /**
   * Memoized filtered component types for user-created components
   */
  const userCreatedComponents = useMemo(() => 
    Object.entries(componentTypes).filter(([type, config]) => !config.isPredefined),
    [componentTypes]
  );

  /**
   * Render component card
   * 
   * @param {Array} components - Array of component entries
   * @returns {JSX.Element} Component cards
   */
  const renderComponentCards = useCallback((components) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {components.map(([type, config]) => (
        <motion.div
          key={type}
          onClick={() => !isComponentDisabled(type) && handleComponentSelect(type)}
          onMouseEnter={() => setHoveredComponent(type)}
          onMouseLeave={() => setHoveredComponent(null)}
          className={`relative rounded-xl overflow-hidden transition-all duration-300
            ${getComponentStateStyles(type)}
            ${isComponentDisabled(type) ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${hoveredComponent === type && !isComponentDisabled(type) ? 'transform -translate-y-1' : ''}`}
          whileHover={!isComponentDisabled(type) ? { scale: 1.02 } : {}}
        >
          <div className="p-5">
            {isComponentSelected(type) && (
              <div className="absolute top-3 right-3 flex items-center">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full">
                  Selected {selectedComponents.indexOf(type) + 1}
                </span>
              </div>
            )}

            <div className="mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                ${isComponentSelected(type) 
                  ? 'bg-blue-500 text-white'
                  : isComponentDisabled(type)
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'}`}
              >
                <Layers size={24} />
              </div>
            </div>

            <div className={isComponentDisabled(type) ? 'opacity-60' : ''}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{type}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {getComponentDescription(type)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {getComponentFeatures(type).map((feature, index) => (
                <span 
                  key={index}
                  className={`text-xs px-2 py-0.5 rounded-full
                    ${isComponentSelected(type)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                >
                  {feature}
                </span>
              ))}
            </div>

            {hoveredComponent === type && !isComponentDisabled(type) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-b from-white/80 dark:from-gray-800/80 via-white/90 dark:via-gray-800/90 to-white dark:to-gray-800 flex items-center justify-center"
              >
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={(e) => handlePreview(e, { type, config })}
                  className="bg-blue-500 hover:bg-blue-600 border-none shadow-lg"
                >
                  Preview Component
                </Button>
              </motion.div>
            )}

            {isComponentDisabled(type) && (
              <Tooltip title={getDisabledReason(type)} placement="top">
                <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center px-4">
                    <span className="inline-block mb-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
                      Coming Soon
                    </span>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {getDisabledReason(type)}
                    </p>
                  </div>
                </div>
              </Tooltip>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  ), [
    componentTypes,
    isComponentDisabled,
    handleComponentSelect,
    hoveredComponent,
    getComponentStateStyles,
    isComponentSelected,
    selectedComponents,
    handlePreview,
    getComponentDescription,
    getComponentFeatures,
    getDisabledReason
  ]);

  return (
    <AnimatePresence mode="wait">
      {!selectedPage ? (
        <motion.div
          key="pages"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="p-6"
        >
          <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Choose Your Page Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <motion.div
                key={page._id}
                onClick={() => handlePageSelect(page)}
                className={`cursor-pointer rounded-2xl overflow-hidden relative group
                  ${selectedPage?._id === page._id 
                    ? 'ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' 
                    : 'hover:shadow-xl'}`}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`p-6 h-full bg-gradient-to-br ${getPageGradient(page.title)}`}>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${page.isMultiPage 
                        ? 'bg-white/90 text-emerald-600' 
                        : 'bg-white/90 text-purple-600'}`}>
                      {page.isMultiPage ? 'Dynamic' : 'Static'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col h-full text-white">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <FileText size={24} className="text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{page.title}</h3>
                    <p className="text-white/80 text-sm flex-grow">
                      {page.description || 'Create and manage your content with this page type'}
                    </p>
                    
                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-white/90 font-medium">Select this template</span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 
                        group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="components"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="px-6 py-4 bg-gray-50 dark:bg-gray-900"
        >
          <div className="flex items-center mb-8">
            <Button 
              onClick={() => onPageSelect(null)}
              type="text"
              icon={<ArrowLeft className="w-5 h-5" />}
              className="mr-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Select Components</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Customizing <span className="font-semibold">{selectedPage.title}</span>
                {selectedPage.isMultiPage && 
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    Dynamic Page
                  </span>
                }
              </p>
            </div>
          </div>

          {/* Existing Layout Selector */}
          {selectedPage && selectedPage.isMultiPage && (
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Load Existing Layout
              </label>
              <Select
                showSearch
                allowClear
                placeholder="Choose a pre-configured layout..."
                loading={loadingLayouts}
                onChange={handleExistingLayoutSelect}
                optionFilterProp="children"
                filterOption={(input, option) => 
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                style={{ width: '100%' }}
                className="rounded-lg"
                options={pageLayouts.map(layout => ({
                  value: layout._id,
                  label: layout.name,
                }))}
              />
              {pageLayouts.length === 0 && !loadingLayouts && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">No existing layouts available yet.</p>
              )}
            </div>
          )}

          {/* Component Tabs */}
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Predefined Components" key="predefined">
              {renderComponentCards(predefinedComponents)}
            </TabPane>

            <TabPane tab="User-Created Components" key="user-created">
              {renderComponentCards(userCreatedComponents)}
            </TabPane>
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Get page gradient based on page type
 * 
 * @param {string} pageType - Page type
 * @returns {string} CSS gradient classes
 */
const getPageGradient = (pageType) => {
  const gradients = {
    'Home': 'from-blue-500 to-indigo-600',
    'About': 'from-emerald-500 to-teal-600',
    'Services': 'from-purple-500 to-indigo-600',
    'Contact': 'from-orange-500 to-pink-600',
    'Blog': 'from-pink-500 to-rose-600',
    'Products': 'from-cyan-500 to-blue-600',
    'default': 'from-gray-700 to-gray-900'
  };
  return gradients[pageType] || gradients.default;
};

/**
 * Get component description
 * 
 * @param {string} type - Component type
 * @returns {string} Component description
 */
const getComponentDescription = (type) => {
  const descriptions = {
    'Hero': 'Engaging hero section with image and CTA',
    'About': 'Share your story and mission',
    'Features': 'Highlight key features or services',
    'Testimonials': 'Display customer reviews and feedback',
    'Team': 'Showcase your team members',
    'Services': 'List your services with details',
    'Gallery': 'Display images in a grid layout',
    'CallToAction': 'Add compelling call-to-action section',
    'Accordion': 'Create expandable FAQ sections',
    'Counter': 'Show animated statistics',
    'ProductShowcase': 'Display products in a grid',
    'Newsletter': 'Add email newsletter signup',
    'Banner': 'Eye-catching banner with custom content',
  };
  return descriptions[type] || 'Component description';
};

/**
 * Get component features
 * 
 * @param {string} type - Component type
 * @returns {Array} Array of component features
 */
const getComponentFeatures = (type) => {
  const features = {
    'Hero': ['Customizable', 'Responsive'],
    'About': ['Rich Text', 'Media'],
    'Features': ['Grid', 'Icons'],
    'Testimonials': ['Slider', 'Rating'],
    'Team': ['Grid', 'Social'],
    'Services': ['Cards', 'Icons'],
    'Gallery': ['Lightbox', 'Grid'],
    'CallToAction': ['Button', 'BG'],
    'Accordion': ['Nested', 'Animated'],
    'Counter': ['Stats', 'Animated'],
    'ProductShowcase': ['Grid', 'Quick View'],
    'Newsletter': ['Form', 'API'],
    'Banner': ['Full Width', 'BG'],
    'Tabs': ['Customizable', 'Nested']
  };
  return features[type] || ['Customizable'];
};

export default LayoutSelector;

/**
 * @copyright Tech4biz Solutions Private
 */ 
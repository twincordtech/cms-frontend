// ===============================
// File: ComponentSidebar.jsx
// Description: Sidebar for listing and adding draggable dynamic components to the canvas.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { 
  FaLayerGroup, 
  FaImage, 
  FaInfoCircle, 
  FaGripVertical, 
  FaQuoteLeft, 
  FaArrowRight, 
  FaQuestionCircle, 
  FaUsers, 
  FaChartBar, 
  FaEnvelope, 
  FaImages, 
  FaShoePrints, 
  FaThLarge, 
  FaShoppingCart 
} from 'react-icons/fa';

// Mapping of component types to icons
const componentIcons = {
  Hero: FaImage,
  About: FaInfoCircle,
  Features: FaLayerGroup,
  Testimonials: FaQuoteLeft,
  CallToAction: FaArrowRight,
  Accordion: FaQuestionCircle,
  TeamMembers: FaUsers,
  Counter: FaChartBar,
  NewsletterSignup: FaEnvelope,
  LogosCarousel: FaImages,
  Footer: FaShoePrints,
  CardGrid: FaThLarge,
  ProductShowcase: FaShoppingCart
};

/**
 * DraggableComponent renders a draggable UI for a single component type.
 */
const DraggableComponent = ({ type }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `new-${type}`,
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  } : undefined;

  const Icon = componentIcons[type] || FaLayerGroup;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
    >
      <div className="flex items-center p-4">
        <div className="mr-3 p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
          <Icon className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{type}</h3>
          <p className="text-sm text-gray-500 mt-0.5">Drag or click to add</p>
        </div>
        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <FaGripVertical className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

/**
 * ComponentSidebar lists all available components and allows adding them to the canvas via drag or click.
 */
const ComponentSidebar = ({ components, onAddComponent }) => {
  return (
    <div className="w-80 bg-white border-r border-gray-100 p-6 overflow-y-auto">
      <div className="sticky top-0 bg-white pb-4 mb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Components</h2>
        <p className="text-sm text-gray-600 mt-1">
          Drag components to the canvas or click to add them instantly
        </p>
      </div>
      <div className="space-y-3">
        {Object.entries(components).map(([type]) => (
          <div key={type} className="relative group">
            <DraggableComponent type={type} />
            <button
              onClick={() => onAddComponent(type)}
              className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50/50 rounded-xl flex items-center justify-center"
            >
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                Click to add
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

ComponentSidebar.propTypes = {
  components: PropTypes.object.isRequired,
  onAddComponent: PropTypes.func.isRequired
};

DraggableComponent.propTypes = {
  type: PropTypes.string.isRequired
};

export default ComponentSidebar;
// ===============================
// End of File: ComponentSidebar.jsx
// Description: Sidebar for dynamic components
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 
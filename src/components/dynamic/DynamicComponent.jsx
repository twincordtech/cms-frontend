// ===============================
// File: DynamicComponent.jsx
// Description: Dynamically renders a mapped component type with provided data and edit controls.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import Banner from './components/Banner';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Team from './components/Team';
import Services from './components/Services';
import Gallery from './components/Gallery';

// Map of component types to their React components
const COMPONENT_MAP = {
  Banner,
  About,
  Testimonials,
  Team,
  Services,
  Gallery
};

/**
 * DynamicComponent renders a component based on the provided type and data.
 * Optionally shows edit controls if isEditing is true.
 */
const DynamicComponent = ({ type, data, isEditing, onEdit }) => {
  const Component = COMPONENT_MAP[type];

  if (!Component) {
    console.warn(`Component type "${type}" not found`);
    return null;
  }

  return (
    <div className="relative">
      {/* Edit button overlay if editing is enabled */}
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <button
            onClick={() => onEdit(data)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        </div>
      )}
      <Component {...data} />
    </div>
  );
};

DynamicComponent.propTypes = {
  type: PropTypes.oneOf(Object.keys(COMPONENT_MAP)).isRequired,
  data: PropTypes.object.isRequired,
  isEditing: PropTypes.bool,
  onEdit: PropTypes.func
};

DynamicComponent.defaultProps = {
  isEditing: false,
  onEdit: () => {}
};

export default DynamicComponent;
// ===============================
// End of File: DynamicComponent.jsx
// Description: Dynamic component renderer
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 
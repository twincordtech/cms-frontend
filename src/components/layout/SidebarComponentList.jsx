/* ========================================================================
 * File: SidebarComponentList.jsx
 * Description: Sidebar navigation for selecting layout components in the editor.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * SidebarComponentList Component
 * Sidebar navigation for selecting layout components in the editor.
 * @param {object} props
 * @param {Array} props.components - List of components to display
 * @param {string} props.selectedComponentId - Currently selected component ID
 * @param {function} props.onSelectComponent - Handler for selecting a component
 */
const SidebarComponentList = ({ components, selectedComponentId, onSelectComponent }) => {
  return (
    <aside className="w-64 min-h-0 flex flex-col bg-gradient-to-b from-blue-100/70 via-white to-white border-r border-blue-100 shadow-xl" aria-label="Sidebar Component List">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b px-6 py-4">
        <h2 className="text-lg font-bold text-blue-900 tracking-wide">Components</h2>
      </div>
      <ul className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
        {components.map((comp) => (
          <li key={comp.key || comp._id}>
            <button
              className={`w-full text-left px-5 py-3 rounded-2xl font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
                ${selectedComponentId === comp._id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-xl ring-2 ring-blue-300 scale-[1.03]'
                  : 'bg-white text-blue-900 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700'}
              `}
              style={{ margin: selectedComponentId === comp._id ? '8px 0' : '0' }}
              onClick={() => onSelectComponent(comp)}
              aria-current={selectedComponentId === comp._id ? 'true' : undefined}
              aria-label={`Select component ${comp.name}`}
            >
              <span className="truncate block w-full">{comp.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="py-6" /> {/* Extra bottom spacing */}
    </aside>
  );
};

SidebarComponentList.propTypes = {
  components: PropTypes.array.isRequired,
  selectedComponentId: PropTypes.string,
  onSelectComponent: PropTypes.func.isRequired
};

export default SidebarComponentList;

/* ========================================================================
 * End of File: SidebarComponentList.jsx
 * ======================================================================== */ 
/**
 * SectionLayoutSelect.jsx
 *
 * Layout selection component for section configuration. Allows users to select a layout type for a section.
 * Handles accessibility, keyboard navigation, and clear user feedback.
 *
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React from 'react';
import Card from '../elements/Card';

/**
 * LayoutOption Component
 *
 * Renders a selectable layout option card.
 * @component
 * @param {Object} props
 * @param {string} props.title - Layout title
 * @param {string} props.description - Layout description
 * @param {boolean} props.selected - Is this option selected
 * @param {function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Layout visual
 * @returns {JSX.Element}
 */
const LayoutOption = ({ title, description, selected, onClick, children }) => (
  <Card 
    title={title}
    description={description}
    className={`mb-4 ${selected ? 'border-blue-500 border-2' : ''} cursor-pointer`}
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-pressed={selected}
    aria-label={title}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick();
      }
    }}
  >
    <div className="h-24 flex justify-center items-center border rounded bg-gray-50">
      {children}
    </div>
  </Card>
);

/**
 * SectionLayoutSelect Component
 *
 * Allows users to select a section layout type. Renders layout options with accessibility and keyboard support.
 *
 * @component
 * @param {Object} props
 * @param {string} props.selectedLayout - Currently selected layout type
 * @param {function} props.onSelectLayout - Callback for layout selection
 * @returns {JSX.Element}
 */
const SectionLayoutSelect = ({ selectedLayout, onSelectLayout }) => {
  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-6">Select Section Layout</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <LayoutOption 
          title="Two Column Layout" 
          description="Two equal width columns for content"
          selected={selectedLayout === 'two-column'}
          onClick={() => onSelectLayout('two-column')}
        >
          <div className="flex w-full h-full">
            <div className="w-1/2 h-full border-r"></div>
            <div className="w-1/2 h-full"></div>
          </div>
        </LayoutOption>
        <LayoutOption 
          title="Three Column Layout" 
          description="Three equal width columns for content"
          selected={selectedLayout === 'three-column'}
          onClick={() => onSelectLayout('three-column')}
        >
          <div className="flex w-full h-full">
            <div className="w-1/3 h-full border-r"></div>
            <div className="w-1/3 h-full border-r"></div>
            <div className="w-1/3 h-full"></div>
          </div>
        </LayoutOption>
        <LayoutOption 
          title="Four Column Layout" 
          description="Four equal width columns for content"
          selected={selectedLayout === 'four-column'}
          onClick={() => onSelectLayout('four-column')}
        >
          <div className="flex w-full h-full">
            <div className="w-1/4 h-full border-r"></div>
            <div className="w-1/4 h-full border-r"></div>
            <div className="w-1/4 h-full border-r"></div>
            <div className="w-1/4 h-full"></div>
          </div>
        </LayoutOption>
      </div>
    </div>
  );
};

export default SectionLayoutSelect;

/**
 * @copyright Tech4biz Solutions Private
 */ 
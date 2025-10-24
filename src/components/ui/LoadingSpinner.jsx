/**
 * LoadingSpinner.jsx
 *
 * Animated loading spinner for indicating loading states. Supports multiple sizes and accessibility.
 *
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import { motion } from 'framer-motion';

const sizes = {
  small: 'w-4 h-4 border-2',
  medium: 'w-8 h-8 border-3',
  large: 'w-12 h-12 border-4'
};

/**
 * LoadingSpinner Component
 *
 * Displays an animated spinner for loading states. Supports size and custom className.
 * Ensures accessibility with role and aria-label.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.size] - Spinner size ('small', 'medium', 'large')
 * @param {string} [props.className] - Additional class names
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = sizes[size] || sizes.medium;
  return (
    <motion.div
      className={`${sizeClasses} ${className} rounded-full border-primary-500 border-t-transparent animate-spin`}
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 1, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      role="status"
      aria-label="Loading"
    />
  );
};

export default LoadingSpinner;

/**
 * @copyright Tech4biz Solutions Private
 */ 
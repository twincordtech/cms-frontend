// ===============================
// File: Counter.jsx
// Description: Animated counter grid for displaying statistics with icons and labels.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

/**
 * Counter component displays a grid of animated counters with icons and labels.
 * Used for statistics, achievements, or key metrics.
 */
const Counter = ({ counters }) => {
  // useInView triggers animation when component is in viewport
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  if (!counters || counters.length === 0) return null;

  return (
    <div className="py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4" ref={ref}>
          {counters.map((counter, index) => (
            <div key={index} className="text-center">
              {/* Icon for each counter */}
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white text-blue-600 mx-auto mb-4">
                {counter.icon}
              </div>
              {/* Animated counter value */}
              <div className="text-4xl font-bold text-white mb-2">
                {inView && <CountUp end={counter.value} duration={2.5} />}
                {counter.suffix}
              </div>
              {/* Counter label */}
              <p className="text-lg text-blue-100">{counter.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Counter.propTypes = {
  counters: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      suffix: PropTypes.string
    })
  ).isRequired
};

export default Counter;
// ===============================
// End of File: Counter.jsx
// Description: Animated counter grid
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================

// ===============================
// File: ProductShowcase.jsx
// Description: Product showcase grid for displaying products with images, prices, and features.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { FaShoppingCart } from 'react-icons/fa';

/**
 * ProductShowcase component displays a grid of products, each with image, name, description, price, and features.
 * Used for e-commerce or product listing sections.
 */
const ProductShowcase = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <div key={index} className="group relative">
              <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity duration-200"
                />
                {/* Optional product badge */}
                {product.badge && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {product.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-900">
                    {typeof product.price === 'number'
                      ? `$${product.price.toFixed(2)}`
                      : product.price}
                  </p>
                  {/* Optional action button */}
                  {product.actionUrl && (
                    <a
                      href={product.actionUrl}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      <FaShoppingCart className="mr-2 h-4 w-4" />
                      {product.actionText || 'Buy Now'}
                    </a>
                  )}
                </div>
                {/* Optional product features list */}
                {product.features && product.features.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ProductShowcase.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      image: PropTypes.string.isRequired,
      badge: PropTypes.string,
      features: PropTypes.arrayOf(PropTypes.string),
      actionUrl: PropTypes.string,
      actionText: PropTypes.string
    })
  ).isRequired
};

export default ProductShowcase;
// ===============================
// End of File: ProductShowcase.jsx
// Description: Product showcase grid
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 
/* ========================================================================
 * File: ApiPlayground.jsx
 * Description: Interactive dashboard tool for testing and documenting API endpoints.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState } from 'react';
import { FaPlay, FaCopy, FaBook, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Card from '../../components/elements/Card';
import api from '../../services/api';

/**
 * Recursively transforms a value for display, handling arrays and objects.
 * @param {*} value - The value to transform.
 * @returns {*} The transformed value.
 */
const transformValue = (value) => {
  if (!value) return '';
  // Handle array of objects
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'object') {
        const transformedItem = {};
        Object.entries(item).forEach(([key, val]) => {
          transformedItem[key] = transformValue(val);
        });
        return transformedItem;
      }
      return item;
    });
  }
  // Handle object with value property
  if (typeof value === 'object') {
    if (value.value !== undefined) {
      if (Array.isArray(value.value)) {
        return value.value.map(item => transformValue(item));
      }
      return value.value;
    }
    // Handle nested objects
    const transformedObj = {};
    Object.entries(value).forEach(([key, val]) => {
      transformedObj[key] = transformValue(val);
    });
    return transformedObj;
  }
  return value;
};

/**
 * Transforms API response data for better readability in the playground.
 * @param {object} data - The API response data.
 * @returns {object} The transformed response data.
 */
const transformResponse = (data) => {
  if (!data || !data.data) return data;
  // Transform layouts data
  if (data.data.layouts && Array.isArray(data.data.layouts)) {
    return {
      ...data,
      data: {
        ...data.data,
        layouts: data.data.layouts.map(layout => ({
          _id: layout._id,
          name: layout.name,
          isActive: layout.isActive,
          components: Object.entries(layout.components || {}).reduce((acc, [name, component]) => {
            const transformedData = {};
            Object.entries(component.data || {}).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                transformedData[key] = value.map(item => {
                  if (typeof item === 'object') {
                    const transformedItem = {};
                    Object.entries(item).forEach(([itemKey, itemValue]) => {
                      transformedItem[itemKey] = transformValue(itemValue);
                    });
                    return transformedItem;
                  }
                  return transformValue(item);
                });
              } else {
                transformedData[key] = transformValue(value);
              }
            });
            const componentName = name;
            acc[componentName] = {
              _id: component._id,
              type: component.type,
              name: component.name,
              order: component.order,
              data: transformedData
            };
            return acc;
          }, Object.create(null))
        }))
      }
    };
  }
  // Transform single layout data
  if (data.data.layout) {
    return {
      ...data,
      data: {
        ...data.data,
        layout: {
          _id: data.data.layout._id,
          name: data.data.layout.name,
          isActive: data.data.layout.isActive,
          components: Object.entries(data.data.layout.components || {}).reduce((acc, [name, component]) => {
            const transformedData = {};
            Object.entries(component.data || {}).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                transformedData[key] = value.map(item => {
                  if (typeof item === 'object') {
                    const transformedItem = {};
                    Object.entries(item).forEach(([itemKey, itemValue]) => {
                      transformedItem[itemKey] = transformValue(itemValue);
                    });
                    return transformedItem;
                  }
                  return transformValue(item);
                });
              } else {
                transformedData[key] = transformValue(value);
              }
            });
            const componentName = name;
            acc[componentName] = {
              _id: component._id,
              type: component.type,
              name: component.name,
              order: component.order,
              data: transformedData
            };
            return acc;
          }, Object.create(null))
        }
      }
    };
  }
  return data;
};

/**
 * JsonViewer
 * Displays JSON data in a formatted, scrollable code block.
 * @component
 * @param {object} props
 * @param {object} props.data - The JSON data to display.
 * @returns {JSX.Element}
 */
const JsonViewer = ({ data }) => {
  return (
    <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm" aria-label="JSON Viewer">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

/**
 * ApiDocumentation
 * Renders documentation for available API endpoints.
 * @component
 * @returns {JSX.Element}
 */
const ApiDocumentation = () => {
  const endpoints = [
    {
      path: '/pages/:slug/content',
      method: 'GET',
      description: 'Get page content with all associated layouts',
      request: {
        params: {
          slug: 'string (required) - The page slug'
        }
      },
      response: {
        success: 'boolean',
        statusCode: 'number',
        data: {
          page: {
            title: 'string',
            slug: 'string',
            createdAt: 'string (ISO date)',
            updatedAt: 'string (ISO date)'
          },
          layouts: [
            {
              _id: 'string',
              name: 'string',
              isActive: 'boolean',
              components: [
                {
                  _id: 'string',
                  type: 'string',
                  name: 'string',
                  order: 'number',
                  data: {
                    // Component specific data fields
                    title: 'string',
                    subtitle: 'string',
                    // ... other component fields
                  }
                }
              ]
            }
          ]
        }
      },
      example: {
        request: 'GET /pages/home/content',
        response: {
          success: true,
          statusCode: 6000,
          data: {
            page: {
              title: 'Home',
              slug: 'home',
              createdAt: '2025-04-17T06:52:57.597Z',
              updatedAt: '2025-04-17T06:52:57.597Z'
            },
            layouts: [
              {
                _id: '6800a5592fdc1022ef018874',
                name: 'Main Layout',
                isActive: true,
                components: [
                  {
                    _id: '6800a5592fdc1022ef018875',
                    type: 'Banner',
                    name: 'Banner Component',
                    order: 0,
                    data: {
                      title: 'Welcome to Our Website',
                      subtitle: 'We provide the best services',
                      backgroundImage: '',
                      ctaText: 'Learn More',
                      ctaLink: '/about',
                      style: 'centered',
                      overlayOpacity: 0.5
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    }
  ];

  return (
    <div className="space-y-6" aria-label="API Documentation">
      {endpoints.map((endpoint, index) => (
        <Card key={index} className="mb-4">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                  endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {endpoint.method}
                </span>
                <span className="font-mono text-sm">{endpoint.path}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{endpoint.description}</p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Request Parameters</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <pre className="text-sm">
                    {JSON.stringify(endpoint.request, null, 2)}
                  </pre>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Response Format</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <pre className="text-sm">
                    {JSON.stringify(endpoint.response, null, 2)}
                  </pre>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Example</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Request:</span>
                    <pre className="bg-gray-50 p-2 rounded text-sm mt-1">
                      {endpoint.example.request}
                    </pre>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Response:</span>
                    <pre className="bg-gray-50 p-2 rounded text-sm mt-1">
                      {JSON.stringify(endpoint.example.response, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

/**
 * ApiPlayground
 * Interactive tool for testing API endpoints and viewing documentation.
 * @component
 * @returns {JSX.Element}
 */
const ApiPlayground = () => {
  const [endpoint, setEndpoint] = useState('');
  const [response, setResponse] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showRawResponse, setShowRawResponse] = useState(false);

  /**
   * Handles changes to the endpoint input field.
   * Strips base URL and normalizes the endpoint path.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleEndpointChange = (e) => {
    let value = e.target.value;
    const baseUrl = 'https://cms-backend-7fb2.onrender.com/api';
    if (value.startsWith(baseUrl)) {
      value = value.substring(baseUrl.length);
    }
    if (value.startsWith('/api')) {
      value = value.substring(4);
    }
    if (!value.startsWith('/') && value.length > 0) {
      value = '/' + value;
    }
    setEndpoint(value);
  };

  /**
   * Makes a GET request to the specified endpoint and handles the response.
   * Handles errors and transforms the response for display.
   */
  const handleTest = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoint);
      setRawResponse(response.data);
      const transformedData = transformResponse(response.data);
      setResponse(transformedData);
    } catch (error) {
      // Log error for debugging, but do not expose sensitive info to user
      // eslint-disable-next-line no-console
      console.error('API Test Error:', error);
      setError(error.response?.data?.message || error.message);
      setResponse(error.response?.data);
      setRawResponse(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copies the current response (raw or transformed) to the clipboard.
   * Shows a toast notification on success.
   */
  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(showRawResponse ? rawResponse : response, null, 2));
      toast.success('Response copied to clipboard');
    }
  };

  return (
    <div className="container mx-auto max-w-full px-4 py-8" aria-label="API Playground">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">API Playground</h1>
      </div>
      <Card className="mb-6">
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="api-endpoint-input">
              API Endpoint
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 bg-gray-50 px-3 py-2 border border-r-0 rounded-l-md">
                https://cms-backend-7fb2.onrender.com/api
              </span>
              <input
                id="api-endpoint-input"
                type="text"
                value={endpoint}
                onChange={handleEndpointChange}
                placeholder="/pages/home/content"
                className="flex-1 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="API Endpoint Input"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleTest}
              disabled={!endpoint || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
              aria-label="Test Endpoint"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true"></div>
                  Testing...
                </>
              ) : (
                <>
                  <FaPlay className="mr-2" />
                  Test Endpoint
                </>
              )}
            </button>
          </div>
        </div>
      </Card>
      {error && !response && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          {error}
        </div>
      )}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">
                {showDocs ? (
                  <div className="flex items-center space-x-2 mb-4">
                    <FaBook className="text-blue-600" aria-hidden="true" />
                    <span className="text-xl font-bold">API Documentation</span>
                  </div>
                ) : 'Response'}
              </h2>
              <div className="flex items-center space-x-2">
                {!showDocs && response && (
                  <>
                    <button
                      onClick={() => setShowRawResponse(false)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        !showRawResponse
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      aria-label="Show Transformed Response"
                    >
                      Transformed
                    </button>
                    <button
                      onClick={() => setShowRawResponse(true)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        showRawResponse
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      aria-label="Show Raw Response"
                    >
                      Raw
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {response && !showDocs && (
                <button
                  onClick={copyResponse}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                  aria-label="Copy Response"
                >
                  <FaCopy className="mr-2" aria-hidden="true" />
                  Copy
                </button>
              )}
              <button
                onClick={() => setShowDocs(!showDocs)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                aria-label={showDocs ? 'Show Response' : 'Show Docs'}
              >
                {showDocs ? (
                  <>
                    <FaPlay className="mr-1" aria-hidden="true" />
                    Show Response
                  </>
                ) : (
                  <>
                    <FaBook className="mr-1" aria-hidden="true" />
                    Show Docs
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="mt-4">
            {showDocs ? (
              <ApiDocumentation />
            ) : response ? (
              <JsonViewer data={showRawResponse ? rawResponse : response} />
            ) : (
              <div className="text-center text-gray-500 py-8" aria-label="No Response">
                Make an API request to see the response here
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApiPlayground;

/* ========================================================================
 * End of file: ApiPlayground.jsx
 * ======================================================================== */ 
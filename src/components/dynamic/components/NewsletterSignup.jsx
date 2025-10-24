// ===============================
// File: NewsletterSignup.jsx
// Description: Newsletter signup form component for collecting user emails.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaPaperPlane } from 'react-icons/fa';

/**
 * NewsletterSignup component displays a form for users to subscribe to a newsletter.
 * Handles form submission, feedback, and status messages.
 */
const NewsletterSignup = ({ heading, placeholder, buttonText }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  // Handle form submission for newsletter signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {heading || 'Subscribe to our newsletter'}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Stay up to date with the latest news and updates.
          </p>
        </div>
        <div className="mt-8 max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="sm:flex">
            <div className="min-w-0 flex-1">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={placeholder || "Enter your email"}
              />
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="block w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  'Subscribing...'
                ) : (
                  <>
                    {buttonText || 'Subscribe'} <FaPaperPlane className="inline-block ml-2 -mr-1 w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
          {/* Status message for user feedback */}
          {message && (
            <p className={`mt-3 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

NewsletterSignup.propTypes = {
  heading: PropTypes.string,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string
};

export default NewsletterSignup;
// ===============================
// End of File: NewsletterSignup.jsx
// Description: Newsletter signup form
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================

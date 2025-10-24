// ===============================
// File: NewsletterSubscribe.jsx
// Description: Newsletter subscription form with accessibility, error handling, and user feedback.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { newsletterApi } from '../services/api';
import { FaPaperPlane } from 'react-icons/fa';

/**
 * NewsletterSubscribe provides a form for users to subscribe to the newsletter.
 * Includes accessibility, error handling, and user feedback.
 * @component
 */
const NewsletterSubscribe = () => {
  // State for email input and loading
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle form submission for newsletter subscription
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await newsletterApi.subscribe(email);
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100" aria-label="Newsletter Subscription">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900" id="newsletter-title">Subscribe to Our Newsletter</h3>
        <p className="text-gray-600 mt-2">Stay updated with our latest news and updates</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="newsletter-title">
        <div>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              aria-label="Email address"
              autoComplete="email"
              disabled={loading}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Subscribe to newsletter"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-label="Loading"></div>
          ) : (
            <>
              <FaPaperPlane className="mr-2" aria-hidden="true" />
              Subscribe
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default NewsletterSubscribe;
// ===============================
// End of File: NewsletterSubscribe.jsx
// Description: Newsletter subscription form with accessibility and error handling
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 
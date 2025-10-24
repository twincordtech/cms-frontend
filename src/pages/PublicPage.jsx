import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { cmsApi } from '../services/api';
import { toast } from 'react-toastify';

const PublicPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const isBlog = location.pathname.startsWith('/blog/');
        const response = isBlog 
          ? await cmsApi.getBlogBySlug(slug)
          : await cmsApi.getPageBySlug(slug);
        
        setContent(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('Content not found');
        toast.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug, location.pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  const isBlog = location.pathname.startsWith('/blog/');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{content.title}</h1>
          {isBlog ? (
            <div className="flex flex-col space-y-2">
              {content.author && (
                <div className="text-gray-600">
                  By {content.author.name}
                  {content.author.role && <span className="text-gray-500"> • {content.author.role}</span>}
                </div>
              )}
              <div className="text-gray-500">
                {new Date(content.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {content.excerpt && (
                <p className="text-lg text-gray-600 mt-4">{content.excerpt}</p>
              )}
              {content.featuredImage && (
                <div className="mt-6">
                  <img
                    src={content.featuredImage.url}
                    alt={content.featuredImage.alt || content.title}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  {content.featuredImage.caption && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      {content.featuredImage.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            content.description && (
              <p className="text-lg text-gray-600">{content.description}</p>
            )
          )}
        </header>
        
        <article className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
        </article>
      </div>
    </div>
  );
};

export default PublicPage;

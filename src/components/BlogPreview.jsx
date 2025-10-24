// ===============================
// File: BlogPreview.jsx
// Description: Renders a preview of a blog post with SEO info, featured image, and accessibility improvements.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';

/**
 * BlogPreview renders a preview of a blog post, including title, author, excerpt, featured image, content, and SEO info.
 * Includes accessibility, semantic markup, and error handling.
 * @component
 * @param {Object} props
 * @param {Object} props.blog - Blog data to preview
 * @returns {JSX.Element|null}
 */
const BlogPreview = ({ blog }) => {
  if (!blog) return null;

  return (
    <main className="min-h-screen bg-gray-50" aria-label="Blog Preview">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8" aria-labelledby="blog-title">
          <h1 id="blog-title" className="text-4xl font-bold text-gray-900 mb-2">
            {blog.title}
          </h1>
          <div className="flex flex-col space-y-2">
            {/* Author info */}
            {blog.author && (
              <div className="text-gray-600">
                By {blog.author.name}
                {blog.author.role && <span className="text-gray-500">  b7 {blog.author.role}</span>}
              </div>
            )}
            {/* Date and preview label */}
            <div className="text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              <span className="ml-2 text-yellow-600" aria-label="Preview">(Preview)</span>
            </div>
            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-lg text-gray-600 mt-4">{blog.excerpt}</p>
            )}
            {/* Featured image with alt/caption */}
            {blog.featuredImage && (
              <figure className="mt-6">
                <img
                  src={blog.featuredImage.url}
                  alt={blog.featuredImage.alt || `Featured image for ${blog.title}`}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                {blog.featuredImage.caption && (
                  <figcaption className="text-sm text-gray-500 mt-2 text-center">
                    {blog.featuredImage.caption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        </header>
        {/* Blog content (dangerouslySetInnerHTML is assumed safe from backend) */}
        <article className="prose prose-lg max-w-none" aria-label="Blog Content">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>
        {/* SEO Preview */}
        {blog.seo && (
          <section className="mt-8 p-4 bg-gray-100 rounded-lg" aria-label="SEO Preview">
            <h2 className="text-lg font-semibold mb-2">SEO Preview</h2>
            <div className="space-y-2">
              <p><strong>Meta Title:</strong> {blog.seo.title || blog.title}</p>
              <p><strong>Meta Description:</strong> {blog.seo.description || blog.excerpt}</p>
              {blog.seo.keywords && (
                <p><strong>Keywords:</strong> {blog.seo.keywords}</p>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

BlogPreview.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    author: PropTypes.shape({
      name: PropTypes.string,
      role: PropTypes.string
    }),
    featuredImage: PropTypes.shape({
      url: PropTypes.string.isRequired,
      alt: PropTypes.string,
      caption: PropTypes.string
    }),
    seo: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      keywords: PropTypes.string
    })
  }).isRequired
};

export default BlogPreview;
// ===============================
// End of File: BlogPreview.jsx
// Description: Blog preview with SEO and accessibility
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 
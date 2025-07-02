import React from 'react';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLink, FaArrowLeft } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Link from 'next/link';

interface BlogPostDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostDetail({ params }: BlogPostDetailProps) {
  const { slug } = await params;
  
  // Fetch blog post data from API
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/blog/${slug}`, { cache: 'no-store' });
  const blogPost = await response.json();

  // Fallback data if blog post not found
  if (!blogPost) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog" className="text-orange-600 hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex-grow">
        {/* Back to Blog Link */}
        <div className="mb-6">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Blog Post Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>{blogPost.author}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(blogPost.publishDate)}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            {blogPost.title}
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            {blogPost.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {blogPost.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="relative h-64 sm:h-80 lg:h-96 w-full rounded-lg overflow-hidden">
            <img
              src={blogPost.featuredImage}
              alt={blogPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Blog Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed">
                {blogPost.content ? (
                  <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
                ) : (
                  <div>
                    <p className="mb-6">
                      This is a placeholder for the blog post content. In a real implementation, 
                      this content would be fetched from Contentful and could include rich text, 
                      images, and other formatted content.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                      Sample Content Section
                    </h2>
                    
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    
                    <p className="mb-4">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                      eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
                      in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                      Key Takeaways
                    </h3>
                    
                    <ul className="list-disc list-inside mb-6 space-y-2">
                      <li>Understanding the fundamentals of wine appreciation</li>
                      <li>Exploring different wine regions and their characteristics</li>
                      <li>Tips for selecting the perfect wine for any occasion</li>
                      <li>Proper wine storage and serving techniques</li>
                    </ul>
                    
                    <p className="mb-6">
                      Remember, the best wine is the one you enjoy drinking. Don't be afraid to 
                      experiment and discover new flavors and regions that appeal to your palate.
                    </p>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Share This Post</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                  <FaFacebookF className="text-xl" />
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="text-green-500 hover:text-green-700 transition-colors">
                  <FaWhatsapp className="text-xl" />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                  <FaLink className="text-xl" />
                </a>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Author</h4>
                <p className="text-sm text-gray-600">{blogPost.author}</p>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Published</h4>
                <p className="text-sm text-gray-600">{formatDate(blogPost.publishDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
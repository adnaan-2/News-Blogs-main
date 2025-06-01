'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Tag, Share } from 'lucide-react';
import CloudinaryImage from '@/components/CloudinaryImage';
import RelatedPosts from '@/components/RelatedPosts';
import FeaturedSidebar from '@/components/FeaturedSidebar';
import Comments from '@/components/Comments';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json();
        setPost(data.post);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load this article. It may have been removed or is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded max-w-md mb-4"></div>
          <div className="h-64 sm:h-72 md:h-80 bg-gray-200 rounded-md mb-4"></div>
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="bg-red-50 text-red-700 p-4 sm:p-6 rounded-md">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  // Check if image is from Cloudinary
  const isCloudinaryImage = post.imageUrl && post.imageUrl.includes('cloudinary.com');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-4 sm:mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Posts</span>
      </Link>

      {/* Post content */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main content */}
        <div className="w-full lg:w-2/3">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-6">{post.title}</h1>
          
          {/* Post meta */}
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 sm:mb-6">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="mr-4">{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            <User className="w-4 h-4 mr-1" />
            <span>{post.author?.name || 'Admin'}</span>
          </div>
          
          {/* Featured image - Better responsive handling */}
          <div className="relative aspect-[16/9] w-full mb-4 sm:mb-6 overflow-hidden rounded-lg">
            {isCloudinaryImage ? (
              <CloudinaryImage 
                src={post.imageUrl} 
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 60vw"
                className="object-contain bg-gray-100"
                priority
              />
            ) : post.imageUrl ? (
              <Image 
                src={post.imageUrl} 
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 60vw"
                className="object-contain bg-gray-100"
                unoptimized={true}
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          
          {/* Post content */}
          <article className="prose prose-sm sm:prose max-w-none mb-6">
            {post.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : null
            ))}
          </article>
          
          {/* Category and tags */}
          {post.category && (
            <div className="flex items-center mb-4 sm:mb-6">
              <Tag className="w-4 h-4 mr-1 text-gray-500" />
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                {post.category}
              </span>
            </div>
          )}
          
          {/* Share section */}
          <div className="flex flex-wrap items-center border-t border-b border-gray-100 py-4 sm:py-6 mb-6">
            <span className="mr-3 font-medium text-sm flex items-center">
              <Share className="w-4 h-4 mr-1" />
              Share:
            </span>
            <div className="flex space-x-2">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} 
                target="_blank" rel="noopener noreferrer"
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} 
                target="_blank" rel="noopener noreferrer"
                className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} 
                target="_blank" rel="noopener noreferrer"
                className="bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Comments section */}
          <div className="mb-8">
            <Comments postId={id} />
          </div>
          
          {/* Related posts */}
          <div className="mt-8 sm:mt-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Related Articles</h2>
            <RelatedPosts currentPostId={id} category={post.category} />
          </div>
        </div>
        
        {/* Sidebar - Only show on larger screens or at bottom on mobile */}
        <aside className="w-full lg:w-1/3 mt-8 lg:mt-0">
          <div className="sticky top-20">
            <FeaturedSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
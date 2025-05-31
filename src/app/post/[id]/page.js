'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Tag, Share } from 'lucide-react';
import CloudinaryImage from '@/components/CloudinaryImage';
import RelatedPosts from '@/components/RelatedPosts';
import FeaturedSidebar from '@/components/FeaturedSidebar';

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isCloudinaryImage = post?.imageUrl && post.imageUrl.includes('cloudinary.com');

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100) + '...',
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar placeholder */}
          <div className="md:w-1/4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="mb-4">
                <div className="h-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          
          {/* Main content placeholder */}
          <div className="md:w-3/4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex items-center mb-6">
              <div className="h-4 bg-gray-200 rounded w-24 mr-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-72 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 border-l-4 border-red-500 p-6">
          <h2 className="text-xl font-bold text-red-700 mb-2">Article Not Found</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            <ArrowLeft size={16} className="mr-1" /> Go back
          </button>
        </div>
      </div>
    );
  }

  // No post data
  if (!post) return null;

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back button - above the main layout */}
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} className="mr-1" /> Go back
        </button>
        
        {/* Main layout with sidebar */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar for featured posts */}
          <div className="md:w-1/4">
            <FeaturedSidebar currentPostId={id} />
          </div>
          
          {/* Main content area */}
          <div className="md:w-3/4 bg-white p-6 shadow-sm">
            {/* Category tag */}
            <div className="mb-4">
              <Link 
                href={`/category/${post.category}`}
                className="inline-block bg-red-600 text-white text-xs px-3 py-1 uppercase font-semibold rounded-sm"
              >
                {post.category}
              </Link>
            </div>
            
            {/* Article headline */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            
            {/* Meta information */}
            <div className="flex items-center text-gray-500 mb-6">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="mr-4">{formatDate(post.createdAt)}</span>
              <User className="w-4 h-4 mr-1" />
              <span>{post.author?.name || 'Admin'}</span>
            </div>
            
            {/* Featured image */}
            <div className="relative h-72 md:h-96 w-full mb-6">
              {isCloudinaryImage ? (
                <CloudinaryImage 
                  src={post.imageUrl} 
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              ) : post.imageUrl ? (
                <Image 
                  src={post.imageUrl} 
                  alt={post.title}
                  fill
                  className="object-cover"
                  unoptimized={true}
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            {/* Article content */}
            <div className="prose max-w-none mb-8">
              {post.content.split('\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : null
              ))}
            </div>
            
            {/* Share options */}
            <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 my-6">
              <div className="text-gray-600">Share this article:</div>
              <div className="flex space-x-4">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600"
                  aria-label="Share on Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-400"
                  aria-label="Share on Twitter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-700"
                  aria-label="Share on LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
                <button 
                  onClick={handleShare}
                  className="text-gray-600 hover:text-gray-900"
                  aria-label="Share article"
                >
                  <Share size={20} />
                </button>
              </div>
            </div>
            
            {/* Related posts section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <RelatedPosts currentPostId={id} category={post.category} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
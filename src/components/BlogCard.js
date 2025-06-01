'use client'
import Link from 'next/link'
import { Calendar, User } from 'lucide-react'
import { useState } from 'react'
import CloudinaryImage from './CloudinaryImage'
import Image from 'next/image'

export default function BlogCard({ post, featured = false }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Check if image is from Cloudinary
  const isCloudinaryImage = post.imageUrl && post.imageUrl.includes('cloudinary.com');

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <Link href={`/post/${post._id}`} className="block">
        {/* Image section - Fixed height with proper object positioning */}
        <div className="relative h-52 w-full overflow-hidden rounded-t-lg">
          {isCloudinaryImage ? (
            <CloudinaryImage 
              src={post.imageUrl} 
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center w-full h-full"
              priority={featured}
            />
          ) : post.imageUrl ? (
            <Image 
              src={post.imageUrl} 
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center w-full h-full"
              unoptimized={true}
              priority={featured}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {/* Category tag - positioned better */}
          <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-3 py-1 uppercase font-semibold rounded-sm shadow-md">
            {post.category}
          </div>
        </div>
      </Link>

      {/* Content section - using flex-grow to fill space */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Headline */}
        <Link href={`/post/${post._id}`} className="block mb-2">
          <h2 className="text-xl font-bold line-clamp-2 hover:text-red-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Publication info */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          <span className="mr-3">{formatDate(post.createdAt)}</span>
          <User className="w-4 h-4 mr-1" />
          <span>{post.author?.name || 'Admin'}</span>
        </div>

        {/* Article excerpt - with flex-grow to push the footer to the bottom */}
        <p className="text-gray-700 mb-4 line-clamp-3 text-sm flex-grow">
          {post.content}
        </p>

        {/* Social sharing and read more - always at the bottom */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-auto">
          <div className="flex space-x-2">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + `/post/${post._id}` : '')}`} 
               target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-blue-600"
               aria-label="Share on Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
              </svg>
            </a>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + `/post/${post._id}` : '')}`} 
               target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-blue-400"
               aria-label="Share on Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
              </svg>
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + `/post/${post._id}` : '')}`} 
               target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-blue-700"
               aria-label="Share on LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
              </svg>
            </a>
          </div>
          
          <Link 
            href={`/post/${post._id}`}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  )
}
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
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${featured ? 'transform hover:scale-[1.02]' : ''}`}>
      <div className="relative h-48 w-full">
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
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {post.title}
        </h3>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span className="mr-4">{formatDate(post.createdAt)}</span>
          <User className="w-4 h-4 mr-1" />
          <span>{post.author?.name || 'Admin'}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.content.substring(0, 150)}...
        </p>
        <div className="flex justify-between items-center">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
            {post.category}
          </span>
          <Link 
            href={`/post/${post._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  )
}

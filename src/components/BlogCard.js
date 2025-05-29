'use client'
import Link from 'next/link'
import { Calendar, User } from 'lucide-react'

export default function BlogCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <h3 className="text-white text-lg font-semibold text-center px-4">
          {post.title}
        </h3>
      </div>
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span className="mr-4">{new Date(post.createdAt).toLocaleDateString()}</span>
          <User className="w-4 h-4 mr-1" />
          <span>Admin</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.content.substring(0, 150)}...
        </p>
        <div className="flex justify-between items-center">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
            {post.category}
          </span>
          <Link 
            href={`/post/${post.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogCard from '@/components/BlogCard'
import { usePosts } from '@/context/PostContext'

export default function Home() {
  const { posts } = usePosts()
  const [searchTerm, setSearchTerm] = useState('')

  // Handle admin search
  useEffect(() => {
    if (searchTerm.toLowerCase() === 'admin') {
      window.location.href = '/admin/login'
    }
  }, [searchTerm])

  const categories = ['business', 'tech', 'weather', 'automotive', 'pakistan', 'global', 'health', 'sports', 'islam', 'education', 'entertainment']
  
  const getLatestPostsByCategory = () => {
    const result = {}
    categories.forEach(category => {
      const categoryPosts = posts.filter(post => post.category === category)
      result[category] = categoryPosts.slice(0, 3) // Get latest 3 posts
    })
    return result
  }

  const latestPosts = getLatestPostsByCategory()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logo and Search */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="text-blue-600">News</span>Hub
          </h1>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search... (type 'admin' for admin access)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Latest Posts by Category */}
        {categories.map(category => (
          latestPosts[category].length > 0 && (
            <div key={category} className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  Latest {category} News
                </h2>
                <Link 
                  href={`/${category}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All {category}
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestPosts[category].map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )
        ))}

        {/* Show message if no posts */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600">No posts available. Create some posts from admin panel!</h2>
          </div>
        )}
      </div>
    </div>
  )
}
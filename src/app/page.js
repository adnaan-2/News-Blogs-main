'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogCard from '@/components/BlogCard'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  // Handle admin search
  useEffect(() => {
    if (searchTerm.toLowerCase() === 'admin') {
      router.push('/admin/login')
    }
  }, [searchTerm, router])

  // Load posts from API
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts?limit=30')
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const categories = [
    'business', 'tech', 'weather', 'automotive', 'pakistan', 'global', 
    'health', 'sports', 'islam', 'education', 'entertainment'
  ]
  
  const getLatestPostsByCategory = () => {
    const result = {}
    categories.forEach(category => {
      const categoryPosts = posts.filter(post => post.category === category)
      result[category] = categoryPosts.slice(0, 3) // Get latest 3 posts
    })
    return result
  }

  const latestPosts = getLatestPostsByCategory()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logo and Search */}
        

        {/* Featured Posts Carousel */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Posts</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {posts.slice(0, 3).map(post => (
              <BlogCard key={post._id} post={post} featured={true} />
            ))}
          </div>
        </div>

        {/* Latest Posts by Category */}
        {categories.map(category => (
          latestPosts[category]?.length > 0 && (
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
                  <BlogCard key={post._id} post={post} />
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
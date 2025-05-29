'use client'
import { usePosts } from '@/context/PostContext'
import BlogCard from '@/components/BlogCard'

export default function AutomotivePage() {
  const { posts } = usePosts()
  const automotivePosts = posts.filter(post => post.category === 'automotive')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Automotive News</h1>
        {automotivePosts.length === 0 ? (
          <p className="text-gray-600 text-center py-12">No automotive posts available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automotivePosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

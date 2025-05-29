'use client'
import { usePosts } from '@/context/PostContext'
import BlogCard from '@/components/BlogCard'

export default function BusinessPage() {
  const { posts } = usePosts()
  const businessPosts = posts.filter(post => post.category === 'business')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Business News</h1>
        {businessPosts.length === 0 ? (
          <p className="text-gray-600 text-center py-12">No business posts available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

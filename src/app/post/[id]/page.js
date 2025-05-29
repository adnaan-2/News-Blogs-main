'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { usePosts } from '@/context/PostContext'
import { Calendar, User, MessageCircle } from 'lucide-react'

export default function PostDetail() {
  const { id } = useParams()
  const { posts, addComment } = usePosts()
  const [post, setPost] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(() => {
    const foundPost = posts.find(p => p.id === id)
    setPost(foundPost)
  }, [id, posts])

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      addComment(id, comment.trim())
      setComment('')
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h1>
          <a href="/" className="text-blue-600 hover:text-blue-800">Go back to home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <h1 className="text-white text-3xl font-bold text-center px-6">
              {post.title}
            </h1>
          </div>
          <div className="p-8">
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="mr-6">{new Date(post.createdAt).toLocaleDateString()}</span>
              <User className="w-4 h-4 mr-2" />
              <span className="mr-6">Admin</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full capitalize">
                {post.category}
              </span>
            </div>
            <div className="prose max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <MessageCircle className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-bold">Comments ({post.comments.length})</h2>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
              required
            />
            <button
              type="submit"
              className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              post.comments.map(comment => (
                <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-3">
                  <p className="text-gray-700 mb-2">{comment.text}</p>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Calendar, User, MessageCircle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import CloudinaryImage from '@/components/CloudinaryImage'
import Image from 'next/image'

export default function PostDetail() {
  const { id } = useParams()
  const { data: session, status } = useSession()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${id}`)
        
        if (!response.ok) {
          throw new Error('Post not found')
        }
        
        const data = await response.json()
        setPost(data.post)
        
        // Debug log
        console.log('Post image URL:', data.post.imageUrl);
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(err.message || 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    
    if (!comment.trim()) return
    
    setIsSubmitting(true)
    
    try {
      if (!session) {
        throw new Error('You must be logged in to comment')
      }
      
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: comment })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add comment')
      }
      
      const data = await response.json()
      setPost(data.post)
      setComment('')
    } catch (err) {
      console.error('Error adding comment:', err)
      alert(err.message || 'Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">Go back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ChevronLeft size={20} />
          <span>Back to Home</span>
        </Link>
        
        <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Featured Image - Using Cloudinary */}
          {post?.imageUrl && post.imageUrl.includes('cloudinary.com') ? (
            <div className="relative h-80 w-full">
              <CloudinaryImage 
                src={post.imageUrl} 
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          ) : post?.imageUrl ? (
            <div className="relative h-80 w-full">
              <Image 
                src={post.imageUrl} 
                alt={post.title}
                fill 
                className="object-cover"
                unoptimized={true}
              />
            </div>
          ) : null}
          
          {/* Post Content */}
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="mr-6">{formatDate(post.createdAt)}</span>
              <User className="w-4 h-4 mr-2" />
              <span className="mr-6">{post.author?.name || 'Admin'}</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full capitalize">
                {post.category}
              </span>
            </div>
            
            <div className="prose max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <MessageCircle className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-bold">Comments ({post.comments?.length || 0})</h2>
          </div>

          {/* Comment Form */}
          {session ? (
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
                disabled={isSubmitting}
                className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-lg">
              <p>Please <Link href="/auth/login" className="font-bold underline">log in</Link> to leave a comment.</p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              post.comments?.map((comment, index) => (
                <div key={comment._id || index} className="border-l-4 border-blue-200 pl-4 py-3">
                  <div className="font-semibold mb-1">
                    {comment.author?.name || 'Anonymous'}
                  </div>
                  <p className="text-gray-700 mb-2">{comment.text}</p>
                  <div className="text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
              ))
            )
          }
          </div>
        </div>
      </div>
    </div>
  )
}
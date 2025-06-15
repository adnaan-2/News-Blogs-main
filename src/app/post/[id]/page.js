'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  MessageCircle, 
  Eye,
  Share2,
  Clock
} from 'lucide-react'
import CloudinaryImage from '@/components/CloudinaryImage'
import FeaturedSidebar from '@/components/FeaturedSidebar'
import RelatedPosts from '@/components/RelatedPosts'
import CommentSection from '@/components/Comments'

export default function PostPage({ params }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (params?.id) {
      fetchPost(params.id)
    }
  }, [params?.id])

  const fetchPost = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Post not found')
        } else {
          setError('Failed to load post')
        }
        return
      }
      
      const postData = await response.json()
      setPost(postData)
    } catch (err) {
      console.error('Error fetching post:', err)
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (err) {
      return 'Invalid date'
    }
  }

  const calculateReadingTime = (content) => {
    if (!content) return 1
    const wordsPerMinute = 238
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || 'Check out this article',
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
                <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="mb-6">
                    <div className="h-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error}
          </h1>
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  const isCloudinaryImage = post.imageUrl && post.imageUrl.includes('cloudinary.com')
  const isLocalUpload = post.imageUrl && (post.imageUrl.includes('/uploads/') || post.imageUrl.startsWith('uploads/'))
  const placeholderImage = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop&crop=center"
  
  let imageToDisplay = post.imageUrl
  if (isLocalUpload) {
    imageToDisplay = placeholderImage
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      <div className="py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article>
                {/* Header */}
                <header className="mb-8">
                  {/* Category */}
                  <div className="mb-4">
                    <Link 
                      href={`/category/${post.category?.toLowerCase()}`}
                      className="inline-block bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wider hover:bg-blue-700 transition-colors"
                    >
                      {post.category}
                    </Link>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      <span>{post.author?.name || 'Admin'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>{calculateReadingTime(post.content)} min read</span>
                    </div>
                    {post.views > 0 && (
                      <div className="flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        <span>{post.views} views</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 mb-8">
                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    
                    {post.commentsCount > 0 && (
                      <div className="flex items-center text-gray-600">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{post.commentsCount} comments</span>
                      </div>
                    )}
                  </div>
                </header>

                {/* Featured Image */}
                {post.imageUrl && (
                  <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
                    {isCloudinaryImage ? (
                      <CloudinaryImage
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <Image
                        src={imageToDisplay}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        className="object-cover"
                        priority
                      />
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                  <div className="prose prose-lg max-w-none">
                    {post.content.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              {/* Comments Section */}
              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <CommentSection postId={post._id} />
              </div>

              {/* Related Posts */}
              <RelatedPosts 
                postId={post._id} 
                category={post.category} 
                limit={3} 
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <FeaturedSidebar currentPostId={post._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
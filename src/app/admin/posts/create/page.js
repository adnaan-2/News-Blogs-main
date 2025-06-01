'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Upload, X, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminCreatePostPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [createdPostId, setCreatedPostId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'business',
    image: null
  })

  const categories = [
    'business', 'tech', 'weather', 'automotive', 'pakistan', 
    'global', 'health', 'sports', 'islam', 'education', 'entertainment'
  ]

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    setFormData(prev => ({
      ...prev,
      image: file
    }))

    // Create image preview
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Remove selected image
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }))
    setImagePreview(null)
  }

  // Handle delete post
  const handleDeletePost = async () => {
    if (!createdPostId) return
    
    try {
      // Show deleting state
      setIsSubmitting(true)
      
      const response = await fetch(`/api/posts/${createdPostId}`, {
        method: 'DELETE',
      })

      // Get the response data
      let data = {}
      try {
        data = await response.json()
      } catch (e) {
        // Response might not contain JSON
        console.error("Error parsing response:", e)
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to delete post')
      }

      // Post deleted successfully
      setSuccess('Post deleted successfully!')
      setShowDeleteConfirm(false)
      setCreatedPostId(null)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to delete post')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add detailed logging to debug the form submission process
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      console.log('Starting form submission')
      
      // Check if user is authenticated
      if (status !== 'authenticated') {
        setError('You must be logged in to create a post')
        setIsSubmitting(false)
        return
      }

      console.log('Authentication check passed')
      
      // Create form data for multipart/form-data (for image upload)
      const postFormData = new FormData()
      postFormData.append('title', formData.title)
      postFormData.append('content', formData.content)
      postFormData.append('category', formData.category)
      
      if (formData.image) {
        postFormData.append('image', formData.image)
        console.log('Added image to form data:', formData.image.name, formData.image.size, formData.image.type)
      } else {
        console.log('No image to upload')
      }

      console.log('Submitting form to API...')
      
      // Send data to API route
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: postFormData,
      })

      console.log('API response received:', response.status)
      
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Something went wrong')
      }

      console.log('Post created successfully!')
      
      // Store the created post ID
      setCreatedPostId(data.post._id)
      
      // Post created successfully
      setSuccess('Post created successfully!')
      setFormData({
        title: '',
        content: '',
        category: 'business',
        image: null
      })
      setImagePreview(null)
    } catch (err) {
      console.error('Error creating post:', err)
      setError(err.message || 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading spinner while checking auth
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Create New Post</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex flex-col">
            <p className="text-green-700 mb-3">{success}</p>
            
            {createdPostId && (
              <div className="flex space-x-4 mt-2">
                <Link
                  href={`/admin/posts/edit/${createdPostId}`}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Post
                </Link>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Post
                </button>
                
                <Link
                  href={`/post/${createdPostId}`}
                  target="_blank"
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  View Post
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Title Field */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title"
            />
          </div>
          
          {/* Category Selection */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category} className="capitalize">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Featured Image
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="image" 
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-gray-500">Click to upload image</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  width={400} 
                  height={225} 
                  className="rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          
          {/* Content Field */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your post content here..."
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
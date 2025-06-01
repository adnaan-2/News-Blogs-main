import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import mongoose from 'mongoose';

export default function AdminEditPostPage({ params }) {
  const { id } = params
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
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

  // Fetch post data
  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/posts/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch post')
        }
        
        const data = await response.json()
        const post = data.post
        
        setFormData({
          title: post.title || '',
          content: post.content || '',
          category: post.category || 'business',
          image: null
        })
        
        if (post.imageUrl) {
          setImagePreview(post.imageUrl)
        }
        
      } catch (error) {
        console.error('Error fetching post:', error)
        setError(error.message || 'Failed to fetch post')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id])

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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      // Create form data for multipart/form-data (for image upload)
      const postFormData = new FormData()
      postFormData.append('title', formData.title)
      postFormData.append('content', formData.content)
      postFormData.append('category', formData.category)
      
      if (formData.image) {
        postFormData.append('image', formData.image)
      }

      console.log('Submitting update for post:', id)
      
      // Send data to API route
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: postFormData,
      })
      
      console.log('Response status:', response.status)
      
      // Handle non-JSON response
      if (response.status === 405) {
        throw new Error('Method not allowed. The API endpoint does not support PUT requests.')
      }
      
      if (!response.ok) {
        let errorMessage = 'Failed to update post'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          console.error('Error parsing error response:', e)
        }
        throw new Error(errorMessage)
      }
      
      // Try to parse response as JSON
      let data
      try {
        data = await response.json()
        console.log('Response data:', data)
      } catch (e) {
        console.error('Error parsing response:', e)
        if (response.ok) {
          // If the response is OK but not JSON, we'll still treat it as success
          data = { message: 'Post updated successfully' }
        } else {
          throw new Error('Invalid response from server')
        }
      }
      
      // Post updated successfully
      setSuccess(data.message || 'Post updated successfully!')
      
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1500)
    } catch (err) {
      console.error('Error updating post:', err)
      setError(err.message || 'Failed to update post')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/dashboard" className="flex items-center text-gray-600 hover:text-blue-600">
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl font-semibold">Edit Post</h2>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700">{success}</p>
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
                  unoptimized={true}
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
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

// Connect to MongoDB at the start
export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    await dbConnect();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    // Find post by ID
    const post = await Post.findById(id).populate('author', 'name email');
    
    // Return 404 if post not found
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Return post data
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  
  try {
    await dbConnect();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    // Find post to verify it exists
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Process form data (multipart form)
    const formData = await request.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const category = formData.get('category');
    const image = formData.get('image');
    
    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content and category are required' },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const updateData = {
      title,
      content,
      category,
      updatedAt: new Date()
    };
    
    // Handle image upload if provided
    if (image && image instanceof File) {
      // For now, we'll keep existing image URL
      // In a real implementation, you would upload the image and update the URL
      console.log('Image received:', image.name, image.size);
    }
    
    // Update post in database using Mongoose
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // Return updated document
    );
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found or not updated' }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({ 
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  
  try {
    await dbConnect();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    // Delete post by ID using Mongoose
    const deletedPost = await Post.findByIdAndDelete(id);
    
    if (!deletedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
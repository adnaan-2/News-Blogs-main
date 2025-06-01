'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import BlogCard from '@/components/BlogCard'
import { useRouter } from 'next/navigation'
import { ArrowRight, TrendingUp, ChevronRight } from 'lucide-react'

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
        const response = await fetch('/api/posts?limit=50') // Increased limit to get more posts
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
  
  // Category gradient colors - light, aesthetically pleasing gradients
  const categoryColors = {
    'business': 'from-blue-50 to-indigo-100',
    'tech': 'from-purple-50 to-violet-100',
    'weather': 'from-sky-50 to-blue-100',
    'automotive': 'from-gray-50 to-slate-100',
    'pakistan': 'from-green-50 to-emerald-100',
    'global': 'from-cyan-50 to-teal-100',
    'health': 'from-rose-50 to-pink-100',
    'sports': 'from-orange-50 to-amber-100',
    'islam': 'from-emerald-50 to-green-100',
    'education': 'from-yellow-50 to-amber-100',
    'entertainment': 'from-fuchsia-50 to-pink-100'
  }

  // Get featured posts (up to 18)
  const featuredPosts = posts.filter(post => post.featured).slice(0, 18)
  
  // If not enough featured posts, add some recent posts to make up the number
  const recentPosts = posts
    .filter(post => !post.featured)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  
  const displayedFeaturedPosts = 
    featuredPosts.length < 18 
      ? [...featuredPosts, ...recentPosts.slice(0, 18 - featuredPosts.length)]
      : featuredPosts
  
  // Group posts by category
  const getPostsByCategory = () => {
    const result = {}
    categories.forEach(category => {
      const categoryPosts = posts.filter(post => post.category === category)
      result[category] = categoryPosts.slice(0, 4) // Get latest 4 posts for each category
    })
    return result
  }

  const postsByCategory = getPostsByCategory()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Featured Posts Full-Width Section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-6 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4 sm:mb-8">
            <div className="flex items-center">
              <TrendingUp className="mr-2 text-red-500" size={20} />
              <h2 className="text-xl sm:text-3xl font-bold">Featured Stories</h2>
            </div>
            <Link 
              href="/featured"
              className="flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all text-sm"
            >
              Explore All <ArrowRight className="ml-1 sm:ml-2" size={14} />
            </Link>
          </div>
          
          {/* Updated grid for mobile - 2 columns on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {/* Large featured post */}
            {displayedFeaturedPosts.length > 0 && (
              <div className="col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 xl:row-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl transform transition-all hover:scale-[1.02]">
                <Link href={`/post/${displayedFeaturedPosts[0]._id}`} className="block h-full">
                  <div className="relative h-48 sm:h-64 md:h-72 xl:h-96 w-full">
                    {displayedFeaturedPosts[0].imageUrl ? (
                      <Image 
                        src={displayedFeaturedPosts[0].imageUrl}
                        alt={displayedFeaturedPosts[0].title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                      <div className="bg-red-600 text-white text-xs px-2 py-0.5 sm:px-3 sm:py-1 uppercase font-semibold rounded-full inline-block mb-1 sm:mb-3">
                        {displayedFeaturedPosts[0].category}
                      </div>
                      <h3 className="text-sm sm:text-lg md:text-xl xl:text-2xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">{displayedFeaturedPosts[0].title}</h3>
                      <div className="text-xs text-gray-300 hidden sm:block">
                        {new Date(displayedFeaturedPosts[0].createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
            
            {/* Other featured posts - 2 per row on mobile */}
            {displayedFeaturedPosts.slice(1, 19).map((post) => (
              <div 
                key={post._id} 
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl overflow-hidden shadow-md transform transition-all hover:scale-[1.03]"
              >
                <Link href={`/post/${post._id}`} className="block h-full">
                  <div className="relative h-32 sm:h-48 w-full">
                    {post.imageUrl ? (
                      <Image 
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
                      <div className="bg-red-600 text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 uppercase font-semibold rounded-full">
                        {post.category}
                      </div>
                    </div>
                  </div>
                  <div className="p-2 sm:p-4">
                    <h3 className="font-bold text-xs sm:text-sm text-white mb-1 line-clamp-2">{post.title}</h3>
                    <div className="text-[10px] sm:text-xs text-gray-300 hidden sm:block">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Latest Posts by Category with gradient backgrounds */}
        {categories.map(category => (
          postsByCategory[category]?.length > 0 && (
            <div key={category} className={`mb-8 sm:mb-12 rounded-xl bg-gradient-to-r ${categoryColors[category]} p-3 sm:p-6`}>
              <div className="flex justify-between items-center mb-3 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 capitalize">
                  {category} News
                </h2>
                <Link 
                  href={`/category/${category}`}
                  className="flex items-center text-xs sm:text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  View All <ChevronRight className="ml-1" size={14} />
                </Link>
              </div>
              
              {/* Updated grid for mobile - 2 columns on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {postsByCategory[category].map(post => (
                  <div 
                    key={post._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full"
                  >
                    <Link href={`/post/${post._id}`} className="block h-full flex flex-col">
                      <div className="relative h-28 sm:h-40 w-full">
                        {post.imageUrl ? (
                          <Image 
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                        {/* Category label on image */}
                        <div className="absolute bottom-1 left-1">
                          <div className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 uppercase font-medium rounded-sm">
                            {post.category}
                          </div>
                        </div>
                      </div>
                      <div className="p-2 sm:p-3 flex flex-col flex-grow">
                        <h3 className="font-bold text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 text-[10px] sm:text-xs line-clamp-2 mb-1 sm:mb-2 hidden sm:block">{post.excerpt || post.content}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <div className="text-[10px] text-gray-500 hidden sm:block">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <span className="text-red-600 text-[10px] sm:text-xs font-medium">Read more</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {/* Show message if no posts */}
        {posts.length === 0 && (
          <div className="text-center py-6 sm:py-12 bg-white rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl text-gray-600">No posts available. Create some posts from admin panel!</h2>
          </div>
        )}
      </div>
    </div>
  )
}
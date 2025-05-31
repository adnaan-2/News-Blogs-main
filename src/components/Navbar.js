'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, ChevronDown, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lifestyleDropdownOpen, setLifestyleDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)
  const { data: session } = useSession()
  const router = useRouter()

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Search results with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSearchResults(searchQuery)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchSearchResults = async (query) => {
    if (!query.trim()) return

    try {
      setIsSearching(true)
      const response = await fetch(`/api/posts?search=${encodeURIComponent(query)}&limit=5`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }
      
      const data = await response.json()
      setSearchResults(data.posts || [])
      setShowResults(true)
    } catch (error) {
      console.error('Error fetching search results:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value.trim() === '') {
      setShowResults(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setShowResults(false)
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
  }

  const handleResultClick = (postId) => {
    router.push(`/post/${postId}`)
    setSearchQuery('')
    setShowResults(false)
    if (mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleLifestyleDropdown = () => {
    setLifestyleDropdownOpen(!lifestyleDropdownOpen)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric'
    })
  }

  // Function to highlight the search term in results
  const highlightSearchTerm = (text) => {
    if (!searchQuery.trim()) return text
    
    try {
      const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'))
      return (
        <>
          {parts.map((part, i) => 
            part.toLowerCase() === searchQuery.toLowerCase() ? 
              <span key={i} className="bg-yellow-200 text-gray-900">{part}</span> : 
              part
          )}
        </>
      )
    } catch (e) {
      return text
    }
  }

  const isAdmin = session?.user?.role === 'admin'

  return (
    <div className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top row: Logo and Search */}
        <div className="flex justify-between items-center py-4">
          {/* Logo on the left */}
          <Link href="/" className="text-2xl font-bold">NewsHub</Link>
          
          {/* Mobile menu button (only visible on mobile) */}
          <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Search Bar on the right (desktop only) */}
          <div className="hidden md:block w-full max-w-md" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full py-1.5 pl-3 pr-10 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => {
                    if (searchQuery.trim() && searchResults.length > 0) {
                      setShowResults(true)
                    }
                  }}
                />
                <button 
                  type="submit"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  <Search size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Live search results dropdown */}
              {showResults && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-center text-gray-500">
                      <div className="animate-pulse flex justify-center">
                        <div className="h-4 w-4 bg-gray-300 rounded-full mr-1"></div>
                        <div className="h-4 w-4 bg-gray-400 rounded-full mr-1"></div>
                        <div className="h-4 w-4 bg-gray-500 rounded-full"></div>
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <ul className="py-1">
                        {searchResults.map(post => (
                          <li key={post._id}>
                            <button 
                              className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-start gap-3"
                              onClick={() => handleResultClick(post._id)}
                            >
                              {/* Thumbnail */}
                              <div className="w-12 h-12 relative flex-shrink-0 bg-gray-200">
                                {post.imageUrl && (
                                  <Image 
                                    src={post.imageUrl} 
                                    alt={post.title} 
                                    fill 
                                    className="object-cover"
                                    unoptimized={true}
                                  />
                                )}
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-800 line-clamp-2">
                                  {highlightSearchTerm(post.title)}
                                </div>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <span className="bg-gray-100 px-1.5 py-0.5 rounded-sm mr-1">
                                    {post.category}
                                  </span>
                                  <span>{formatDate(post.createdAt)}</span>
                                </div>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-gray-100 p-2">
                        <button 
                          className="w-full text-center text-blue-600 hover:text-blue-800 text-sm py-1"
                          onClick={() => {
                            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                            setShowResults(false)
                          }}
                        >
                          View all results
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 text-center text-gray-600">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
        
        {/* Bottom row: Navigation (desktop only) */}
        <div className="hidden md:flex justify-center border-t border-gray-800 py-2">
          <nav className="flex items-center space-x-6">
            <Link href="/" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Home</Link>
            <Link href="/business" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Business</Link>
            <Link href="/tech" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Tech</Link>
            <Link href="/weather" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Weather</Link>
            <Link href="/automotive" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Automotive</Link>
            <Link href="/pakistan" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Pakistan</Link>
            <Link href="/global" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Global</Link>
            
            {/* Lifestyle dropdown menu */}
            <div className="relative">
              <button 
                onClick={toggleLifestyleDropdown}
                className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium flex items-center"
                aria-expanded={lifestyleDropdownOpen}
              >
                Lifestyle <ChevronDown size={16} className="ml-1" />
              </button>
              
              {lifestyleDropdownOpen && (
                <div className="absolute top-full left-0 bg-gray-800 py-2 w-48 shadow-xl rounded-b-md">
                  <Link href="/category/health" className="block px-4 py-2 hover:bg-gray-700 text-sm">Health</Link>
                  <Link href="/category/sports" className="block px-4 py-2 hover:bg-gray-700 text-sm">Sports</Link>
                  <Link href="/category/entertainment" className="block px-4 py-2 hover:bg-gray-700 text-sm">Entertainment</Link>
                  <Link href="/category/education" className="block px-4 py-2 hover:bg-gray-700 text-sm">Education</Link>
                  <Link href="/category/islam" className="block px-4 py-2 hover:bg-gray-700 text-sm">Religion</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
        
        {/* Right side auth controls */}
        <div className="hidden md:flex justify-end border-t border-gray-800 py-2">
          <div className="flex items-center">
            {session ? (
              <>
                {/* If user is logged in */}
                <span className="mr-2 text-sm">
                  Hi, {session.user.name || 'Admin'}
                </span>
                
                {/* Dashboard button - only for admin */}
                <Link 
                  href="/admin/dashboard" 
                  className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm mr-2"
                >
                  Admin
                </Link>
                
                <button 
                  onClick={() => signOut()} 
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Just a simple text link for admin login */}
                <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white">
                
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            {/* Search Bar for Mobile */}
            <div className="mb-4" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full py-2 pl-3 pr-10 rounded text-gray-900 focus:outline-none text-sm"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => {
                      if (searchQuery.trim() && searchResults.length > 0) {
                        setShowResults(true)
                      }
                    }}
                  />
                  <button 
                    type="submit"
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    <Search size={18} className="text-gray-500" />
                  </button>
                </div>
                
                {/* Mobile search results */}
                {showResults && (
                  <div className="absolute left-4 right-4 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-center text-gray-500">
                        <div className="animate-pulse flex justify-center">
                          <div className="h-4 w-4 bg-gray-300 rounded-full mr-1"></div>
                          <div className="h-4 w-4 bg-gray-400 rounded-full mr-1"></div>
                          <div className="h-4 w-4 bg-gray-500 rounded-full"></div>
                        </div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <ul className="py-1">
                          {searchResults.map(post => (
                            <li key={post._id}>
                              <button 
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-start gap-3"
                                onClick={() => handleResultClick(post._id)}
                              >
                                {/* Thumbnail */}
                                <div className="w-12 h-12 relative flex-shrink-0 bg-gray-200">
                                  {post.imageUrl && (
                                    <Image 
                                      src={post.imageUrl} 
                                      alt={post.title} 
                                      fill 
                                      className="object-cover"
                                      unoptimized={true}
                                    />
                                  )}
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-800 line-clamp-2">
                                    {highlightSearchTerm(post.title)}
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded-sm mr-1">
                                      {post.category}
                                    </span>
                                    <span>{formatDate(post.createdAt)}</span>
                                  </div>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-gray-100 p-2">
                          <button 
                            className="w-full text-center text-blue-600 hover:text-blue-800 text-sm py-1"
                            onClick={() => {
                              router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                              setShowResults(false)
                              setMobileMenuOpen(false)
                            }}
                          >
                            View all results
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-3 text-center text-gray-600">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
            
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/business" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Business
              </Link>
              <Link 
                href="/tech" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tech
              </Link>
              <Link 
                href="/weather" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Weather
              </Link>
              <Link 
                href="/automotive" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Automotive
              </Link>
              <Link 
                href="/pakistan" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pakistan
              </Link>
              <Link 
                href="/global" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Global
              </Link>
              
              {/* Lifestyle section in mobile menu */}
              <div className="py-2">
                <button 
                  className="flex items-center justify-between w-full hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                  onClick={() => setLifestyleDropdownOpen(!lifestyleDropdownOpen)}
                >
                  Lifestyle
                  <ChevronDown size={16} className={`transform transition-transform ${lifestyleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {lifestyleDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2 border-l border-gray-700">
                    <Link 
                      href="/category/health" 
                      className="block py-2 hover:text-gray-300 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Health
                    </Link>
                    <Link 
                      href="/category/sports" 
                      className="block py-2 hover:text-gray-300 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sports
                    </Link>
                    <Link 
                      href="/category/entertainment" 
                      className="block py-2 hover:text-gray-300 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Entertainment
                    </Link>
                    <Link 
                      href="/category/education" 
                      className="block py-2 hover:text-gray-300 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Education
                    </Link>
                    <Link 
                      href="/category/islam" 
                      className="block py-2 hover:text-gray-300 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Religion
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Auth area for mobile */}
              <div className="pt-4 mt-2 border-t border-gray-800 flex flex-col space-y-2">
                {session ? (
                  <>
                    <span className="text-sm">
                      Hi, {session.user.name || 'Admin'}
                    </span>
                    <Link 
                      href="/admin/dashboard"
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded text-center text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }} 
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-center text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* Simple text link for admin in mobile view too */}
                    <Link 
                      href="/auth/login" 
                      className="text-gray-300 hover:text-white text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                    
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
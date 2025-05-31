'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import CloudinaryImage from './CloudinaryImage';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef(null);
  const router = useRouter();

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch search results when query changes
  useEffect(() => {
    async function fetchSearchResults() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/posts?search=${debouncedQuery}&limit=5`);
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        setResults(data.posts || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Error searching posts:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearchResults();
  }, [debouncedQuery]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim() === '') {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search articles..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim() !== '' && results.length > 0) {
              setIsOpen(true);
            }
          }}
        />
        
        {query && (
          <button 
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={clearSearch}
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
          </button>
        )}
      </div>
      
      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-4">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3">
                    <div className="h-12 w-12 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <>
              <ul>
                {results.map(post => (
                  <li key={post._id} className="border-b last:border-0">
                    <Link 
                      href={`/post/${post._id}`} 
                      className="flex p-3 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      {/* Post thumbnail */}
                      <div className="w-16 h-16 mr-3 flex-shrink-0 relative">
                        {post.imageUrl && post.imageUrl.includes('cloudinary.com') ? (
                          <CloudinaryImage 
                            src={post.imageUrl} 
                            alt={post.title}
                            fill
                            className="object-cover rounded"
                          />
                        ) : post.imageUrl ? (
                          <Image 
                            src={post.imageUrl} 
                            alt={post.title}
                            fill
                            className="object-cover rounded"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Post details */}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2 mb-1">
                          {highlightSearchTerm(post.title, query)}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">
                            {post.category}
                          </span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="p-2 border-t">
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 w-full text-center py-1"
                  onClick={() => {
                    router.push(`/search?q=${query}`);
                    setIsOpen(false);
                  }}
                >
                  View all results
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to highlight the search term in results
function highlightSearchTerm(text, searchTerm) {
  if (!searchTerm) return text;
  
  try {
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? 
            <span key={i} className="bg-yellow-200 font-medium">{part}</span> : 
            part
        )}
      </>
    );
  } catch (e) {
    // Fallback in case of regex issues
    return text;
  }
}
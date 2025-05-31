'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RecentPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts for homepage');
        const response = await fetch('/api/posts?limit=6');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        console.log(`Fetched ${data.posts?.length} posts`);
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <PostsLoadingPlaceholder />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">Error loading posts: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-blue-600 underline mt-2"
        >
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No posts available.</p>
        <Link href="/admin/login" className="text-blue-600 underline mt-2 inline-block">
          Login as admin to add posts
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link 
          href={`/post/${post._id}`} 
          key={post._id}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48 w-full">
            {post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover rounded-t-lg"
              />
            ) : (
              <div className="h-full w-full bg-gray-200 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mb-2 capitalize">
              {post.category}
            </span>
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
            <div className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Loading placeholder component
function PostsLoadingPlaceholder() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow animate-pulse">
          <div className="h-48 bg-gray-200 rounded-t-lg"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
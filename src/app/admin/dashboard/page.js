"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'business'
  });
  const router = useRouter();

  // Check authentication - redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  // Load posts from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosts = localStorage.getItem('news-posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      } else {
        // Default posts if none exist
        const defaultPosts = [
          {
            id: '1',
            title: 'Sample Post Title',
            content: 'This is a sample post content.',
            category: 'tech',
            createdAt: new Date().toISOString(),
            comments: []
          }
        ];
        setPosts(defaultPosts);
        localStorage.setItem('news-posts', JSON.stringify(defaultPosts));
      }
    }
  }, []);

  const categories = [
    'business', 'tech', 'weather', 'automotive', 'pakistan', 
    'global', 'health', 'sports', 'islam', 'education', 'entertainment'
  ];

  // Save posts to localStorage
  const savePosts = (updatedPosts) => {
    setPosts(updatedPosts);
    localStorage.setItem('news-posts', JSON.stringify(updatedPosts));
  };

  const addPost = (post) => {
    const newPost = {
      id: Date.now().toString(),
      ...post,
      createdAt: new Date().toISOString(),
      comments: []
    };
    const updatedPosts = [...posts, newPost];
    savePosts(updatedPosts);
  };

  const updatePost = (id, updatedPost) => {
    const updatedPosts = posts.map(post => 
      post.id === id ? { ...post, ...updatedPost } : post
    );
    savePosts(updatedPosts);
  };

  const deletePost = (id) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    savePosts(updatedPosts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPost) {
      updatePost(editingPost.id, formData);
    } else {
      addPost(formData);
    }
    setFormData({ title: '', content: '', category: 'business' });
    setShowForm(false);
    setEditingPost(null);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  // Show loading spinner while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Only render for authenticated admin users
  if (status === 'authenticated' && session?.user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          

          {/* Post Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="capitalize">{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingPost(null);
                        setFormData({ title: '', content: '', category: 'business' });
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editingPost ? 'Update' : 'Create'} Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">All Posts ({posts.length})</h2>
            </div>
            <div className="divide-y">
              {posts.map(post => (
                <div key={post.id} className="p-6 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-2">
                      {post.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize mr-4">
                        {post.category}
                      </span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="ml-4">{post.comments?.length || 0} comments</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Link
                      href={`/post/${post.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No posts found. Create your first post!
                </div>
              )}
            </div>
          </div>

          {/* Admin Overview Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">Admin Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Stats Cards */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-2">Total Posts</h3>
                <p className="text-3xl font-bold">{posts.length}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-2">Pending Approvals</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-2">Users</h3>
                <p className="text-3xl font-bold">1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Return null while redirecting - this should never render
  return null;
}

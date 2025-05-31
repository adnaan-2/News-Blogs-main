"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, FileText, Users, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);
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

  // Fetch posts and dashboard statistics
  useEffect(() => {
    async function fetchData() {
      if (status === 'authenticated' && session?.user?.role === 'admin') {
        setLoading(true);
        
        try {
          // Fetch posts
          const postsResponse = await fetch('/api/posts');
          if (postsResponse.ok) {
            const postsData = await postsResponse.json();
            setPosts(postsData.posts || []);
          }
          
          // Fetch dashboard statistics
          const statsResponse = await fetch('/api/admin/stats');
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats({
              totalPosts: statsData.stats.totalPosts || 0,
              totalUsers: statsData.stats.totalUsers || 0,
              pendingApprovals: statsData.stats.pendingApprovals || 0
            });
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchData();
  }, [status, session]);

  const categories = [
    'business', 'tech', 'weather', 'automotive', 'pakistan', 
    'global', 'health', 'sports', 'islam', 'education', 'entertainment'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPost) {
        // Update existing post
        const response = await fetch(`/api/posts/${editingPost._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Failed to update post');
        }
      } else {
        // Create new post - redirect to the create post page instead
        router.push('/admin/posts/create');
        return;
      }
      
      // Refresh posts list
      const postsResponse = await fetch('/api/posts');
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(postsData.posts || []);
      }
      
      // Reset form
      setFormData({ title: '', content: '', category: 'business' });
      setShowForm(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    }
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete post');
        }
        
        // Remove from local state
        setPosts(posts.filter(post => post._id !== id));
        
        // Update statistics
        setStats(prev => ({
          ...prev,
          totalPosts: Math.max(0, prev.totalPosts - 1)
        }));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  // Show loading spinner while checking authentication
  if (status === 'loading' || loading) {
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
          {/* Header with action buttons */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <Link 
                href="/admin/posts/create" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 px-4 py-2"
              >
                Log Out
              </button>
            </div>
          </div>
          
          {/* Admin Overview Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Stats Cards */}
              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-500">Total Posts</h3>
                  <p className="text-3xl font-bold">{stats.totalPosts}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-500">Pending Approvals</h3>
                  <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-500">Users</h3>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
          </div>

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
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Posts ({posts.length})</h2>
              <Link 
                href="/admin/posts/create" 
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
              >
                <Plus className="w-3 h-3 mr-1" />
                New Post
              </Link>
            </div>
            <div className="divide-y">
              {posts.map(post => (
                <div key={post._id} className="p-6 flex justify-between items-start">
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
                      href={`/post/${post._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      target="_blank"
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
                      onClick={() => handleDelete(post._id)}
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
        </div>
      </div>
    );
  }

  // Return null while redirecting - this should never render
  return null;
}

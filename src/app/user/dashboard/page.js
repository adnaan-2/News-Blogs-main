'use client'

import Link from 'next/link'

export default function UserDashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">User Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">My Posts</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Published</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Pending</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link 
              href="/user/posts/create" 
              className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700"
            >
              Create New Post
            </Link>
            <Link 
              href="/user/posts" 
              className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700"
            >
              View My Posts
            </Link>
          </div>
        </div>
        
        {/* Post Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Recent Posts</h3>
          <p className="text-gray-500">You haven't created any posts yet.</p>
        </div>
      </div>
    </div>
  )
}
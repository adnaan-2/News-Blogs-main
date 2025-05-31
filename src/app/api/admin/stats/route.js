import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'
import User from '@/models/User'

export async function GET(request) {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    
    // Connect to database
    await connectDB()
    
    // Get statistics
    const totalPosts = await Post.countDocuments()
    const totalUsers = await User.countDocuments()
    const pendingApprovals = await Post.countDocuments({ status: 'pending' }) // Assuming posts have a status field
    
    // Get posts by category
    const categories = ['business', 'tech', 'weather', 'automotive', 'pakistan', 
      'global', 'health', 'sports', 'islam', 'education', 'entertainment']
    
    const postsByCategory = {}
    
    // Count posts for each category
    for (const category of categories) {
      const count = await Post.countDocuments({ category })
      postsByCategory[category] = count
    }
    
    // Get recent activity (last 5 posts)
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name email')
      .lean()
    
    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt')
      .lean()
    
    return NextResponse.json({ 
      stats: {
        totalPosts,
        totalUsers,
        pendingApprovals
      },
      postsByCategory,
      recentPosts,
      recentUsers
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { message: 'Error fetching admin statistics', error: error.message },
      { status: 500 }
    )
  }
}
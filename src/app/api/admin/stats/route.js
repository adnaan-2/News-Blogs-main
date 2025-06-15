import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();

    // Get basic stats
    const totalPosts = await Post.countDocuments();
    const totalUsers = await User.countDocuments();

    // Get posts by category
    const postsByCategory = await Post.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get recent posts with proper author handling
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title content category createdAt author')
      .lean(); // Use lean() for better performance

    // Process recent posts to handle author field properly
    const processedRecentPosts = recentPosts.map(post => ({
      ...post,
      author: typeof post.author === 'string' ? { name: post.author } : post.author || { name: 'Admin' }
    }));

    // Get posts published in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPostsCount = await Post.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get most popular posts (assuming you have likes/views field)
    const popularPosts = await Post.find()
      .sort({ likes: -1, views: -1, createdAt: -1 })
      .limit(5)
      .select('title likes views createdAt category')
      .lean();

    // Get posts by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const postsByMonth = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: {
              format: '%Y-%m',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: 1
                }
              }
            }
          },
          count: 1
        }
      }
    ]);

    // Calculate growth rate
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const lastMonthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });

    const thisMonthPosts = await Post.countDocuments({
      createdAt: { $gte: thisMonthStart }
    });

    const growthRate = lastMonthPosts > 0 
      ? ((thisMonthPosts - lastMonthPosts) / lastMonthPosts * 100).toFixed(1)
      : 0;

    const stats = {
      totalPosts,
      totalUsers,
      recentPostsCount,
      growthRate: parseFloat(growthRate),
      postsByCategory: postsByCategory || [],
      recentPosts: processedRecentPosts || [],
      popularPosts: popularPosts || [],
      postsByMonth: postsByMonth || [],
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    
    // Return a fallback response instead of throwing
    return NextResponse.json({
      totalPosts: 0,
      totalUsers: 0,
      recentPostsCount: 0,
      growthRate: 0,
      postsByCategory: [],
      recentPosts: [],
      popularPosts: [],
      postsByMonth: [],
      error: 'Failed to fetch stats',
      lastUpdated: new Date().toISOString()
    }, { status: 500 });
  }
}
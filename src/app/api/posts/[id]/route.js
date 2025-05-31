import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid post ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find the post by ID
    const post = await Post.findById(id).lean();
    
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { message: 'Error fetching post', error: error.message },
      { status: 500 }
    );
  }
}
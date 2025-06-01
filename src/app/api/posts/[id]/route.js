import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import mongoose from 'mongoose';

// API route handlers only - no React components here

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    await dbConnect();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    // Find post by ID
    const post = await Post.findById(id).populate('author', 'name email');
    
    // Return 404 if post not found
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Return post data
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  
  try {
    await dbConnect();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    // Find post to verify it exists
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Process form data (multipart form)
    const formData = await request.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const category = formData.get('category');
    const image = formData.get('image');
    
    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content and category are required' },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const updateData = {
      title,
      content,
      category,
      updatedAt: new Date()
    };
    
    // Handle image upload if provided
    if (image && image instanceof File) {
      // For now, we'll keep existing image URL
      // In a real implementation, you would upload the image and update the URL
      console.log('Image received:', image.name, image.size);
    }
    
    // Update post in database using Mongoose
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // Return updated document
    );
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found or not updated' }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({ 
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  
  try {
    await dbConnect();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    // Delete post by ID using Mongoose
    const deletedPost = await Post.findByIdAndDelete(id);
    
    if (!deletedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
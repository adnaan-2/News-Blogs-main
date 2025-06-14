import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
      try {
        // Convert the file to buffer
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Create a base64 string from buffer
        const base64String = buffer.toString('base64');
        const dataURI = `data:${image.type};base64,${base64String}`;
        
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            dataURI,
            {
              folder: 'news-blog',
              resource_type: 'image'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
        });
        
        // Add image URL to update data
        updateData.imageUrl = result.secure_url;
        
        // If there was an existing image, we could delete it from Cloudinary here
        // For simplicity, we're skipping that step
        
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        // Continue with update but without changing the image
      }
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
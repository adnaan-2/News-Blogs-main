import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    console.log("GET /api/posts - Fetching posts");
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 10;
    
    let query = {};
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    console.log('API query:', query);
    
    // Get posts
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    console.log(`Found ${posts.length} posts`);
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { message: 'Error fetching posts', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check authentication
    const { formData, token } = await validateRequest(request);
    
    // Connect to database
    await connectDB();
    
    let imageUrl = null;
    
    // Upload image to Cloudinary if provided
    if (formData.image) {
      imageUrl = await uploadImage(formData.image);
    }

    // Generate a fixed admin ID if not available
    const adminId = new mongoose.Types.ObjectId();
    
    // Create new post document
    const post = await Post.create({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      imageUrl,
      author: adminId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json(
      { message: 'Post created successfully', post }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { message: 'Error creating post', error: error.message },
      { status: 500 }
    );
  }
}

// Helper functions for POST
async function validateRequest(request) {
  // Parse form data
  const formData = await request.formData();
  
  const title = formData.get('title');
  const content = formData.get('content');
  const category = formData.get('category');
  const image = formData.get('image');
  
  // Validate required fields
  if (!title || !content || !category) {
    throw new Error('Title, content, and category are required');
  }
  
  return { 
    formData: { title, content, category, image },
    token: null // We don't need token validation for admin-only system
  };
}

async function uploadImage(imageFile) {
  // Your existing image upload code
  // Return the image URL or null
  return null;
}
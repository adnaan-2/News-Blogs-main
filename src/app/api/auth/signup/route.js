import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { name, email, password } = body
    
    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields" },
        { status: 400 }
      )
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      )
    }
    
    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'user' // Default role is user
    })
    
    // Admin check - for development, create the first admin
    const usersCount = await User.countDocuments()
    if (usersCount === 1) {
      user.role = 'admin'
      await user.save()
    }
    
    // Don't send password in response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
    
    return NextResponse.json(
      { success: true, message: "User registered successfully", user: userResponse },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    )
  }
}
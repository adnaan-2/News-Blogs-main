'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function UserLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user.role === 'admin') {
        // If admin, redirect to admin dashboard
        router.push('/admin/dashboard')
      }
    } else if (status === 'unauthenticated') {
      // If not logged in, redirect to login
      router.push('/auth/login')
    }
  }, [session, status, router])

  // Show loading if session is loading or redirecting
  if (status === 'loading' || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* User Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">User Dashboard</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/user/dashboard" className="block p-2 rounded hover:bg-blue-700">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/user/posts/create" className="block p-2 rounded hover:bg-blue-700">
                Create Post
              </Link>
            </li>
            <li>
              <Link href="/user/posts" className="block p-2 rounded hover:bg-blue-700">
                My Posts
              </Link>
            </li>
            <li>
              <Link href="/user/posts/status" className="block p-2 rounded hover:bg-blue-700">
                Post Status
              </Link>
            </li>
            <li className="pt-6">
              <Link href="/" className="block p-2 rounded hover:bg-blue-700">
                View Site
              </Link>
            </li>
            <li>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="block w-full text-left p-2 rounded hover:bg-blue-700 text-red-200"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow">
          <div className="mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
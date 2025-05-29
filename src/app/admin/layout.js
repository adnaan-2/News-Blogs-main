"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple authentication check
    if (status === 'authenticated') {
      if (session.user.role !== 'admin') {
        router.push('/');
      } else {
        setIsLoading(false);
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'authenticated' && session.user.role === 'admin') {
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Admin sidebar */}
        <div className="w-64 bg-gray-800 text-white">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/admin/dashboard" className="block p-2 rounded hover:bg-gray-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/posts/create" className="block p-2 rounded hover:bg-gray-700">
                  Create Post
                </Link>
              </li>
              <li>
                <Link href="/admin/posts" className="block p-2 rounded hover:bg-gray-700">
                  All Posts
                </Link>
              </li>
              <li className="pt-6">
                <Link href="/" className="block p-2 rounded hover:bg-gray-700">
                  View Site
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left p-2 rounded hover:bg-gray-700 text-red-400"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <header className="bg-white shadow">
            <div className="mx-auto px-4 py-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
    );
  }

  return null;
}
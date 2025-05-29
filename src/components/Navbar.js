'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const isAdmin = session?.user?.role === 'admin'

  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">NewsHub</Link>
          
          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Home</Link>
            <Link href="/business" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Business</Link>
            <Link href="/tech" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Tech</Link>
            <Link href="/weather" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Weather</Link>
            <Link href="/automotive" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Automotive</Link>
            <Link href="/pakistan" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Pakistan</Link>
            <Link href="/global" className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Global</Link>
            
            {/* Auth buttons */}
            <div className="ml-4 flex items-center">
              {session ? (
                <>
                  {/* If user is logged in */}
                  <span className="mr-2 text-sm">
                    Hi, {session.user.name}
                  </span>
                  
                  {/* Dashboard button - different for admin and regular user */}
                  <Link 
                    href={isAdmin ? '/admin/dashboard' : '/user/dashboard'} 
                    className={`${
                      isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white py-1 px-3 rounded text-sm mr-2`}
                  >
                    {isAdmin ? 'Admin' : 'Dashboard'}
                  </Link>
                  
                  <button 
                    onClick={() => signOut()} 
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* If user is not logged in */}
                  <Link href="/auth/login" className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm mr-2">
                    Login
                  </Link>
                  <Link href="/auth/signup" className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm">
                    Signup
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Home</Link>
              <Link href="/business" className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Business</Link>
              <Link href="/tech" className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Tech</Link>
              <Link href="/weather" className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Weather</Link>
              <Link href="/automotive" className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Automotive</Link>
              <Link href="/pakistan" className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Pakistan</Link>
              <Link href="/global" className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium">Global</Link>
              
              {/* Auth buttons for mobile */}
              <div className="pt-4 flex flex-col space-y-2">
                {session ? (
                  <>
                    <span className="text-sm">
                      Hi, {session.user.name}
                    </span>
                    <Link 
                      href={isAdmin ? '/admin/dashboard' : '/user/dashboard'} 
                      className={`${
                        isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                      } text-white py-2 px-4 rounded text-center text-sm`}
                    >
                      {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                    </Link>
                    <button 
                      onClick={() => signOut()} 
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-center text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center text-sm">
                      Login
                    </Link>
                    <Link href="/auth/signup" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-center text-sm">
                      Signup
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
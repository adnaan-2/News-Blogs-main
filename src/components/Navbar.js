'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lifestyleDropdownOpen, setLifestyleDropdownOpen] = useState(false)
  const { data: session } = useSession()

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleLifestyleDropdown = () => {
    setLifestyleDropdownOpen(!lifestyleDropdownOpen)
  }

  const isAdmin = session?.user?.role === 'admin'

  return (
    <div className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">NewsHub</Link>
          
          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
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
            
            {/* Lifestyle dropdown menu */}
            <div className="relative">
              <button 
                onClick={toggleLifestyleDropdown}
                className="py-3 px-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium flex items-center"
                aria-expanded={lifestyleDropdownOpen}
              >
                Lifestyle <ChevronDown size={16} className="ml-1" />
              </button>
              
              {lifestyleDropdownOpen && (
                <div className="absolute top-full left-0 bg-gray-800 py-2 w-48 shadow-xl rounded-b-md">
                  <Link href="/category/health" className="block px-4 py-2 hover:bg-gray-700 text-sm">Health</Link>
                  <Link href="/category/sports" className="block px-4 py-2 hover:bg-gray-700 text-sm">Sports</Link>
                  <Link href="/category/entertainment" className="block px-4 py-2 hover:bg-gray-700 text-sm">Entertainment</Link>
                  <Link href="/category/education" className="block px-4 py-2 hover:bg-gray-700 text-sm">Education</Link>
                  <Link href="/category/islam" className="block px-4 py-2 hover:bg-gray-700 text-sm">Religion</Link>
                </div>
              )}
            </div>
            
            {/* Auth area */}
            <div className="ml-4 flex items-center">
              {session ? (
                <>
                  {/* If user is logged in */}
                  <span className="mr-2 text-sm">
                    Hi, {session.user.name || 'Admin'}
                  </span>
                  
                  {/* Dashboard button - only for admin */}
                  <Link 
                    href="/admin/dashboard" 
                    className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm mr-2"
                  >
                    Admin
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
                  {/* Just a simple text link for admin login, not a button */}
                  <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white">
                    
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
              <Link 
                href="/" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/business" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Business
              </Link>
              <Link 
                href="/tech" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tech
              </Link>
              <Link 
                href="/weather" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Weather
              </Link>
              <Link 
                href="/automotive" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Automotive
              </Link>
              <Link 
                href="/pakistan" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pakistan
              </Link>
              <Link 
                href="/global" 
                className="py-2 hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Global
              </Link>
              
              {/* Lifestyle section in mobile menu */}
              <div className="py-2">
                <button 
                  className="flex items-center justify-between w-full hover:text-gray-300 transition-colors uppercase text-sm font-medium"
                  onClick={() => setLifestyleDropdownOpen(!lifestyleDropdownOpen)}
                >
                  Lifestyle
                  <ChevronDown size={16} className={`transform transition-transform ${lifestyleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {lifestyleDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2 border-l border-gray-700">
                    <Link 
                      href="/category/health" 
                      className="block py-2 hover:text-gray-300 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Health
                    </Link>
                    <Link 
                      href="/category/sports" 
                      className="block py-2 hover:text-gray-300 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sports
                    </Link>
                    <Link 
                      href="/category/entertainment" 
                      className="block py-2 hover:text-gray-300 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Entertainment
                    </Link>
                    <Link 
                      href="/category/education" 
                      className="block py-2 hover:text-gray-300 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Education
                    </Link>
                    <Link 
                      href="/category/islam" 
                      className="block py-2 hover:text-gray-300 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Religion
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Auth area for mobile */}
              <div className="pt-4 flex flex-col space-y-2">
                {session ? (
                  <>
                    <span className="text-sm">
                      Hi, {session.user.name || 'Admin'}
                    </span>
                    <Link 
                      href="/admin/dashboard"
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded text-center text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }} 
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-center text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* Simple text link for admin in mobile view too */}
                    <Link 
                      href="/auth/login" 
                      className="text-gray-300 hover:text-white text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      
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
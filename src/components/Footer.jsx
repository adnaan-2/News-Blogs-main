'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Youtube, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');
  
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubscribeStatus('Please enter a valid email address');
      return;
    }
    
    try {
      setSubscribeStatus('Subscribing...');
      // Replace with your actual subscription endpoint
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubscribeStatus('Thank you for subscribing!');
        setEmail('');
      } else {
        setSubscribeStatus(data.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      setSubscribeStatus('Subscription failed. Please try again.');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Logo and Description */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <h2 className="text-white text-3xl font-bold">News Blogs</h2>
            </Link>
            
            <p className="mb-4 text-gray-400 max-w-lg">
              News Blogs is the premier and most trustworthy resource for all happenings in
              technology, politics, business, sports, healthcare, education, and entertainment news.
            </p>
            
            <p className="text-gray-400 max-w-lg">
              Whether it's the top trending news, inside scoops or features, interviews, market trends
              and analysis, product reviews, how-to's or tutorials – we cover it all.
            </p>
          </div>
          
          {/* Right Column - Newsletter and Social */}
          <div>
            <div className="mb-6">
              <h3 className="text-white text-xl font-semibold mb-4">Follow Us</h3>
              
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="px-4 py-2 flex-1 bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                >
                  Subscribe
                </button>
              </form>
              
              {subscribeStatus && (
                <p className={`mt-2 text-sm ${subscribeStatus.includes('Thank you') ? 'text-green-400' : 'text-red-400'}`}>
                  {subscribeStatus}
                </p>
              )}
            </div>
            
            <div>
              <div className="flex flex-wrap gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                   className="bg-gray-800 hover:bg-blue-600 transition-colors h-10 w-10 flex items-center justify-center">
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                   className="bg-gray-800 hover:bg-blue-400 transition-colors h-10 w-10 flex items-center justify-center">
                  <Twitter size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                   className="bg-gray-800 hover:bg-blue-700 transition-colors h-10 w-10 flex items-center justify-center">
                  <Linkedin size={20} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                   className="bg-gray-800 hover:bg-red-600 transition-colors h-10 w-10 flex items-center justify-center">
                  <Youtube size={20} />
                </a>
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" aria-label="Android App"
                   className="bg-gray-800 hover:bg-green-600 transition-colors h-10 w-10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                    <path d="M12 8.5v7"></path>
                    <path d="M8.5 12h7"></path>
                  </svg>
                </a>
                <a href="https://apple.com/app-store" target="_blank" rel="noopener noreferrer" aria-label="iOS App"
                   className="bg-gray-800 hover:bg-gray-600 transition-colors h-10 w-10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20.94c1.5 0 2.75-.75 4-1.5 1.25-.76 2.25-1.75 2.75-3.5-1.25 0-2.75 0-3.75-1.5-.25-.5-.25-1-.25-1.5h4.5c1.25 0 2.25-1.25 2.25-2.5s-1-2.25-2.25-2.75c-.5-2.25-2.25-3.75-4.5-3.75-1.5 0-2.75.75-3.75 1.5-.5.5-1 1-1.25 1.75-.25.5-.25 1.25-.25 1.75"></path>
                    <path d="M12 4c-4 2-4 6.5-4 8.25"></path>
                    <path d="M9 12c-2.25 0-4.25 1.25-4.75 3.25-.25 1 0 2 .5 2.75.5.75 1.25 1.5 2.25 1.75.5.25 1 .25 1.5.25"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Categories Links */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-4">News Categories</h4>
              <ul className="space-y-2">
                <li><Link href="/category/technology" className="text-gray-400 hover:text-white">Technology</Link></li>
                <li><Link href="/category/business" className="text-gray-400 hover:text-white">Business</Link></li>
                <li><Link href="/category/education" className="text-gray-400 hover:text-white">Education</Link></li>
                <li><Link href="/category/sports" className="text-gray-400 hover:text-white">Sports</Link></li>
                <li><Link href="/category/entertainment" className="text-gray-400 hover:text-white">Entertainment</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Top Stories</h4>
              <ul className="space-y-2">
                <li><Link href="/trending" className="text-gray-400 hover:text-white">Trending News</Link></li>
                <li><Link href="/featured" className="text-gray-400 hover:text-white">Featured Articles</Link></li>
                <li><Link href="/reviews" className="text-gray-400 hover:text-white">Reviews</Link></li>
                <li><Link href="/interviews" className="text-gray-400 hover:text-white">Interviews</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/advertise" className="text-gray-400 hover:text-white">Advertise</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} News Blogs. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
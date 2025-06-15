'use client'

import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  
  // Use current URL if not provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check out this post';
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium text-gray-700">Share:</span>
      
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook size={18} />
      </a>
      
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-sky-500 hover:bg-sky-50 rounded-full transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter size={18} />
      </a>
      
      <a 
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </a>
      
      <button
        onClick={handleCopyLink}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1"
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check size={18} className="text-green-500" />
            <span className="text-xs text-green-500">Copied!</span>
          </>
        ) : (
          <LinkIcon size={18} />
        )}
      </button>
    </div>
  );
}
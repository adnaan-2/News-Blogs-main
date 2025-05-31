import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RecentPosts from '@/components/RecentPosts';

export const metadata = {
  title: 'News Blog - Latest News and Articles',
  description: 'Stay updated with the latest news across various categories.'
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      

      {/* Recent Posts Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Latest Articles</h2>
          <Suspense fallback={<PostsLoadingPlaceholder />}>
            <RecentPosts />
          </Suspense>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(category => (
              <Link 
                key={category.name} 
                href={`/category/${category.name}`}
                className="group bg-white rounded-lg shadow hover:shadow-md transition-all p-6 text-center"
              >
                <div className="text-blue-600 mb-3 flex justify-center">
                  {category.icon}
                </div>
                <h3 className="font-medium text-lg capitalize group-hover:text-blue-600">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// Loading placeholder
function PostsLoadingPlaceholder() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-white rounded-lg shadow animate-pulse">
          <div className="h-48 bg-gray-200 rounded-t-lg"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Category icons (simplified)
const categories = [
  { name: 'business', icon: <span>💼</span> },
  { name: 'tech', icon: <span>💻</span> },
  { name: 'weather', icon: <span>🌦️</span> },
  { name: 'automotive', icon: <span>🚗</span> },
  { name: 'global', icon: <span>🌎</span> },
  { name: 'health', icon: <span>⚕️</span> },
  { name: 'sports', icon: <span>🏆</span> },
  { name: 'education', icon: <span>📚</span> }
];
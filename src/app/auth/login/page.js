"use client";

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: 'admin@example.com',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status, data: session } = useSession();

  // Improved redirect logic
  useEffect(() => {
    // Only redirect if authenticated and user has admin role
    if (status === 'authenticated') {
      console.log('✅ User authenticated, session:', session);
      
      if (session?.user?.role === 'admin') {
        console.log('✅ Admin user detected, redirecting to dashboard');
        router.push('/admin/dashboard');
      } else {
        console.log('❌ Not an admin user:', session?.user);
        setError('You do not have admin privileges');
      }
    }
  }, [status, session, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login with:', formData.email);
      
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      console.log('🔍 Login result:', result);

      if (result?.error) {
        setError(result.error === 'CredentialsSignin' ? 
          'Invalid email or password' : result.error);
      } else if (result?.ok) {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <button 
              type="button"
              onClick={() => setFormData({
                email: 'admin@example.com',
                password: 'secureadminpassword123'
              })}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Use default admin credentials
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Default admin: admin@example.com / secureadminpassword123
          </p>
        </div>
      </div>
    </div>
  );
}
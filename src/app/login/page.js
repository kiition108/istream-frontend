'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import authStorage from '@/utils/authStorage';
import { userService } from '@/api';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import AuthDivider from '@/components/auth/AuthDivider';
import { useAuth } from '@/app/contexts/Authcontext';


export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Login attempt started...'); // Debug log
      const response = await userService.login({ email: form.email, password: form.password });
      console.log('Login response:', response); // Debug log

      if (response.success || response.statusCode === 200) {
        const userData = response.data.user;
        const token = response.data.accessToken || response.data.token;

        console.log('Saving user data...'); // Debug log
        
        // Save to storage first - Critical for mobile/incognito
        if (token) {
          console.log('Saving token...'); // Debug log
          authStorage.setToken(token);
          
          // Verify token was saved - retry if failed (important for mobile/incognito)
          let retries = 3;
          let savedToken = authStorage.getToken();
          while (!savedToken && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
            authStorage.setToken(token);
            savedToken = authStorage.getToken();
            retries--;
          }
          console.log('Token saved successfully:', !!savedToken); // Debug log
          
          if (!savedToken) {
            throw new Error('Failed to save authentication token. Please check browser settings.');
          }
        } else {
          throw new Error('No authentication token received from server.');
        }
        
        authStorage.setUser(userData);
        
        // Verify user data was saved
        const savedUser = authStorage.getUser();
        if (!savedUser) {
          throw new Error('Failed to save user data. Please check browser settings.');
        }
        
        // Update context state AFTER verifying storage
        setUser(userData);
        
        // Longer delay for mobile browsers to ensure storage is persisted
        await new Promise(resolve => setTimeout(resolve, 500));
        
        router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      toast.error(errorMsg)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] relative overflow-hidden px-4 py-8">
      {/* Background decorative elements - Improved Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-black pointer-events-none z-0"></div>

      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] z-0"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] z-0"></div>

      <div className="relative w-full max-w-md z-10">
        {/* Card */}
        <div className="bg-[#1f1f1f]/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/30">
                <LogIn size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-secondary border-border rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-300 group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <Link 
                href="/forgot-password" 
                className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <AuthDivider />

          {/* Google Sign-In Button */}
          <GoogleSignInButton variant="signin" />

          {/* Register Link */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          By signing in, you agree to our{' '}
          <Link href="/terms-of-service" className="text-blue-400 hover:text-blue-300">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

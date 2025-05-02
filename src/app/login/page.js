'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/Authcontext';
import Link from 'next/link';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const response = await res.json();

      if (res.ok) {
        setMessage(response.message || 'Login successful');
        setMessageType('success');
        setUser(response.data.user);
        localStorage.setItem('token', response.data.accessToken);
        setTimeout(() => router.push('/'), 1000);
      } else {
        setMessage(response.message || 'Login failed');
        setMessageType('error');
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign In to Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
        <div className="mb-4">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
  <input
    type="email"
    id="email"
    name="email"
    placeholder="you@example.com"
    value={form.email}
    onChange={handleChange}
    required
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

<div className="mb-4">
  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      id="password"
      name="password"
      placeholder="Enter your password"
      value={form.password}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
      tabIndex={-1}
      aria-label="Toggle password visibility"
    >
      {showPassword ? '🙈' : '👁️'}
    </button>
  </div>
</div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>
          <div className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex justify-center items-center"
          >
            {loading ? (
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
            ) : (
              'Login'
            )}
          </button>
        </form>

        {message && (
          <div
            className={`text-center mt-4 text-sm font-medium ${
              messageType === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

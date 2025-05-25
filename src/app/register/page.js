'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpIcon,PaperClipIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    avatar: null,
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const router = useRouter();
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'avatar') {
      const file = files[0];
      setForm({ ...form, avatar: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setAvatarPreview(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('fullName', form.fullName);
    formData.append('username', form.username);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('avatar', form.avatar);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/register`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      toast.success(data.message || 'Registration successful!')
      setMessage(data.message || 'Registration successful!');
      const userId = data?.data?._id; // adjust this based on your API response structure

      if (userId) {
        router.push(`/verifyMe?userId=${userId}`);
      } else {
        toast.error('User ID missing in response');
        setMessage('User ID missing in response');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to register')
      setMessage('Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ToastContainer/>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className='block mb-1'>Profile Picture</label>
            <label htmlFor="avatar" className="cursor-pointer border rounded px-4 py-2 inline-flex bg-green-400 hover:bg-red-600">
            <PaperClipIcon className="w-6 h-6 text-white"/>🌄
            </label>
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              onChange={handleChange}
              required
              className="hidden"
            />
            {avatarPreview && (
              <div className="mt-3">
                <img src={avatarPreview} alt="Avatar Preview" className="h-20 w-20 object-cover rounded-full border" />
              </div>
            )}
          </div>

          <div className="mb-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 text-sm hover:underline">
              Login
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
              'Register'
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-4 text-sm text-center ${message.toLowerCase().includes('fail') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

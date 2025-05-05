'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function VerifyOtpForm({ userId }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error('OTP is required');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/verify-otp`, {
        userId,
        otp,
      });

      toast.success(res.data.message || 'Email verified successfully!');
      router.push('/login');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOtp} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <p className="text-gray-600 mb-4">Enter the OTP sent to your email.</p>
      
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </form>
  );
}

export default VerifyOtpForm;

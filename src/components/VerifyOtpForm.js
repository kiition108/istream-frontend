'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/verify-otp`, {
        userId,
        otp,
      });

      toast.success(res.data.message || 'Email verified successfully!');
      
      // Redirect to login after successful verification
      setTimeout(() => {
        router.push('/login');
      }, 500);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] relative overflow-hidden px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-black pointer-events-none z-0"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] z-0"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] z-0"></div>

      <div className="relative w-full max-w-md z-10">
        {/* Card */}
        <div className="bg-[#1f1f1f]/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/30 animate-pulse">
                <Mail size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Verify Your Email</h2>
            <p className="text-gray-400">We&apos;ve sent a 6-digit code to your email</p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {/* OTP Input */}
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  maxLength={6}
                  required
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-center text-2xl tracking-widest placeholder-gray-500 transition-all shadow-inner font-mono"
                />
              </div>
              <p className="text-xs text-gray-500 text-center">Code expires in 10 minutes</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
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
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Verify Email</span>
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-400">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                onClick={() => toast.info('Resend feature coming soon!')}
              >
                Resend
              </button>
            </p>

            <div className="pt-4 border-t border-border">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          By verifying your email, you agree to our{' '}
          <Link href="/terms-of-service" className="text-blue-400 hover:text-blue-300">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtpForm;
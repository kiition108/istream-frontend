'use client';

import VerifyOtpForm from '@/components/VerifyOtpForm';
import { useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId'); // e.g. from `?userId=123`

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {userId ? <VerifyOtpForm userId={userId} /> : <p>Invalid or missing user ID</p>}
    </div>
  );
}

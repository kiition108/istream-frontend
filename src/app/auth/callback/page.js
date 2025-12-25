'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import authStorage from '@/utils/authStorage';
import Loader from '@/components/Loader';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('processing'); // processing, success, error

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const accessToken = searchParams.get('accessToken');
                const refreshToken = searchParams.get('refreshToken');
                const error = searchParams.get('error');

                if (error) {
                    setStatus('error');
                    toast.error('Authentication failed. Please try again.');
                    setTimeout(() => router.push('/login'), 2000);
                    return;
                }

                if (!accessToken) {
                    setStatus('error');
                    toast.error('No access token received');
                    setTimeout(() => router.push('/login'), 2000);
                    return;
                }

                // Store tokens
                authStorage.setToken(accessToken);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }

                // Decode JWT to get user data (without verification - server already verified)
                try {
                    const base64Url = accessToken.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(
                        atob(base64)
                            .split('')
                            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                            .join('')
                    );

                    const userData = JSON.parse(jsonPayload);

                    // Store user data
                    authStorage.setUser({
                        _id: userData._id,
                        email: userData.email,
                        username: userData.username,
                        fullName: userData.fullName,
                    });

                    setStatus('success');
                    toast.success('Successfully signed in with Google!');

                    // Redirect to home - using replace to trigger AuthContext refresh
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 500);
                } catch (decodeError) {
                    setStatus('error');
                    toast.error('Failed to process authentication');
                    setTimeout(() => router.push('/login'), 2000);
                }
            } catch (err) {
                setStatus('error');
                toast.error('Authentication failed');
                setTimeout(() => router.push('/login'), 2000);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
            <div className="text-center">
                {status === 'processing' && (
                    <div className="space-y-4">
                        <Loader />
                        <p className="text-white text-lg">Completing sign-in...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <div className="text-green-500 text-6xl">✓</div>
                        <p className="text-white text-lg">Sign-in successful! Redirecting...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <div className="text-red-500 text-6xl">✗</div>
                        <p className="text-white text-lg">Authentication failed</p>
                        <p className="text-gray-400 text-sm">Redirecting to login...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

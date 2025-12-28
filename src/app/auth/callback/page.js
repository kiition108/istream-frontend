'use client'

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import authStorage from '@/utils/authStorage';
import { userService } from '@/api';
import { useAuth } from '@/app/contexts/Authcontext';
import Loader from '@/components/Loader';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser } = useAuth();
    const [status, setStatus] = useState('processing');
    const hasRun = useRef(false); // Prevent multiple executions

    useEffect(() => {
        // Prevent running multiple times
        if (hasRun.current) {
            return;
        }

        const handleCallback = async () => {
            hasRun.current = true; // Mark as run immediately

            try {
                // Check for tokens in URL query parameters (some OAuth flows)
                const accessTokenFromUrl = searchParams.get('accessToken');
                const refreshTokenFromUrl = searchParams.get('refreshToken');
                const error = searchParams.get('error');

                if (error) {
                    setStatus('error');
                    toast.error('Authentication failed. Please try again.');
                    setTimeout(() => router.push('/login'), 2000);
                    return;
                }

                // Store tokens from URL if provided
                if (accessTokenFromUrl) {
                    authStorage.setToken(accessTokenFromUrl);
                    if (refreshTokenFromUrl) {
                        localStorage.setItem('refreshToken', refreshTokenFromUrl);
                    }
                }

                // Now fetch user data from the API
                // If tokens are in cookies, axiosInstance will send them automatically
                try {
                    const response = await userService.getCurrentUser();

                    if (response.success || response.statusCode === 200) {
                        // Store user data in localStorage
                        authStorage.setUser(response.data);

                        // Update AuthContext state immediately
                        setUser(response.data);

                        // If we got a response, extract tokens from it if provided
                        if (response.data?.accessToken) {
                            authStorage.setToken(response.data.accessToken);
                        }

                        setStatus('success');
                        toast.success('Successfully signed in with Google!');

                        // Use Next.js router for navigation
                        setTimeout(() => {
                            router.push('/');
                        }, 500);
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                } catch (fetchError) {
                    setStatus('error');
                    toast.error('Failed to complete authentication');

                    // Clean up tokens on failure
                    authStorage.removeToken();
                    authStorage.removeUser();

                    setTimeout(() => router.push('/login'), 2000);
                }
            } catch (err) {
                setStatus('error');
                toast.error('Authentication failed');
                setTimeout(() => router.push('/login'), 2000);
            }
        };

        handleCallback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty deps - only run once on mount

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


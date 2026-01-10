'use client'

import { useState, useEffect } from 'react';
import authStorage from '@/utils/authStorage';

export default function DebugPage() {
    const [debugInfo, setDebugInfo] = useState({});

    useEffect(() => {
        const info = {
            // Browser info
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,

            // Screen info
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,

            // Protocol and security
            protocol: window.location.protocol,
            isSecure: window.location.protocol === 'https:',

            // Storage support
            localStorageSupported: typeof (Storage) !== "undefined",

            // Current auth state
            hasToken: !!authStorage.getToken(),
            hasUser: !!authStorage.getUser(),

            // Cookie test
            cookieTest: testCookie(),

            // LocalStorage test
            localStorageTest: testLocalStorage(),
        };

        setDebugInfo(info);
    }, []);

    function testCookie() {
        try {
            document.cookie = "test=test; path=/; SameSite=Lax";
            const result = document.cookie.includes("test=test");
            // Clean up
            document.cookie = "test=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            return result ? 'Pass' : 'Fail';
        } catch (e) {
            return `Error: ${e.message}`;
        }
    }

    function testLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            const result = localStorage.getItem('test') === 'test';
            localStorage.removeItem('test');
            return result ? 'Pass' : 'Fail';
        } catch (e) {
            return `Error: ${e.message}`;
        }
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Mobile Debug Information</h1>

                <div className="space-y-4">
                    {Object.entries(debugInfo).map(([key, value]) => (
                        <div key={key} className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-700">
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-blue-400">{key}:</span>
                                <span className="text-gray-300 text-right ml-4 break-all">
                                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                    <h2 className="text-xl font-bold mb-2 text-yellow-400">Instructions:</h2>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Take a screenshot of this page on your mobile device</li>
                        <li>Check if cookieTest and localStorageTest show "Pass"</li>
                        <li>Check if isSecure matches your environment (should be true for production)</li>
                        <li>Verify cookieEnabled is true</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

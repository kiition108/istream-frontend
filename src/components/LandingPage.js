'use client';

import Link from 'next/link';
import { Play, Upload, Users, Shield } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-transparent to-black/20">
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
                    <div className="relative p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl rotate-3 hover:rotate-6 transition-transform duration-300">
                        <Play size={64} className="text-white fill-current" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">iStream</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
                    The ultimate video streaming platform to discover, watch, and share your favorite moments with the world.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/login"
                        className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-xl"
                    >
                        Start Watching
                    </Link>
                    <Link
                        href="/register"
                        className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-transform transform hover:scale-105 border border-white/20"
                    >
                        Join Community
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8 px-4 py-16 max-w-7xl mx-auto">
                <div className="p-8 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-white/5 hover:border-blue-500/30 transition-colors">
                    <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                        <Play size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Stream Anywhere</h3>
                    <p className="text-gray-400">Watch high-quality videos on any device, anytime, anywhere without interruption.</p>
                </div>

                <div className="p-8 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-white/5 hover:border-purple-500/30 transition-colors">
                    <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                        <Upload size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Share Your Story</h3>
                    <p className="text-gray-400">Upload your own content, manage your channel, and build your audience easily.</p>
                </div>

                <div className="p-8 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-white/5 hover:border-pink-500/30 transition-colors">
                    <div className="bg-pink-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-pink-400">
                        <Users size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Connect Community</h3>
                    <p className="text-gray-400">Engage with creators and fans through comments, likes, and subscriptions.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5">
                <div className="flex justify-center gap-6 mb-4">
                    <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
                <p>&copy; {new Date().getFullYear()} iStream. All rights reserved.</p>
            </footer>
        </div>
    );
}

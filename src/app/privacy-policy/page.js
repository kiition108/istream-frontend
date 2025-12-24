'use client'

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Shield, Lock, Eye, UserCheck, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                            <Shield size={48} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-gray-400">Last updated: December 24, 2024</p>
                </div>

                {/* Content */}
                <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl p-8 space-y-8">
                    {/* Introduction */}
                    <section>
                        <p className="text-gray-300 leading-relaxed">
                            At iStream, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our video streaming platform.
                        </p>
                    </section>

                    {/* Section 1 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Eye size={24} className="text-blue-500" />
                            <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
                        </div>
                        <div className="space-y-4 text-gray-300">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                                <p>When you create an account, we collect:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                    <li>Email address</li>
                                    <li>Full name</li>
                                    <li>Username</li>
                                    <li>Profile picture (optional)</li>
                                    <li>Cover image (optional)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">OAuth Information</h3>
                                <p>When you sign in with Google, we receive:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                    <li>Your Google profile information (name, email, profile picture)</li>
                                    <li>Access tokens for authentication</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Content Information</h3>
                                <p>When you use our platform, we collect:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                    <li>Videos you upload</li>
                                    <li>Comments you post</li>
                                    <li>Channels you subscribe to</li>
                                    <li>Videos you watch (view history)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Usage Information</h3>
                                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                    <li>IP address</li>
                                    <li>Browser type and version</li>
                                    <li>Device information</li>
                                    <li>Pages visited and time spent</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Lock size={24} className="text-green-500" />
                            <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
                        </div>
                        <div className="text-gray-300 space-y-2">
                            <p>We use the collected information to:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Provide and maintain our service</li>
                                <li>Process your registration and authentication</li>
                                <li>Enable video uploads and streaming</li>
                                <li>Facilitate social features (comments, subscriptions)</li>
                                <li>Send service-related notifications</li>
                                <li>Improve our platform and user experience</li>
                                <li>Prevent fraud and ensure security</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <UserCheck size={24} className="text-purple-500" />
                            <h2 className="text-2xl font-bold text-white">Information Sharing</h2>
                        </div>
                        <div className="text-gray-300 space-y-2">
                            <p>We do not sell your personal information. We may share your information with:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>Other Users:</strong> Your public profile, videos, and comments are visible to other users</li>
                                <li><strong>Service Providers:</strong> Third-party services that help us operate our platform (hosting, analytics)</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Shield size={24} className="text-yellow-500" />
                            <h2 className="text-2xl font-bold text-white">Data Security</h2>
                        </div>
                        <p className="text-gray-300">
                            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <FileText size={24} className="text-red-500" />
                            <h2 className="text-2xl font-bold text-white">Your Rights</h2>
                        </div>
                        <div className="text-gray-300 space-y-2">
                            <p>You have the right to:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Access your personal information</li>
                                <li>Update or correct your information</li>
                                <li>Delete your account and associated data</li>
                                <li>Export your data</li>
                                <li>Withdraw consent for data processing</li>
                                <li>Object to certain data processing activities</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
                        <p className="text-gray-300">
                            We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Children&apos;s Privacy</h2>
                        <p className="text-gray-300">
                            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
                        <p className="text-gray-300">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="pt-6 border-t border-border">
                        <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="text-gray-300">
                            If you have any questions about this Privacy Policy, please contact us at:{' '}
                            <a href="mailto:privacy@istream.com" className="text-blue-400 hover:text-blue-300">
                                privacy@istream.com
                            </a>
                        </p>
                    </section>
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center">
                    <Link href="/terms-of-service" className="text-blue-400 hover:text-blue-300 mr-6">
                        Terms of Service
                    </Link>
                    <Link href="/" className="text-gray-400 hover:text-white">
                        Back to Home
                    </Link>
                </div>
            </div>
        </>
    );
}

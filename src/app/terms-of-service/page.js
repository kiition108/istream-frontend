'use client'

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Scale, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';

export default function TermsOfService() {
    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
                            <Scale size={48} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
                    <p className="text-gray-400">Last updated: December 24, 2024</p>
                </div>

                {/* Content */}
                <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl p-8 space-y-8">
                    {/* Introduction */}
                    <section>
                        <p className="text-gray-300 leading-relaxed">
                            Welcome to iStream. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
                        </p>
                    </section>

                    {/* Section 1 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle size={24} className="text-green-500" />
                            <h2 className="text-2xl font-bold text-white">Acceptance of Terms</h2>
                        </div>
                        <p className="text-gray-300">
                            By creating an account or using iStream, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use our platform.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <FileText size={24} className="text-blue-500" />
                            <h2 className="text-2xl font-bold text-white">User Accounts</h2>
                        </div>
                        <div className="text-gray-300 space-y-2">
                            <p>When creating an account, you must:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Provide accurate and complete information</li>
                                <li>Be at least 13 years of age</li>
                                <li>Maintain the security of your account credentials</li>
                                <li>Not impersonate others or create fake accounts</li>
                                <li>Use a unique username not already taken</li>
                            </ul>
                            <p className="mt-4">
                                You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.
                            </p>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle size={24} className="text-yellow-500" />
                            <h2 className="text-2xl font-bold text-white">Content Guidelines</h2>
                        </div>
                        <div className="text-gray-300 space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Allowed Content</h3>
                                <p>You may upload content that is:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Original or properly licensed</li>
                                    <li>Appropriate for a general audience</li>
                                    <li>Legal in your jurisdiction</li>
                                    <li>Respectful of others&apos; rights and dignity</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Prohibited Content</h3>
                                <p>You must not upload content that:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Infringes copyright, trademark, or other intellectual property rights</li>
                                    <li>Contains hate speech, harassment, or bullying</li>
                                    <li>Depicts or promotes violence or illegal activities</li>
                                    <li>Contains explicit sexual content or nudity</li>
                                    <li>Spreads misinformation or spam</li>
                                    <li>Violates privacy rights of others</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Scale size={24} className="text-purple-500" />
                            <h2 className="text-2xl font-bold text-white">Intellectual Property</h2>
                        </div>
                        <div className="text-gray-300 space-y-2">
                            <p>
                                <strong>Your Content:</strong> You retain all rights to content you upload. By uploading content, you grant iStream a worldwide, non-exclusive license to host, store, reproduce, and distribute your content.
                            </p>
                            <p>
                                <strong>Platform Content:</strong> The iStream platform, including its design, features, and code, is owned by iStream and protected by intellectual property laws.
                            </p>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <XCircle size={24} className="text-red-500" />
                            <h2 className="text-2xl font-bold text-white">Content Moderation</h2>
                        </div>
                        <div className="text-gray-300 space-y-2">
                            <p>We reserve the right to:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Review and moderate uploaded content</li>
                                <li>Remove content that violates these terms</li>
                                <li>Suspend or terminate accounts for violations</li>
                                <li>Report illegal content to authorities</li>
                            </ul>
                            <p className="mt-4">
                                Admin approval may be required before videos are published publicly.
                            </p>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">User Conduct</h2>
                        <div className="text-gray-300 space-y-2">
                            <p>You agree not to:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Use automated systems (bots) without permission</li>
                                <li>Attempt to hack or disrupt our services</li>
                                <li>Scrape or collect data from our platform</li>
                                <li>Manipulate views, likes, or other metrics</li>
                                <li>Spam comments or messages</li>
                                <li>Circumvent access restrictions or security measures</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
                        <p className="text-gray-300">
                            We may terminate or suspend your account at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to the platform or other users. You may also terminate your account at any time through your profile settings.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Disclaimers</h2>
                        <div className="text-gray-300 space-y-2">
                            <p>
                                iStream is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the platform will be:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Always available or uninterrupted</li>
                                <li>Error-free or secure</li>
                                <li>Free from viruses or harmful components</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                        <p className="text-gray-300">
                            To the maximum extent permitted by law, iStream shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
                        <p className="text-gray-300">
                            We reserve the right to modify these Terms at any time. We will notify users of significant changes by email or platform notification. Continued use after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="pt-6 border-t border-border">
                        <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="text-gray-300">
                            For questions about these Terms of Service, contact us at:{' '}
                            <a href="mailto:legal@istream.com" className="text-blue-400 hover:text-blue-300">
                                legal@istream.com
                            </a>
                        </p>
                    </section>
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center">
                    <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-300 mr-6">
                        Privacy Policy
                    </Link>
                    <Link href="/" className="text-gray-400 hover:text-white">
                        Back to Home
                    </Link>
                </div>
            </div>
        </>
    );
}

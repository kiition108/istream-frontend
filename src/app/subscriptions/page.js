'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/api';
import { Bell, BellOff, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import withAuth from '@/utils/withAuth';
import Image from 'next/image';


function SubscriptionsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [allSubscriptions, setAllSubscriptions] = useState([]);
    const [subscriptionStatus, setSubscriptionStatus] = useState(false);

    // Fetch subscriptions with React Query
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['subscriptions', page],
        queryFn: async () => {
            const res = await subscriptionService.getSubscriptions(page, 12);
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Fetch subscription status


    // Accumulate subscriptions when new page data arrives
    useEffect(() => {
        if (data) {
            setAllSubscriptions(prev => {
                if (page === 1) return data;
                const existingIds = new Set(prev.map(s => s._id));
                const newSubs = data.filter(s => !existingIds.has(s._id));
                return [...prev, ...newSubs];
            });
        }
    }, [data, page]);

    const hasNextPage = data?.message?.hasNextPage || false;

    const handleChannelClick = (username) => {
        router.push(`/Channel/${username}`);
    };

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-red-600 to-pink-600 rounded-full">
                            <Bell size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Subscriptions</h1>
                            <p className="text-gray-400">Channels you&apos;re subscribed to</p>
                        </div>
                    </div>

                    {/* Stats */}
                    {allSubscriptions.length > 0 && (
                        <div className="mt-4 bg-secondary/50 border border-border rounded-xl p-4 inline-flex items-center gap-2">
                            <Users size={20} className="text-blue-500" />
                            <span className="font-semibold text-white">{allSubscriptions.length}</span>
                            <span className="text-gray-400">subscriptions</span>
                        </div>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg mb-6">
                        Failed to load subscriptions. Please try again.
                    </div>
                )}

                {/* Subscriptions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {allSubscriptions.map((subscription) => {
                        const channel = subscription.channel;
                        return (
                            <div
                                key={subscription._id}
                                onClick={() => handleChannelClick(channel.username)}
                                className="group cursor-pointer"
                            >
                                <div className="bg-secondary/50 border border-border rounded-xl p-6 hover:bg-secondary transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
                                    {/* Avatar */}
                                    <div className="flex justify-center mb-4">
                                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-border group-hover:border-blue-500 transition-colors">
                                            {channel.avatar ? (
                                                <Image
                                                    src={channel.avatar}
                                                    alt={channel.username}
                                                    className="w-full h-full object-cover"
                                                    width={96}
                                                    height={96}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                                    {channel.username?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Channel Info */}
                                    <div className="text-center">
                                        <h3 className="font-semibold text-lg text-white mb-1 truncate group-hover:text-blue-400 transition-colors">
                                            @{channel.username}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-3">
                                            Channel ID: {channel._id.slice(-8)}
                                        </p>
                                    </div>

                                    {/* Subscribed Badge */}
                                    <div className="mt-4 flex justify-center">
                                        <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                                            <Bell size={12} />
                                            <span>Subscribed</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {!isLoading && !isFetching && allSubscriptions.length === 0 && (
                    <div className="text-center py-20">
                        <div className="flex justify-center mb-4">
                            <div className="p-6 bg-secondary/50 rounded-full">
                                <BellOff size={64} className="text-gray-500" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Subscriptions Yet</h3>
                        <p className="text-gray-400 mb-6">Start subscribing to channels to see them here</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-medium transition-all transform hover:scale-105"
                        >
                            Browse Channels
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && allSubscriptions.length === 0 && (
                    <div className="flex justify-center py-20">
                        <Loader />
                    </div>
                )}

                {/* Loading More */}
                {isFetching && allSubscriptions.length > 0 && (
                    <div className="flex justify-center p-8">
                        <Loader />
                    </div>
                )}

                {/* Load More Button */}
                {hasNextPage && !isFetching && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default withAuth(SubscriptionsPage);

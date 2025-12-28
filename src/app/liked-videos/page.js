'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import VideoCard from '@/components/VideoCard';
import Loader from '@/components/Loader';
import { userService } from '@/api';
import { ThumbsUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import withAuth from '@/utils/withAuth';

function LikedVideosPage() {
    const [page, setPage] = useState(1);
    const limit = 12;

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['likedVideos', page],
        queryFn: async () => {
            const res = await userService.getLikedVideos(page, limit);
            return res.data;
        },
        staleTime: 60000, // 1 minute
        keepPreviousData: true
    });

    const videos = data?.videos || (Array.isArray(data) ? data : []);
    const hasNextPage = data?.hasNextPage || (videos.length === limit);
    const hasPreviousPage = data?.hasPreviousPage || page > 1;

    if (isLoading && !data) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Failed to load liked videos.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <ThumbsUp size={32} className="text-blue-500" />
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Liked Videos</h1>
                </div>

                {/* Videos Grid */}
                {videos.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {videos.map((item) => {
                                // Handle both direct video object or wrapped in 'video' field
                                const video = item.video || item;
                                return (
                                    <VideoCard
                                        key={video._id}
                                        video={video}
                                    />
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {(hasNextPage || hasPreviousPage) && (
                            <div className="flex justify-center gap-4 mt-8">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={!hasPreviousPage || isFetching}
                                    className="px-6 py-2 bg-secondary hover:bg-border rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={!hasNextPage || isFetching}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {isFetching && (
                            <div className="flex justify-center mt-6">
                                <Loader />
                            </div>
                        )}
                    </>
                ) : (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <ThumbsUp size={64} className="mb-4 opacity-30" />
                        <p className="text-lg mb-2">No liked videos yet</p>
                        <p className="text-sm">Videos you like will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withAuth(LikedVideosPage);

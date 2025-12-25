'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import VideoCard from '@/components/VideoCard';
import Loader from '@/components/Loader';
import { videoService } from '@/api';
import { Search, Frown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    const [page, setPage] = useState(1);
    const limit = 12;

    // Reset page when query changes
    useEffect(() => {
        setPage(1);
    }, [q]);

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['searchVideos', q, page],
        queryFn: async () => {
            if (!q.trim()) return { docs: [] };
            const res = await videoService.searchVideos(q, page, limit);
            return res.data;
        },
        enabled: !!q,
        keepPreviousData: true
    });

    const videos = data?.videos || [];
    const hasNextPage = data?.pagination?.hasNextPage;
    const hasPreviousPage = data?.pagination?.hasPrevPage;
    const totalDocs = data?.pagination?.totalResults;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 mt-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                    <Search size={24} className="text-blue-500" />
                    <h1 className="text-2xl font-bold text-white">
                        Search results for <span className="text-blue-400">&quot;{q}&quot;</span>
                    </h1>
                    {data && (
                        <span className="text-sm text-gray-400 ml-auto">
                            {totalDocs || 0} results found
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center py-20 text-red-500">
                        Failed to load search results.
                    </div>
                ) : videos.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {videos.map((video) => (
                                <VideoCard key={video._id} video={video} />
                            ))}
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
                        <Frown size={64} className="mb-4 opacity-30" />
                        <p className="text-lg mb-2">No videos found for &quot;{q}&quot;</p>
                        <p className="text-sm">Try searching for something else</p>
                    </div>
                )}
            </div>
        </div>
    );
}

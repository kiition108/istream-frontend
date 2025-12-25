'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { History, Trash2, Clock, X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import VideoThumbnail from '@/components/VideoThumbnail'
import Loader from '@/components/Loader'
import { historyService } from '@/api'
import { toast } from 'react-toastify'

export default function HistoryPage() {
    const [page, setPage] = useState(1)
    const router = useRouter()
    const queryClient = useQueryClient()

    // Fetch watch history
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['watchHistory', page],
        queryFn: async () => {
            const res = await historyService.getWatchHistory(page, 12)
            // API response .data is the array of videos
            return res.data
        },
        staleTime: 1 * 60 * 1000, // 1 minute
    })

    const historyVideos = Array.isArray(data) ? data : []
    // Since API doesn't return pagination metadata, we infer next page availability
    const hasNextPage = historyVideos.length === 12
    const hasPreviousPage = page > 1

    // Clear all history mutation
    const clearHistoryMutation = useMutation({
        mutationFn: async () => {
            await historyService.clearWatchHistory()
        },
        onSuccess: () => {
            toast.success('Watch history cleared!')
            queryClient.invalidateQueries({ queryKey: ['watchHistory'] })
            setPage(1)
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to clear history')
        },
    })

    // Delete specific video from history mutation
    const deleteVideoMutation = useMutation({
        mutationFn: async (videoId) => {
            await historyService.deleteVideoFromHistory(videoId)
        },
        onMutate: async (videoId) => {
            await queryClient.cancelQueries({ queryKey: ['watchHistory', page] })
            const previousData = queryClient.getQueryData(['watchHistory', page])

            // Optimistically update
            queryClient.setQueryData(['watchHistory', page], (old) => {
                if (!old) return old
                // Filter the array directly
                return old.filter(item => {
                    const video = item.video || item
                    return video._id !== videoId
                })
            })

            return { previousData }
        },
        onError: (err, videoId, context) => {
            queryClient.setQueryData(['watchHistory', page], context.previousData)
            toast.error(err.response?.data?.message || 'Failed to remove video')
        },
        onSuccess: () => {
            toast.success('Video removed from history')
            queryClient.invalidateQueries({ queryKey: ['watchHistory'] })
        },
    })

    const handleClearHistory = () => {
        if (window.confirm('Are you sure you want to clear your watch history? This action cannot be undone.')) {
            clearHistoryMutation.mutate()
        }
    }

    const handleDeleteVideo = (videoId, videoTitle) => {
        if (window.confirm(`Remove "${videoTitle}" from watch history?`)) {
            deleteVideoMutation.mutate(videoId)
        }
    }

    const handleVideoClick = (videoId) => {
        router.push(`/watch/${videoId}`)
    }

    if (isLoading && !data) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <Loader />
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-[50vh] text-red-500">
                    Failed to load watch history
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <History size={32} className="text-blue-500" />
                        <h1 className="text-3xl md:text-4xl font-bold text-white">Watch History</h1>
                    </div>

                    {historyVideos.length > 0 && (
                        <button
                            onClick={handleClearHistory}
                            disabled={clearHistoryMutation.isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Trash2 size={18} />
                            Clear History
                        </button>
                    )}
                </div>

                {/* Videos Grid */}
                {historyVideos.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {historyVideos.map((video) => {
                                return (
                                    <div
                                        key={video._id}
                                        className="group relative"
                                    >
                                        {/* Delete Button Overlay */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteVideo(video._id, video.title)
                                            }}
                                            className="absolute top-2 right-2 z-10 p-2 bg-black/80 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                                            title="Remove from history"
                                        >
                                            <X size={18} className="text-white" />
                                        </button>

                                        <div
                                            onClick={() => handleVideoClick(video._id)}
                                            className="cursor-pointer"
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative mb-3">
                                                <VideoThumbnail
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    priority={false}
                                                    className="group-hover:scale-105 transition-transform duration-200"
                                                />

                                                {/* Duration badge */}
                                                {video.duration && (
                                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                                                        {video.duration}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Video Info */}
                                            <div className="px-1">
                                                <h3 className="font-semibold text-white line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">
                                                    {video.title}
                                                </h3>

                                                {/* Owner info */}
                                                {video.owner && (
                                                    <p className="text-sm text-gray-400 mb-1">
                                                        {video.owner.fullName || video.owner.username}
                                                    </p>
                                                )}

                                                {/* Views and date */}
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    {video.views !== undefined && (
                                                        <span>{video.views} views</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Pagination */}
                        {(hasNextPage || hasPreviousPage) && (
                            <div className="flex justify-center gap-4 mt-8">
                                {hasPreviousPage && (
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={isFetching}
                                        className="px-6 py-2 bg-secondary hover:bg-border rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                )}
                                {hasNextPage && (
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={isFetching}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Loading indicator */}
                        {isFetching && (
                            <div className="flex justify-center p-8">
                                <Loader />
                            </div>
                        )}
                    </>
                ) : (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                        <History size={64} className="mb-4 opacity-30" />
                        <p className="text-lg mb-2">No watch history yet</p>
                        <p className="text-sm">Videos you watch will appear here</p>
                    </div>
                )}
            </div>
        </>
    )
}

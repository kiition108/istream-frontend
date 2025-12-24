'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { toast } from 'react-toastify'
import axiosInstance from '@/utils/axiosInstance'
import { useAuth } from '@/app/contexts/Authcontext'
import Loader from '@/components/Loader'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import VideoThumbnail from '@/components/VideoThumbnail'
import { Play, Calendar } from 'lucide-react'
import { subscriptionService } from '@/api'

export default function ChannelPage() {
  const { username } = useParams();
  const [page, setPage] = useState(1)
  const [allVideos, setAllVideos] = useState([])
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  // Fetch channel data with React Query
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['channelProfile', username, page],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/v1/users/c/${username}?page=${page}&limit=12`)
      return res.data.data
    },
    enabled: !!username,
    staleTime: 3 * 60 * 1000, // 3 minutes
  })

  const channel = data || null
  const hasNextPage = data?.hasNextPage || false
  const hasPreviousPage = data?.hasPreviousPage || false

  // Accumulate videos when new page data arrives
  useEffect(() => {
    if (data?.uploadedVideos) {
      setAllVideos(prev => {
        if (page === 1) return data.uploadedVideos
        const existingIds = new Set(prev.map(v => v._id))
        const newVideos = data.uploadedVideos.filter(v => !existingIds.has(v._id))
        return [...prev, ...newVideos]
      })
    }
  }, [data, page])

  // Subscribe/Unsubscribe mutation with optimistic update
  const subscriptionMutation = useMutation({
    mutationFn: async (isSubscribed) => {
      if (isSubscribed) {
        await subscriptionService.unsubscribe(channel._id)
        return { action: 'unsubscribe' }
      } else {
        await subscriptionService.subscribe(channel._id)
        return { action: 'subscribe' }
      }
    },
    onMutate: async (isSubscribed) => {
      await queryClient.cancelQueries({ queryKey: ['channelProfile', username] })
      const previousData = queryClient.getQueryData(['channelProfile', username, page])

      queryClient.setQueryData(['channelProfile', username, page], (old) => {
        if (!old) return old
        return {
          ...old,
          isSubscribed: !isSubscribed,
          subscribersCount: isSubscribed ? old.subscribersCount - 1 : old.subscribersCount + 1,
        }
      })

      return { previousData }
    },
    onError: (err, isSubscribed, context) => {
      queryClient.setQueryData(['channelProfile', username, page], context.previousData)
      toast.error(err.response?.data?.message || "Something went wrong")
    },
    onSuccess: (data) => {
      toast.success(data.action === 'subscribe' ? 'Subscribed!' : 'Unsubscribed!')
    },
  })

  const toggleSubscribe = () => {
    if (!channel) return
    subscriptionMutation.mutate(channel.isSubscribed)
  }

  const handleView = (videoId) => {
    router.push(`/watch/${videoId}`)
  }

  // Prefetch next page
  const prefetchNextPage = () => {
    if (hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: ['channelProfile', username, page + 1],
        queryFn: async () => {
          const res = await axiosInstance.get(`/api/v1/users/c/${username}?page=${page + 1}&limit=12`)
          return res.data.data
        },
      })
    }
  }

  if (isLoading && !channel) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[50vh] text-red-500">
          Failed to load channel
        </div>
      </>
    )
  }

  if (!channel) return <Loader />

  return (
    <>
      <Navbar />
      <div className="w-full">
        {/* Cover Banner */}
        <div className="w-full h-48 md:h-64 relative bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
          {channel.coverImage ? (
            <Image
              src={channel.coverImage}
              alt="Channel Cover"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Play size={64} className="text-white/30" />
            </div>
          )}
        </div>

        {/* Channel Info Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Background container for better visibility */}
          <div className="bg-background/95 backdrop-blur-sm rounded-xl -mt-12 md:-mt-16 p-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative -mt-20 md:-mt-24">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-xl bg-gray-800">
                  {channel.avatar ? (
                    <Image
                      src={channel.avatar}
                      alt={channel.fullName}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                      {channel.fullName?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Channel Details */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {channel.fullName}
                </h1>
                <p className="text-gray-400 text-lg mb-3">@{channel.username}</p>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <strong className="text-white">{channel.subscribersCount}</strong> subscribers
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <strong className="text-white">{channel.videosCount || 0}</strong> videos
                  </span>
                </div>

                {channel.description && (
                  <p className="text-gray-300 text-sm max-w-3xl line-clamp-2">
                    {channel.description}
                  </p>
                )}
              </div>

              {/* Subscribe Button */}
              {!authLoading && user?.username !== channel.username && (
                <button
                  onClick={toggleSubscribe}
                  disabled={subscriptionMutation.isLoading}
                  className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 whitespace-nowrap ${channel.isSubscribed
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                    } ${subscriptionMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {subscriptionMutation.isLoading
                    ? 'Loading...'
                    : channel.isSubscribed
                      ? 'Subscribed'
                      : 'Subscribe'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="py-8 border-t border-border mt-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Play size={24} className="text-accent" />
            Videos
          </h2>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allVideos.map((video) => (
              <div
                key={video._id}
                onClick={() => handleView(video._id)}
                className="group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative mb-3">
                  <VideoThumbnail
                    src={video.thumbnail}
                    alt={video.title}
                    priority={false}
                    className="group-hover:scale-105 transition-transform duration-200"
                  />

                  {/* Duration badge - if you have duration in your data */}
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
                  <p className="text-sm text-gray-400 flex items-center gap-1 mb-1">
                    <Calendar size={14} />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                  {video.views !== undefined && (
                    <p className="text-sm text-gray-500">
                      {video.views} views
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {allVideos.length === 0 && !isFetching && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Play size={64} className="mb-4 opacity-30" />
              <p className="text-lg">No videos yet</p>
              <p className="text-sm">This channel hasn&apos;t uploaded any videos</p>
            </div>
          )}

          {/* Loading State */}
          {isFetching && allVideos.length > 0 && (
            <div className="flex justify-center p-8">
              <Loader />
            </div>
          )}

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
                  onClick={() => {
                    setPage(page + 1)
                    prefetchNextPage()
                  }}
                  onMouseEnter={prefetchNextPage}
                  disabled={isFetching}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}


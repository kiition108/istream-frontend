'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import axiosInstance from '@/utils/axiosInstance'
import ChannelSubscribeButton from './ChannelSubscribeButton'
import Loader from '@/components/Loader'

export default function ChannelHeader({ username }) {
  const [channel, setChannel] = useState(null)
  const [showMore, setShowMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchChannel = async () => {
      setLoading(true)
      setError(null)
      try {
        // Assuming userService.getChannelProfile is a new abstraction for API calls
        // For this change, I'll adapt the existing axiosInstance call to fit the new structure
        const res = await axiosInstance.get(`/api/v1/users/c/${username}`)
        setChannel(res.data.data)
      } catch (err) {
        setError('Failed to load channel')
      } finally {
        setLoading(false)
      }
    }
    if (username) {
      fetchChannel()
    }
  }, [username])

  if (loading) return <Loader />
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>
  if (!channel) return <div className="text-gray-500 text-center py-4">Channel not found.</div>

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Cover image */}
      <div className="w-full h-52 relative">
        <Image
          src={channel.coverImage || '/default-cover.jpg'}
          alt="Cover"
          fill
          className="object-cover rounded-t-lg"
        />
      </div>

      {/* Channel info row */}
      <div className="flex flex-col md:flex-row items-start justify-between p-4 bg-white shadow rounded-b-lg">
        <div className="flex gap-4">
          <Image
            src={channel.avatar || '/default-avatar.png'}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full object-cover border"
          />
          <div className="mt-1">
            <h1 className="text-xl font-semibold">{channel.fullName}</h1>
            <p className="text-gray-500">@{channel.username}</p>
            <p className="text-sm text-gray-600">
              {channel.subscribersCount} subscribers • {channel.videosCount || 0} videos
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <ChannelSubscribeButton username={username} />
        </div>
      </div>

      {/* Description */}
      {channel.description && (
        <div className="mt-4 px-4 max-w-5xl mx-auto">
          <button
            onClick={() => setShowMore((prev) => !prev)}
            className="text-blue-600 font-medium mb-1"
          >
            {showMore ? 'Hide Description' : 'Show Description'}
          </button>
          {showMore && <p className="text-gray-700 whitespace-pre-line">{channel.description}</p>}
        </div>
      )}
    </div>
  )
}

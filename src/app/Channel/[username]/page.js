'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'
import axiosInstance from '@/utils/axiosInstance'
import { useAuth } from '@/app/contexts/Authcontext'

export default function ChannelHeader() {
  const {username}= useParams();
  const [channel, setChannel] = useState(null)
  const [showMore, setShowMore] = useState(false)
  const [videos, setVideos]= useState([]);
  const [page, setPage] = useState(1)
  const {user}=useAuth()

  useEffect(() => {
    const fetchChannel = async (currentPage = 1) => {
      try {
        const res = await axios.get(`/api/v1/users/c/${username}?page=${currentPage}&limit=10`)
        setChannel(res.data.data)
        setVideos(res.data.data.uploadedVideos)
      } catch (err) {
        toast.error('Failed to load channel info', err)
      }
    }
    if (username) fetchChannel(page)
  }, [username,page])
  const toggleSubscribe = async () => {
    try {
      if (channel.isSubscribed) {
        await axiosInstance.delete(`/api/v1/subscriptions/${channel._id}`)
        setChannel(prev => ({
          ...prev,
          isSubscribed: false,
          subscribersCount: prev.subscribersCount - 1,
        }))
      } else {
        await axiosInstance.post(`/api/v1/subscriptions/${channel._id}`)
        setChannel(prev => ({
          ...prev,
          isSubscribed: true,
          subscribersCount: prev.subscribersCount + 1,
        }))
      }
    } catch (err) {
      toast.error(err.response.data.message||"Something went wrong")
    }
  }
  const handleView = (videoId) => {
     router.push(`/watch/${videoId}`)
  }
  

  if (!channel) return <p>Loading...</p>

  return (
    <>
    <Navbar/>
    <div className="w-full max-w-5xl mx-auto">
      {/* Cover image */}
      <div className="w-full h-52 relative mt-2">
        <Image
          src={channel.coverImage || '/default-cover.jpg'}
          alt="Cover"
          fill
          className="object-cover rounded-t-lg"
          priority
        />
      </div>

      {/* Channel info row */}
      <div className="flex flex-col md:flex-row items-start justify-between p-4 bg-white shadow rounded-b-lg">
        <div className="flex gap-4">
          <Image
            src={channel.avatar || '/default-avatar.png'}
            alt="Avatar"
            width={50}
            height={50}
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
        {/*Right side button to subscribe and unsubscribe*/}
        <div className="mt-4 md:mt-5">
        {user.username!==channel.username && <button
        onClick={toggleSubscribe}
        className={`px-5 py-2 text-sm font-semibold rounded-full transition duration-200 ${
          channel.isSubscribed
            ? 'bg-gray-200 text-black hover:bg-gray-300'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {channel.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>}
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

    {/*Channel videos*/}
    <div className="max-w-5xl mx-auto py-1">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="border rounded-lg shadow p-4 flex flex-col relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover rounded mb-4 cursor-pointer"
                onClick={() => handleView(video._id)}
              />
              

              <h3 className="text-xl font-semibold">{video.title}</h3>
              <p className="text-gray-600 mb-2 text-sm">{new Date(video.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-700 flex-1">{video.description.substring(0, 80)}...</p>
            </div>
          ))}
        </div>

        {videos.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-8">No videos found.</p>
        )}

        <div className="flex justify-center mt-8 space-x-4">
          {channel.hasPreviousPage && (
            <button
              onClick={() => setPage(page - 1)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Previous
            </button>
          )}
          {channel.hasNextPage && (
            <button
              onClick={() => setPage(page + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  )
}

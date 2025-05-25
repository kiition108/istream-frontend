import { useEffect, useState } from 'react'
import axiosInstance from '@/utils/axiosInstance'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '@/app/contexts/Authcontext'
import { useRouter } from 'next/navigation'

export default function ChannelSubscribeButton({ username }) {
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const {user}= useAuth()
  const Router= useRouter()
  const fetchChannel = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get(`/api/v1/users/c/${username}`)
      setChannel(res.data.data)
      setError(null)
    } catch (err) {
      setError('Login to see channel info')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (username) fetchChannel()
  }, [username])

  const toggleSubscribe = async () => {
    try {
      if (channel.isSubscribed) {
        const res=await axiosInstance.delete(`/api/v1/subscriptions/${channel._id}`)
        setChannel(prev => ({
          ...prev,
          isSubscribed: false,
          subscribersCount: prev.subscribersCount - 1,
        }))
        toast.success(res.data.message)
      } else {
        const res=await axiosInstance.post(`/api/v1/subscriptions/${channel._id}`)
        setChannel(prev => ({
          ...prev,
          isSubscribed: true,
          subscribersCount: prev.subscribersCount + 1,
        }))
        toast.success(res.data.message)
      }
    } catch (err) {
      toast.error(err.response.data.message||"Something went wrong")
    }
  }
  const channelRoute=()=>{
    Router.push(`/Channel/${channel.username}`)
  }
  if (loading) return <p className="text-center">Loading...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="flex items-center justify-between max-w-4xl mx-auto p-4 border-b">
      {/* Left: Profile Pic + Info */}
      <div className="flex items-center space-x-4">
        <Link href={`/Channel/${channel.username}`}>
        <Image
          src={channel.avatar || '/default-avatar.png'}
          alt="Channel Avatar"
          width={50}
          height={50}
          style={{ height: "auto", width: "auto" }}
          className="rounded-full object-cover"
        />
        </Link>
        <div>
          <h2 className="text-lg font-semibold">{channel.fullName}</h2>
          <p className="text-sm text-gray-600">
            {channel.subscribersCount} subscriber{channel.subscribersCount !== 1 && 's'}
          </p>
        </div>
      </div>

      {/* Right: Subscribe Button */}
      {user.username!==channel.username ? 
      <button
        onClick={toggleSubscribe}
        className={`px-5 py-2 text-sm font-semibold rounded-full transition duration-200 ${
          channel.isSubscribed
            ? 'bg-gray-200 text-black hover:bg-gray-300'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {channel.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>
      :
      <button
        onClick={channelRoute}
        className="px-5 py-2 text-sm font-semibold rounded-full transition duration-200 cursor-pointer bg-yellow-600 text-white hover:bg-red-700"
      >
        Go to Channel
      </button>  
    }
      
    </div>
  )
}

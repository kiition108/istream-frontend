'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/Authcontext'
import Navbar from '@/components/Navbar'

export default function VideoListPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)

  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const fetchVideos = async (currentPage = 1) => {
    try {
      setLoading(true)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/video/album?page=${currentPage}&limit=10`,
        {
          withCredentials: true
        })
      let result = res.data.data.docs
  
      // If admin, sort: unapproved videos first
      if (user?.role === 'admin') {
        result = result.sort((a, b) => Number(a.isApproved) - Number(b.isApproved))
      }
  
      setVideos(result)
      setHasNextPage(res.data.data.hasNextPage)
    } catch (err) {
      console.error(err)
      setError('Failed to load videos.')
    } finally {
      setLoading(false)
    }
  }
  

  useEffect(() => {
    fetchVideos(page)
  }, [page, authLoading])

  const handleApproveToggle = async (videoId) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/video/approval/${videoId}`, {}, { withCredentials: true })
      fetchVideos(page)
    } catch (err) {
      console.error(err)
      alert('Failed to toggle approval')
    }
  }

  const handleView = (videoId) => {
    router.push(`/watch/${videoId}`)
  }

  if (authLoading) {
    return <div className="p-6">Loading user info...</div>
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">All Videos</h2>

        {loading && <p>Loading videos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="border rounded-lg shadow p-4 flex flex-col relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover rounded mb-4 cursor-pointer"
                onClick={() => handleView(video._id)}
              />

              <div className="absolute top-2 left-2 flex gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    video.isPublished ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'
                  }`}
                >
                  {video.isPublished ? 'Public' : 'Private'}
                </span>
                {video.isApproved ? (
                    <span className="px-2 py-1 text-xs rounded bg-blue-600 text-white">Approved</span>
                  ) : (
                    <div className="relative group">
                      <span className="px-2 py-1 text-xs rounded bg-yellow-500 text-black animate-pulse">
                        Pending
                      </span>
                      <div className="absolute top-full mt-1 left-0 w-max bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        Awaiting admin approval
                      </div>
                    </div>
                  )}

              </div>

              <h3 className="text-xl font-semibold">{video.title}</h3>
              <p className="text-gray-600 mb-2 text-sm">{new Date(video.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-700 flex-1">{video.description.substring(0, 80)}...</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleApproveToggle(video._id)}
                    className={`px-3 py-1 rounded ${
                      video.isApproved ? 'bg-yellow-500' : 'bg-green-600'
                    } text-white`}
                  >
                    {video.isApproved ? 'Unapprove' : 'Approve'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {videos.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-8">No videos found.</p>
        )}

        <div className="flex justify-center mt-8 space-x-4">
          {page > 1 && (
            <button
              onClick={() => setPage(page - 1)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Previous
            </button>
          )}
          {hasNextPage && (
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

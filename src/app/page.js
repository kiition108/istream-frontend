'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'

export default function VideoListPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)

  const router = useRouter()

  const fetchVideos = async (currentPage = 1) => {
    try {
      setLoading(true)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/video/album?page=${currentPage}&limit=10`, {
        withCredentials: true,
      })
      const result = res.data.data.docs
      setVideos(result)
      setHasNextPage(res.data.data.hasNextPage)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load videos.')
      setError('Failed to load videos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos(page)
  }, [page])

  const handleView = (videoId) => {
     router.push(`/watch/${videoId}`)
  }

  if (loading) {
    return <div className="p-6">Loading user info...</div>
  }

  return (
    <>
      <Navbar />
      <ToastContainer/>
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

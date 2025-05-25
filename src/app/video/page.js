'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { VideoCameraIcon,SparklesIcon,PaperClipIcon } from '@heroicons/react/24/solid'
import withAuth from '@/utils/withAuth'
import axiosInstance from '@/utils/axiosInstance'

 function UploadVideoPage() {
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null)
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null)

  const router = useRouter()

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile)
      setVideoPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [videoFile])

  useEffect(() => {
    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail)
      setThumbnailPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [thumbnail])

  const validateAndSetVideo = (file) => {
    if (!file) return
    const maxSizeMB = 100
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Video must be less than ${maxSizeMB}MB`)
      return
    }
    const videoEl = document.createElement('video')
    videoEl.preload = 'metadata'
    videoEl.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoEl.src)
      if (videoEl.duration > 120) {
        toast.error('Video must be under 2 minutes')
        return
      }
      setVideoFile(file)
    }
    videoEl.src = URL.createObjectURL(file)
  }

  const validateAndSetThumbnail = (file) => {
    if (!file) return
    const maxSizeMB = 5
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Thumbnail must be less than ${maxSizeMB}MB`)
      return
    }
    setThumbnail(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!videoFile || !thumbnail || !title || !description) {
      toast.error('All fields are required')
      return
    }

    const formData = new FormData()
    formData.append('videoFile', videoFile)
    formData.append('thumbnail', thumbnail)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('isPublished', String(isPublished))

    try {
      setLoading(true)
      setProgress(0)
      await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/video/videoUpload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total)
          setProgress(percent)
        }
      })
      toast.success('Upload successful')
      router.push('/home')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Upload New Video</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <label className="block mb-1 font-medium">Video File (max 2 mins, 100MB)</label>
            <label htmlFor="videoUpload" className="cursor-pointer px-4 py-2 bg-black-200 border rounded hover:bg-red-300 inline-block">
            <PaperClipIcon className="w-6 h-6 text-gray"/><VideoCameraIcon className="w-6 h-6 text-yellow"/>
            </label>
            <input
              id="videoUpload"
              type="file"
              accept="video/*"
              onChange={(e) => validateAndSetVideo(e.target.files?.[0])}
              className="hidden"
            />
            {videoPreviewUrl && (
              <video src={videoPreviewUrl} controls className="w-full h-48 rounded mt-2" />
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Thumbnail (max 5MB)</label>
            <label htmlFor="thumbnailUpload" className="cursor-pointer px-4 py-2 bg-black-200 border rounded hover:bg-red-300 inline-block">
            <PaperClipIcon className="w-6 h-6 text-gray"/><SparklesIcon className="w-6 h-6 text-gray"/>
            </label>
            <input
              id="thumbnailUpload"
              type="file"
              accept="image/*"
              onChange={(e) => validateAndSetThumbnail(e.target.files?.[0])}
              className="hidden"
            />
            {thumbnailPreviewUrl && (
              <img src={thumbnailPreviewUrl} alt="Thumbnail preview" className="w-full h-32 object-cover rounded mt-2" />
            )}
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            Publish Now
          </label>

          {loading && (
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </>
  )
}
export default withAuth(UploadVideoPage);

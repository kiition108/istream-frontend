'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Upload, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import withAuth from '@/utils/withAuth';
import axiosInstance from '@/utils/axiosInstance';
import Image from 'next/image';

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
  const [isDragging, setIsDragging] = useState(false)

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDropVideo = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      validateAndSetVideo(file);
    } else {
      toast.error('Please drop a valid video file');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media Uploads */}
        <div className="lg:col-span-1 space-y-6">
          {/* Video Upload Area */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Video File</label>
            <div
              className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${isDragging ? 'border-accent bg-secondary/50' : 'border-border bg-secondary hover:bg-secondary/80'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDropVideo}
              onClick={() => document.getElementById('video-upload').click()}
            >
              {videoPreviewUrl ? (
                <video src={videoPreviewUrl} className="w-full h-full object-cover" controls />
              ) : (
                <div className="text-center p-4">
                  <div className="bg-background p-3 rounded-full inline-block mb-3">
                    <Upload className="text-accent" size={24} />
                  </div>
                  <p className="text-sm font-medium">Select or drag video</p>
                  <p className="text-xs text-gray-500 mt-1">MP4, WebM (Max 2min)</p>
                </div>
              )}
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => validateAndSetVideo(e.target.files?.[0])}
              />
            </div>
          </div>

          {/* Thumbnail Upload Area */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Thumbnail</label>
            <div
              className="aspect-video rounded-xl border-2 border-dashed border-border bg-secondary hover:bg-secondary/80 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden"
              onClick={() => document.getElementById('thumbnail-upload').click()}
            >
              {thumbnailPreviewUrl ? (
                <Image src={thumbnailPreviewUrl} alt="Thumbnail" width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="text-gray-400 mx-auto mb-2" size={24} />
                  <p className="text-xs text-gray-400">Upload Thumbnail</p>
                </div>
              )}
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => validateAndSetThumbnail(e.target.files?.[0])}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              placeholder="Add a title that describes your video"
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea
              placeholder="Tell viewers about your video"
              rows={6}
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-border/50">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer ${isPublished ? 'border-accent bg-accent' : 'border-gray-500'}`} onClick={() => setIsPublished(!isPublished)}>
              {isPublished && <CheckCircle2 size={14} className="text-white" />}
            </div>
            <span className="text-sm cursor-pointer select-none" onClick={() => setIsPublished(!isPublished)}>Publish immediately</span>
          </div>

          {/* Submit Button & Progress */}
          <div className="pt-4">
            {loading ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Upload Video
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
export default withAuth(UploadVideoPage);

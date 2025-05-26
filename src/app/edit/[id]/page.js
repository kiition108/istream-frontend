'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/app/contexts/Authcontext';
import withAuth from '@/utils/withAuth';
import LoadingModal from '@/components/Loading';
import axiosInstance from '@/utils/axiosInstance';

function EditVideoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/video/adminOwner/${id}`);
        const video = res.data.data;
        if (video.owner._id !== user._id) {
          setError('You are not authorized to edit this video.');
          return;
        }

        setTitle(video.title);
        setDescription(video.description);
        setIsPublished(video.isPublished);
      } catch (err) { 
        console.error(err);
        setError('Failed to fetch video data');
      }
    };

    fetchVideo();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('isPublished', isPublished);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      setError('');
      setLoading(true);

      await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/video/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      router.push('/home');
    } catch (err) {
      console.error(err);
      setError('Failed to update video');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <>
      <Navbar />
      <LoadingModal visible={loading} progress={progress} message="Uploading..." />


      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Video</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows="4"
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={() => setIsPublished(!isPublished)}
            />
            <label>Make Public</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            Update Video
          </button>
        </form>
      </div>
    </>
  );
}

export default withAuth(EditVideoPage);

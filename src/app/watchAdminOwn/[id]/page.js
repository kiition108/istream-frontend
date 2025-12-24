'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar'; // adjust path if needed
import { useAuth } from '@/app/contexts/Authcontext';
import axiosInstance from '@/utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '@/components/Loader';

function WatchVideoAdminOwnerPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/video/adminOwner/${id}`,
          {
            withCredentials: true
          }
        );
        setVideo(data.data);
        setError(null);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load video.")
        setError(err?.response?.data?.message || "Failed to load video.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();

  }, [id]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!video) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <div className="aspect-video bg-black mb-4">
          <video
            controls
            className="w-full h-full object-contain"
            poster={video.thumbnail}
            src={video.videoFile}
          />
        </div>

        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <p className="text-gray-700 mb-4">{video.description}</p>
        <p className="text-sm text-gray-500">
          Uploaded by: {video?.owner?.username || "Unknown User"}
        </p>
      </div>
    </>
  );
}
export default WatchVideoAdminOwnerPage;
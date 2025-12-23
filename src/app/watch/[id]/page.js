'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar'; // adjust path if needed
import { toast } from 'react-toastify';
import ChannelSubscribeButton from '@/components/ChannelSubscribeButton';
import { useAuth } from '@/app/contexts/Authcontext';
import VideoComment from '@/components/Comment.js';
import { videoService } from '@/api';

function WatchVideoPage() {
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
        const data = await videoService.getVideoById(id);
        setVideo(data.data);
        console.log(data);
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
        Loading...
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
        <VideoComment videoId={id} />
        <ChannelSubscribeButton username={video?.owner?.username} />

      </div>
    </>
  );
}
export default WatchVideoPage;
'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../../components/Navbar'; // adjust path if needed
import withAuth from '@/utils/withAuth';

 function WatchVideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/video/${id}`);
        setVideo(data.data);
        console.log(data.data)
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load video.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);
  console.log(video)
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
        <p className="text-sm text-gray-500">
          Uploaded by: {video?.owner?.username || "Unknown User"}
        </p>
      </div>
    </>
  );
}
export default withAuth(WatchVideoPage);
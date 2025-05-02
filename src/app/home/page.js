'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/contexts/Authcontext';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import withAuth from '@/utils/withAuth.js';
import Image from 'next/image';

function UserVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const fetchUserVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/video/user`, {
        withCredentials: true,
      });
      setVideos(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch your videos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserVideos();
  }, []);

  const handleView = (videoId) => {
    router.push(`/watch/${videoId}`);
  };

  const handleEdit = (videoId) => {
    router.push(`/edit/${videoId}`);
  };

  const handleDelete = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/video/${videoId}`, {
        withCredentials: true,
      });
      fetchUserVideos();
    } catch (err) {
      console.error(err);
      alert('Failed to delete video');
    }
  };

  const handleTogglePrivacy = async (videoId) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/video/privacy/${videoId}`,
        {},
        { withCredentials: true }
      );
      fetchUserVideos();
    } catch (err) {
      console.error(err);
      alert('Failed to toggle privacy');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">My Videos</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
  <div key={video._id} className="border rounded-lg shadow p-4 flex flex-col relative">
    <Image
      src={video.thumbnail}
      alt={video.title}
      className="w-full h-40 object-cover rounded mb-4 cursor-pointer"
      onClick={() => handleView(video._id)}
    />

    {/* Published Status Badge */}
    <div className="absolute top-2 left-2">
      <span
        className={`px-2 py-1 text-xs rounded ${
          video.isPublished ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'
        }`}
      >
        {video.isPublished ? 'Public' : 'Private'}
      </span>
    </div>

    {/* Approval Badge (only if not approved) */}
    {!video.isApproved && (
  <div className="absolute top-2 right-2 group">
    <span className="bg-red-600 text-white px-2 py-1 text-xs rounded animate-pulse">
      Pending Approval
    </span>
    <div className="absolute top-full mt-1 right-0 w-40 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
      This video is awaiting admin approval.
    </div>
  </div>
)}


    <h3 className="text-xl font-semibold">{video.title}</h3>
    <p className="text-gray-600 text-sm mb-1">
      {new Date(video.createdAt).toLocaleDateString()}
    </p>
    <p className="text-gray-700 text-sm">{video.description?.slice(0, 100)}...</p>

    {user?._id === video.owner && (
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleTogglePrivacy(video._id)}
          className={`px-3 py-1 rounded ${
            video.isPublished ? 'bg-yellow-500' : 'bg-green-600'
          } text-white`}
        >
          {video.isPublished ? 'Make Private' : 'Make Public'}
        </button>

        <button
          onClick={() => handleEdit(video._id)}
          className="bg-blue-500 px-3 py-1 text-white rounded"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(video._id)}
          className="bg-red-500 px-3 py-1 text-white rounded"
        >
          Delete
        </button>
      </div>
    )}
  </div>
))}
        </div>

        {videos.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-6">
            You haven&apos;t uploaded any videos yet.
          </p>
        )}
      </div>
    </>
  );
}

export default withAuth(UserVideosPage);

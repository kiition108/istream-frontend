'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { toast } from 'react-toastify';
import ChannelSubscribeButton from '@/components/ChannelSubscribeButton';
import { useAuth } from '@/app/contexts/Authcontext';
import VideoComment from '@/components/Comment.js';
import { videoService } from '@/api';
import Loader from '@/components/Loader';
import { ThumbsUp, ThumbsDown, Share2, Eye } from 'lucide-react';

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

  const formatViews = (views) => {
    if (!views) return '0 views';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const formatDate = (date) => {
    const now = new Date();
    const videoDate = new Date(date);
    const diffTime = Math.abs(now - videoDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-4">
              <video
                controls
                className="w-full h-full object-contain"
                poster={video.thumbnail}
                src={video.videoFile}
                autoPlay={false}
              />
            </div>

            {/* Video Title */}
            <h1 className="text-2xl font-bold mb-3 text-white">{video.title}</h1>

            {/* Video Stats & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
              {/* Views & Date */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{formatViews(video.views)}</span>
                </div>
                <span>•</span>
                <span>{formatDate(video.createdAt)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-border rounded-full transition-colors">
                  <ThumbsUp size={20} />
                  <span className="font-medium">Like</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-border rounded-full transition-colors">
                  <ThumbsDown size={20} />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-border rounded-full transition-colors">
                  <Share2 size={20} />
                  <span className="font-medium">Share</span>
                </button>
              </div>
            </div>

            {/* Channel Info & Subscribe */}
            <div className="py-4 border-b border-border">
              <ChannelSubscribeButton username={video?.owner?.username} />
            </div>

            {/* Description */}
            <div className="mt-4 bg-secondary rounded-xl p-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-gray-300 whitespace-pre-line">{video.description}</p>
            </div>

            {/* Comments Section */}
            <VideoComment videoId={id} />
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
              <div className="space-y-3">
                {/* Placeholder for related videos */}
                <div className="text-sm text-gray-500">
                  Related videos coming soon...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default WatchVideoPage;
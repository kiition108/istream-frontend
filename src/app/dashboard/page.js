'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Edit2, Trash2, Eye, Plus, ShieldCheck } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import withAuth from '@/utils/withAuth';
import axiosInstance from '@/utils/axiosInstance';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/Authcontext';
import Loader from '@/components/Loader';
import VideoThumbnail from '@/components/VideoThumbnail';

function DashboardPage() {
  const [page, setPage] = useState(1);
  const [allVideos, setAllVideos] = useState([]);
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user videos with React Query
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['userVideos', page],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/video/user?page=${page}&limit=12`,
        { withCredentials: true }
      );
      return res.data.data;
    },
  });

  // Accumulate videos when new page data arrives
  useEffect(() => {
    if (data?.docs) {
      setAllVideos(prev => {
        // If it's page 1, replace all videos
        if (page === 1) return data.docs;
        // Otherwise, append new videos, avoiding duplicates
        const existingIds = new Set(prev.map(v => v._id));
        const newVideos = data.docs.filter(v => !existingIds.has(v._id));
        return [...prev, ...newVideos];
      });
    }
  }, [data, page]);

  const hasNextPage = data?.hasNextPage || false;

  // Delete video mutation with optimistic update
  const deleteMutation = useMutation({
    mutationFn: async (videoId) => {
      await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/video/${videoId}`,
        { withCredentials: true }
      );
      return videoId;
    },
    onMutate: async (videoId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['userVideos'] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(['userVideos', page]);

      // Optimistically update cache
      queryClient.setQueryData(['userVideos', page], (old) => ({
        ...old,
        docs: old.docs.filter((v) => v._id !== videoId),
      }));

      return { previousData };
    },
    onError: (err, videoId, context) => {
      // Rollback on error
      queryClient.setQueryData(['userVideos', page], context.previousData);
      toast.error('Failed to delete video');
    },
    onSuccess: () => {
      toast.success('Video deleted');
    },
    onSettled: () => {
      // Refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: ['userVideos'] });
    },
  });

  // Toggle privacy mutation with optimistic update
  const togglePrivacyMutation = useMutation({
    mutationFn: async (videoId) => {
      await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/video/privacy/${videoId}`,
        {},
        { withCredentials: true }
      );
      return videoId;
    },
    onMutate: async (videoId) => {
      await queryClient.cancelQueries({ queryKey: ['userVideos'] });

      const previousData = queryClient.getQueryData(['userVideos', page]);

      // Optimistically update
      queryClient.setQueryData(['userVideos', page], (old) => ({
        ...old,
        docs: old.docs.map((v) =>
          v._id === videoId ? { ...v, isPublished: !v.isPublished } : v
        ),
      }));

      return { previousData };
    },
    onError: (err, videoId, context) => {
      queryClient.setQueryData(['userVideos', page], context.previousData);
      toast.error('Failed to update privacy');
    },
    onSuccess: () => {
      toast.success('Privacy updated');
    },
  });

  const handleDelete = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    deleteMutation.mutate(videoId);
  };

  const handleTogglePrivacy = async (videoId) => {
    togglePrivacyMutation.mutate(videoId);
  };

  // Prefetch next page
  const prefetchNextPage = () => {
    if (hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: ['userVideos', page + 1],
        queryFn: async () => {
          const res = await axiosInstance.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/video/user?page=${page + 1}&limit=12`,
            { withCredentials: true }
          );
          return res.data.data;
        },
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Channel Content</h1>
        <div className="flex gap-3">
          {user?.role === 'admin' && (
            <Link href="/videoApproval">
              <button className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg font-medium transition-colors border border-yellow-500/50">
                <ShieldCheck size={20} />
                Approve Videos
              </button>
            </Link>
          )}
          <Link href="/video">
            <button className="flex items-center gap-2 bg-accent hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Plus size={20} />
              Create
            </button>
          </Link>
        </div>
      </div>

      {allVideos.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] border border-dashed border-border rounded-xl">
          <div className="bg-secondary p-4 rounded-full mb-4">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No content yet</h3>
          <p className="text-gray-400 mb-6">Upload your first video to get started</p>
          <Link href="/video">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Upload Video
            </button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allVideos.map((video) => (
          <div key={video._id} className="group flex flex-col gap-3 relative">
            {/* Thumbnail & Overlays */}
            <div className="relative">
              <VideoThumbnail
                src={video.thumbnail}
                alt={video.title}
                priority={false}
              />

              {/* Status Badge */}
              <div className="absolute top-2 left-2 flex gap-2">
                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${video.isPublished ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
                  {video.isPublished ? 'Public' : 'Private'}
                </span>
                {!video.isApproved && (
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-yellow-500/90 text-black">
                    Pending
                  </span>
                )}
              </div>

              {/* Hover Actions Overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm rounded-xl">
                <button
                  onClick={() => router.push(video?.isPublished === false ? `/watchAdminOwn/${video._id}` : `/watch/${video._id}`)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
                  title="View"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => router.push(`/edit/${video._id}`)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-blue-400 backdrop-blur-md transition-colors"
                  title="Edit"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(video._id)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-red-500 backdrop-blur-md transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Meta Data */}
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-white line-clamp-1">{video.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => handleTogglePrivacy(video._id)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${video.isPublished ? 'bg-secondary hover:bg-border text-gray-300' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  {video.isPublished ? 'Make Private' : 'Make Public'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFetching && allVideos.length > 0 && (
        <div className="flex justify-center p-8">
          <Loader />
        </div>
      )}

      {hasNextPage && !isFetching && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              setPage((prev) => prev + 1);
              prefetchNextPage();
            }}
            onMouseEnter={prefetchNextPage}
            className="px-6 py-2 bg-secondary hover:bg-border rounded-full text-sm font-medium transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {error && (
        <div className="flex justify-center p-8 text-red-500">
          Failed to load videos
        </div>
      )}
    </div>
  );
}

export default withAuth(DashboardPage);

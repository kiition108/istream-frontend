'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/Authcontext';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { Check, X, AlertCircle, Clock, Play, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import VideoThumbnail from '@/components/VideoThumbnail';
import Navbar from '@/components/Navbar';

export default function VideoApprovalPage() {
  const [page, setPage] = useState(1);
  const [allVideos, setAllVideos] = useState([]);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Fetch pending videos with React Query
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['pendingVideos', page],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/v1/video/pendingVideos?page=${page}&limit=12`, {
        withCredentials: true
      });
      return res.data.data;
    },
    enabled: !authLoading && user?.role === 'admin',
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Accumulate videos when new page data arrives
  useEffect(() => {
    if (data?.docs) {
      setAllVideos(prev => {
        if (page === 1) {
          // Sort: Pending first
          const sorted = [...data.docs].sort((a, b) => Number(a.isApproved) - Number(b.isApproved));
          return sorted;
        }
        const existingIds = new Set(prev.map(v => v._id));
        const newVideos = data.docs.filter(v => !existingIds.has(v._id));
        const combined = [...prev, ...newVideos];
        // Sort combined list
        return combined.sort((a, b) => Number(a.isApproved) - Number(b.isApproved));
      });
    }
  }, [data, page]);

  const hasNextPage = data?.hasNextPage || false;

  // Approval toggle mutation with optimistic update
  const approvalMutation = useMutation({
    mutationFn: async ({ videoId, currentStatus }) => {
      await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/video/approval/${videoId}`,
        {},
        { withCredentials: true }
      );
      return { videoId, currentStatus };
    },
    onMutate: async ({ videoId, currentStatus }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['pendingVideos'] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(['pendingVideos', page]);

      // Optimistically update local state
      setAllVideos(prev =>
        prev.map(v => v._id === videoId ? { ...v, isApproved: !currentStatus } : v)
          .sort((a, b) => Number(a.isApproved) - Number(b.isApproved))
      );

      // Update cache
      queryClient.setQueryData(['pendingVideos', page], (old) => {
        if (!old) return old;
        return {
          ...old,
          docs: old.docs.map(v => v._id === videoId ? { ...v, isApproved: !currentStatus } : v)
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['pendingVideos', page], context.previousData);
      // Refetch to ensure accuracy
      queryClient.invalidateQueries({ queryKey: ['pendingVideos'] });
      toast.error('Failed to update status');
    },
    onSuccess: (data) => {
      toast.success(data.currentStatus ? 'Video unapproved' : 'Video approved');
    },
  });

  const handleApproveToggle = (videoId, currentStatus) => {
    approvalMutation.mutate({ videoId, currentStatus });
  };

  // Prefetch next page
  const prefetchNextPage = () => {
    if (hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: ['pendingVideos', page + 1],
        queryFn: async () => {
          const res = await axiosInstance.get(`/api/v1/video/pendingVideos?page=${page + 1}&limit=12`, {
            withCredentials: true
          });
          return res.data.data;
        },
      });
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-red-500 gap-4">
          <div className="p-4 bg-red-500/10 rounded-full">
            <AlertCircle size={64} />
          </div>
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-gray-400">You must be an administrator to view this page.</p>
        </div>
      </>
    );
  }

  const pendingCount = allVideos.filter(v => !v.isApproved).length;
  const approvedCount = allVideos.filter(v => v.isApproved).length;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full">
              <AlertCircle size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Approval Console</h1>
              <p className="text-gray-400">Review and approve pending videos</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-secondary/50 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-yellow-500" />
                <span className="text-sm text-gray-400">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
            </div>
            <div className="bg-secondary/50 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Check size={16} className="text-green-500" />
                <span className="text-sm text-gray-400">Approved</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{approvedCount}</p>
            </div>
            <div className="bg-secondary/50 border border-border rounded-xl p-4 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-1">
                <Play size={16} className="text-blue-500" />
                <span className="text-sm text-gray-400">Total</span>
              </div>
              <p className="text-2xl font-bold text-white">{allVideos.length}</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>Failed to load pending videos</span>
          </div>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {allVideos.map((video) => (
            <div
              key={video._id}
              className={`group flex flex-col rounded-xl overflow-hidden border transition-all hover:shadow-lg ${video.isApproved
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-yellow-500/50 bg-yellow-500/5'
                }`}
            >
              {/* Thumbnail with VideoThumbnail component */}
              <div className="relative cursor-pointer" onClick={() => router.push(`/watchAdminOwn/${video._id}`)}>
                <VideoThumbnail
                  src={video.thumbnail}
                  alt={video.title}
                  priority={false}
                />

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  {video.isApproved ? (
                    <span className="flex items-center gap-1 bg-green-500/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-lg">
                      <Check size={12} /> Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-yellow-500/90 text-black text-[10px] uppercase font-bold px-2 py-1 rounded animate-pulse shadow-lg">
                      <Clock size={12} /> Pending
                    </span>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Eye size={32} className="text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1 text-white" title={video.title}>
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-400">by @{video.owner?.username || 'Unknown'}</p>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 flex-1">{video.description}</p>

                {/* View Button */}
                <button
                  onClick={() => router.push(`/watchAdminOwn/${video._id}`)}
                  className="w-full py-2 bg-secondary hover:bg-border rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-white"
                >
                  <Eye size={18} />
                  Preview Video
                </button>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveToggle(video._id, video.isApproved);
                  }}
                  disabled={approvalMutation.isLoading}
                  className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${video.isApproved
                    ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/30'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {video.isApproved ? (
                    <>
                      <X size={18} /> Revoke Approval
                    </>
                  ) : (
                    <>
                      <Check size={18} /> Approve Video
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {allVideos.length === 0 && !isLoading && !isFetching && (
          <div className="text-center text-gray-500 py-20">
            <Check size={64} className="mx-auto mb-4 text-green-500/50" />
            <p className="text-xl font-semibold mb-2">All Caught Up!</p>
            <p className="text-gray-400">No pending videos to review</p>
          </div>
        )}

        {/* Loading State */}
        {isFetching && allVideos.length > 0 && (
          <div className="flex justify-center p-8">
            <Loader />
          </div>
        )}

        {/* Load More Button */}
        {hasNextPage && !isFetching && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                setPage(prev => prev + 1);
                prefetchNextPage();
              }}
              onMouseEnter={prefetchNextPage}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              Load More Videos
            </button>
          </div>
        )}
      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/Authcontext';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { Check, X, Loader2, AlertCircle, Clock } from 'lucide-react';

export default function VideoApprovalPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const fetchVideos = async (currentPage = 1) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/v1/video/pendingVideos?page=${currentPage}&limit=12`, {
        withCredentials: true
      });

      let result = res.data.data.docs;
      // Sort: Pending first
      if (user?.role === 'admin') {
        result = result.sort((a, b) => Number(a.isApproved) - Number(b.isApproved));
      }

      setVideos(prev => currentPage === 1 ? result : [...prev, ...result]);
      setHasNextPage(res.data.data.hasNextPage);
    } catch (err) {
      console.error(err);
      setError('Failed to load pending videos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchVideos(page);
    }
  }, [page, authLoading, user]);

  const handleApproveToggle = async (videoId, currentStatus) => {
    try {
      // Optimistic update
      setVideos(videos.map(v => v._id === videoId ? { ...v, isApproved: !currentStatus } : v));

      await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/video/approval/${videoId}`, {}, { withCredentials: true });
      toast.success(currentStatus ? 'Video unapproved' : 'Video approved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
      // Revert on error
      fetchVideos(page);
    }
  };

  if (authLoading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 className="animate-spin text-accent" size={32} />
    </div>
  );

  if (!user || user.role !== 'admin') return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-red-500 gap-2">
      <AlertCircle size={48} />
      <h2 className="text-xl font-bold">Access Denied</h2>
      <p className="text-gray-400">You must be an administrator to view this page.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="bg-yellow-500/10 text-yellow-500 p-2 rounded-lg">
          <AlertCircle size={28} />
        </span>
        Admin Approval Console
      </h1>

      {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-lg mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div key={video._id} className={`flex flex-col gap-3 rounded-xl overflow-hidden border ${video.isApproved ? 'border-green-500/30' : 'border-yellow-500/30'} bg-secondary/30`}>
            {/* Thumbnail */}
            <div className="block relative w-full aspect-video bg-black/50 cursor-pointer" onClick={() => router.push(`/watch/${video._id}`)}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-2 right-2">
                {video.isApproved ? (
                  <span className="flex items-center gap-1 bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                    <Check size={12} /> Approved
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-yellow-500 text-black text-[10px] uppercase font-bold px-2 py-1 rounded animate-pulse">
                    <Clock size={12} /> Pending
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-3 flex-1">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1" title={video.title}>{video.title}</h3>
                <p className="text-sm text-gray-400">by {video.owner?.username || 'Unknown'}</p>
              </div>

              <p className="text-sm text-gray-500 line-clamp-2 flex-1">{video.description}</p>

              {/* Actions */}
              <div className="pt-2 mt-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveToggle(video._id, video.isApproved);
                  }}
                  className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${video.isApproved
                    ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20'
                    }`}
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
          </div>
        ))}
      </div>

      {videos.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-20">
          <Check size={48} className="mx-auto mb-4 text-green-500/50" />
          <p className="text-lg">All caught up! No pending videos.</p>
        </div>
      )}

      {hasNextPage && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="px-6 py-2 bg-secondary hover:bg-border rounded-full text-sm font-medium transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

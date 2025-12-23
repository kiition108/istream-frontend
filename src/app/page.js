"use client"
import { useEffect, useState } from 'react';
import { videoService } from '@/api';
import VideoCard from '@/components/VideoCard';
import Loader from '@/components/Loader';
import VideoCardSkeleton from '@/components/VideoCardSkeleton';

export default function VideoListPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await videoService.getAllVideos(page);
        const result = data.data.docs;
        setVideos(prev => page === 1 ? result : [...prev, ...result]);
        setHasNextPage(data.data.hasNextPage);
      } catch (err) {
        console.error(err);
        setError('Failed to load videos.');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [page]);

  if (loading && videos.length === 0) {
    return (
      <div className="pt-2">
        {/* Category Pills Skeleton or same pills */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 no-scrollbar">
          {['All', 'Music', 'Gaming', 'Live', 'Computer Programming', 'Podcasts', 'News'].map((tag) => (
            <button key={tag} className="px-3 py-1.5 bg-secondary hover:bg-border rounded-lg text-sm whitespace-nowrap transition-colors font-medium">
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
          {[...Array(10)].map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2">

      {/* Category Pills (Optional Phase 4 idea, placeholder for now) */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 no-scrollbar">
        {['All', 'Music', 'Gaming', 'Live', 'Computer Programming', 'Podcasts', 'News'].map((tag) => (
          <button key={tag} className="px-3 py-1.5 bg-secondary hover:bg-border rounded-lg text-sm whitespace-nowrap transition-colors font-medium">
            {tag}
          </button>
        ))}
      </div>

      {videos.length === 0 && !loading && !error && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
          <p>No videos found</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {loading && (
        <Loader />
      )}

      {/* Load More Trigger (can be replaced with IntersectionObserver later) */}
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

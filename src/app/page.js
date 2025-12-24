"use client"
import { useState, useEffect } from 'react';
import { videoService } from '@/api';
import VideoCard from '@/components/VideoCard';
import VideoCardSkeleton from '@/components/VideoCardSkeleton';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function VideoListPage() {
  const [page, setPage] = useState(1);
  const [allVideos, setAllVideos] = useState([]);
  const queryClient = useQueryClient();

  // Fetch videos with React Query
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['allVideos', page],
    queryFn: async () => {
      const response = await videoService.getAllVideos(page);
      return response.data;
    },
    staleTime: 3 * 60 * 1000, // Data stays fresh for 3 minutes
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

  // Prefetch next page for smoother UX
  const prefetchNextPage = () => {
    if (hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: ['allVideos', page + 1],
        queryFn: async () => {
          const response = await videoService.getAllVideos(page + 1);
          return response.data;
        },
      });
    }
  };

  if (isLoading && allVideos.length === 0) {
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

      {allVideos.length === 0 && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
          <p>No videos found</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
        {allVideos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}

        {/* Show skeletons while loading more */}
        {isFetching && allVideos.length > 0 && (
          [...Array(4)].map((_, i) => (
            <VideoCardSkeleton key={`skeleton-${i}`} />
          ))
        )}
      </div>

      {/* Load More Trigger */}
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

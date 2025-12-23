'use client';

export default function VideoCardSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            {/* Thumbnail Skeleton */}
            <div className="relative aspect-video rounded-xl bg-secondary animate-pulse" />

            {/* Meta Data Skeleton */}
            <div className="flex gap-3 px-1">
                {/* Avatar Skeleton */}
                <div className="w-9 h-9 rounded-full bg-secondary animate-pulse flex-shrink-0" />

                {/* Text Skeleton */}
                <div className="flex flex-col flex-1 gap-2">
                    <div className="w-full h-4 bg-secondary animate-pulse rounded" />
                    <div className="w-3/4 h-4 bg-secondary animate-pulse rounded" />
                    <div className="w-1/2 h-3 bg-secondary animate-pulse rounded mt-1" />
                </div>
            </div>
        </div>
    );
}

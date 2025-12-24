'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreVertical, CheckCircle2 } from 'lucide-react';
import VideoThumbnail from './VideoThumbnail';
import Image from 'next/image';

export default function VideoCard({ video }) {
    const [isHovered, setIsHovered] = useState(false);

    // Format duration helper - handles both string ("00:00:08") and number (8 seconds)
    const formatDuration = (duration) => {
        // If duration is already a formatted string (HH:MM:SS or MM:SS), return it
        if (typeof duration === 'string' && duration.includes(':')) {
            return duration;
        }

        // If duration is a number (seconds), format it
        const seconds = typeof duration === 'string' ? parseFloat(duration) : duration;
        if (!seconds || isNaN(seconds)) return "00:00";

        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');

        if (hh) {
            return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    const duration = formatDuration(video.duration);

    // Format date "time ago" helper (simplified)
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        return "Today";
    };

    return (
        <div
            className="group flex flex-col gap-3 cursor-pointer h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Thumbnail Wrapper */}
            <Link href={`/watch/${video._id}`} className="block relative w-full">
                <VideoThumbnail
                    src={video.thumbnail}
                    alt={video.title}
                    priority={false}
                    className={`transition-transform duration-200 ${isHovered ? 'scale-105' : 'scale-100'}`}
                />

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium z-10">
                    {duration}
                </div>

                {/* Hover Preview Implementation (requires video resource, using overlay for now) */}
                {isHovered && video.previewUrl && (
                    <video
                        src={video.previewUrl}
                        autoPlay
                        muted
                        loop
                        className="absolute inset-0 w-full h-full object-cover rounded-xl"
                    />
                )}
            </Link>

            {/* Meta Data */}
            <div className="flex gap-3 px-1">
                {/* Channel Avatar */}
                <Link href={`/Channel/${typeof video.owner === 'object' ? video.owner?.username : 'unknown'}`} className="flex-shrink-0">
                    <Image
                        src={(typeof video.owner === 'object' ? video.owner?.avatar : null) || '/default-avatar.png'}
                        alt="Channel"
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full object-cover mt-0.5 hover:opacity-80 transition-opacity"
                    />
                </Link>

                {/* Text Info */}
                <div className="flex flex-col flex-1 gap-1">
                    {/* Title */}
                    <Link href={`/watch/${video._id}`}>
                        <h3 className="text-white font-semibold text-base leading-snug line-clamp-2" title={video.title}>
                            {video.title}
                        </h3>
                    </Link>

                    {/* Channel Name */}
                    <Link href={`/Channel/${typeof video.owner === 'object' ? video.owner?.username : 'unknown'}`} className="text-gray-400 text-sm hover:text-white transition-colors flex items-center gap-1">
                        {typeof video.owner === 'object' ? (video.owner?.username || "Unknown Channel") : "Unknown Channel"}
                        {/* {video.owner?.isVerified && <CheckCircle2 size={14} className="fill-gray-400 text-background"/>} */}
                    </Link>

                    {/* Views • Time */}
                    <div className="text-gray-400 text-sm flex items-center gap-1">
                        <span>{video.views || 0} views</span>
                        <span className="text-[10px]">•</span>
                        <span>{timeAgo(video.createdAt)}</span>
                    </div>
                </div>

                {/* Options Menu (visible on hover) */}
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded-full h-fit">
                    <MoreVertical size={20} className="text-white" />
                </button>
            </div>
        </div>
    );
}

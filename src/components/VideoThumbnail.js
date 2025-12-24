'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function VideoThumbnail({
    src,
    alt,
    priority = false,
    className = ''
}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative aspect-video rounded-xl overflow-hidden ${className}`}>
            {/* Skeleton loader */}
            {!loaded && (
                <div className="absolute inset-0 bg-secondary animate-pulse" />
            )}

            {/* Actual image */}
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'
                    }`}
                onLoad={() => setLoaded(true)}
                loading={priority ? 'eager' : 'lazy'}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                quality={85}
            />
        </div>
    );
}

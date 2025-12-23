'use client';

import { Loader2 } from 'lucide-react';

export default function Loader({ fullScreen = false }) {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center w-full p-4">
            <Loader2 className="animate-spin text-accent" size={32} />
        </div>
    );
}

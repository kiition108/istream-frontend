'use client';

import {
    User,
    LogOut,
    Menu,
    MoreVertical,
    ThumbsUp,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/Authcontext';
import { SIDEBAR_MENU_ITEMS, SIDEBAR_LIBRARY_ITEMS } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/api';
import Image from 'next/image';

// Add Liked Videos if not present in constants (Runtime check/addition)
const UPDATED_LIBRARY_ITEMS = [
    ...SIDEBAR_LIBRARY_ITEMS,
    // { label: 'Liked Videos', icon: ThumbsUp, href: '/liked-videos' }
];

export default function Sidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const { user } = useAuth();

    const menuItems = SIDEBAR_MENU_ITEMS;
    const libraryItems = UPDATED_LIBRARY_ITEMS;


    const isActive = (path) => pathname === path;

    // Fetch Subscriptions
    const { data: subscriptionData } = useQuery({
        queryKey: ['subscriptions', user?._id],
        queryFn: () => subscriptionService.getSubscriptions(1, 10),
        enabled: !!user,
        staleTime: 60000 * 5, // 5 minutes
    });

    // Check if the data is paginated (has docs) or a direct array
    const subscriptions = subscriptionData?.data || (Array.isArray(subscriptionData) ? subscriptionData : []) || [];

    // Mini Sidebar (when collapsed)
    if (!isOpen) {
        return (
            <aside className="fixed left-0 top-14 w-18 h-[calc(100vh-3.5rem)] bg-background flex flex-col items-center py-4 gap-6 hidden md:flex z-40">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary w-16 transition-colors ${isActive(item.href) ? 'text-white' : 'text-gray-400'}`}
                    >
                        <item.icon size={24} />
                        <span className="text-[10px]">{item.label}</span>
                    </Link>
                ))}
                <Link
                    href="/profile"
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary w-16 transition-colors ${isActive('/profile') ? 'text-white' : 'text-gray-400'}`}
                >
                    <User size={24} />
                    <span className="text-[10px]">You</span>
                </Link>
            </aside>
        );
    }

    // Expanded Sidebar
    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden ${isOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsOpen(false)}
            />

            <aside className={`fixed left-0 top-14 w-60 h-[calc(100vh-3.5rem)] bg-background border-r border-border overflow-y-auto z-50 transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-3">
                    {/* Main Menu */}
                    <div className="border-b border-border pb-3 mb-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors ${isActive(item.href) ? 'bg-secondary font-medium' : ''}`}
                            >
                                <item.icon size={22} className={isActive(item.href) ? 'fill-current' : ''} />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Library */}
                    <div className="border-b border-border pb-3 mb-3">
                        <h3 className="px-3 py-2 text-base font-semibold flex items-center gap-2">
                            You <span className="text-gray-400 font-normal">{'>'}</span>
                        </h3>
                        {libraryItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors ${isActive(item.href) ? 'bg-secondary font-medium' : ''}`}
                            >
                                <item.icon size={22} />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Subscriptions */}
                    {user && (
                        <div className="pb-3">
                            <h3 className="px-3 py-2 text-base font-semibold">Subscriptions</h3>

                            {subscriptions.length > 0 ? (
                                <div className="space-y-1">
                                    {subscriptions.map((sub) => {
                                        const channel = sub.channel || sub.subscriber || sub; // Fallback handling
                                        // The API likely returns a subscription object with a 'channel' field populated
                                        // Or it returns channels directly. Let's assume standard subscription object structure
                                        const channelData = sub.channel || sub;

                                        return (
                                            <Link
                                                key={channelData._id}
                                                href={`/Channel/${channelData.username}`}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors ${isActive(`/Channel/${channelData.username}`) ? 'bg-secondary' : ''}`}
                                            >
                                                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={channelData.avatar}
                                                        alt={channelData.username}
                                                        width={24}
                                                        height={24}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="text-sm truncate">{channelData.fullName || channelData.username}</span>
                                            </Link>
                                        );
                                    })}

                                    {/* Show More link if needed - for now just listed */}
                                    {/* <Link href="/subscriptions" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary text-sm text-gray-400">
                                         <span>Show more</span>
                                    </Link> */}
                                </div>
                            ) : (
                                <p className="px-3 text-sm text-gray-400">No subscriptions yet</p>
                            )}
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}

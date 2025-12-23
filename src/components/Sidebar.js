'use client';

import {
    Home,
    Compass,
    PlaySquare,
    Clock,
    ThumbsUp,
    User,
    LogOut,
    Menu,
    History,
    MoreVertical,
    LayoutDashboard as Dashboard
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/Authcontext';

export default function Sidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const { user } = useAuth();

    const menuItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Dashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Compass, label: 'Shorts', href: '/shorts' }, // Placeholder
        { icon: PlaySquare, label: 'Subscriptions', href: '/subscriptions' }, // Placeholder
    ];

    const libraryItems = [
        { icon: History, label: 'History', href: '/history' },
        { icon: Clock, label: 'Watch Later', href: '/p/watch-later' },
        { icon: ThumbsUp, label: 'Liked Videos', href: '/p/liked' },
    ];

    const isActive = (path) => pathname === path;

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

                    {/* Subscriptions (Placeholder data) */}
                    {user && (
                        <div className="pb-3">
                            <h3 className="px-3 py-2 text-base font-semibold">Subscriptions</h3>
                            {/* We could map subscriptions here later */}
                            <p className="px-3 text-sm text-gray-400">No subscriptions yet</p>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}

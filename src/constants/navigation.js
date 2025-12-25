import {
    Home,
    Compass,
    PlaySquare,
    Clock,
    History,
    ThumbsUp,
    LayoutDashboard as Dashboard
} from 'lucide-react';

/**
 * Sidebar Menu Items Configuration
 * Main navigation items shown in the sidebar
 */
export const SIDEBAR_MENU_ITEMS = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Dashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Compass, label: 'Shorts', href: '/shorts' },
    { icon: PlaySquare, label: 'Subscriptions', href: '/subscriptions' },
];

/**
 * Sidebar Library Items Configuration
 * User's personal library section items
 */
export const SIDEBAR_LIBRARY_ITEMS = [
    { icon: History, label: 'History', href: '/history' },
    { icon: Clock, label: 'Watch Later', href: '/p/watch-later' },
    { icon: ThumbsUp, label: 'Liked Videos', href: '/liked-videos' }
];

/**
 * Layout Configuration
 * Routes where navbar and sidebar should be hidden
 */
export const LAYOUT_EXCLUDED_ROUTES = [
    '/login',
    '/register',
    '/auth/callback'
];

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/Authcontext';
import { Menu, Search, Video, Bell, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search navigation
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-background border-b border-border z-50 flex items-center justify-between px-4">

      {/* Left: Menu & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <Menu size={24} />
        </button>
        <Link href="/" className="flex items-center gap-1">
          {/* Replace with your actual Logo if available */}
          <div className="bg-accent text-white p-1 rounded-md">
            <Video size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tighter">iStream</span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-4">
        <form onSubmit={handleSearch} className="flex w-full">
          <div className="flex flex-1 items-center bg-input border border-border rounded-l-full px-4 focus-within:border-blue-500 ml-8">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent outline-none py-2 text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="px-6 bg-secondary border border-l-0 border-border rounded-r-full hover:bg-border transition-colors">
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-3">
        <button className="hidden sm:block p-2 hover:bg-secondary rounded-full">
          <Video size={24} />
        </button>
        <button className="hidden sm:block p-2 hover:bg-secondary rounded-full relative">
          <Bell size={24} />
          {/* Notification Dot */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
        </button>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full overflow-hidden border border-border"
            >
              <img
                src={user.avatar || '/default-avatar.png'}
                alt="User"
                className="w-full h-full object-cover"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-10 w-64 bg-secondary shadow-lg rounded-xl overflow-hidden py-2 border border-border animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 border-b border-border mb-2">
                  <p className="font-semibold truncate">{user.fullName}</p>
                  <p className="text-sm text-gray-400 truncate">@{user.username}</p>
                </div>

                <Link href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-border">
                  <UserIcon size={20} />
                  <span>Profile</span>
                </Link>
                {/* ... other menu items ... */}
                <Link href={`Channel/${user.username}`} className="flex items-center gap-3 px-4 py-2 hover:bg-border">
                  <UserIcon size={20} />
                  <span>Channel</span>
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-border text-red-400"
                >
                  <LogOut size={20} /> {/* Need to import LogOut */}
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <button className="flex items-center gap-2 px-4 py-1.5 border border-border rounded-full hover:bg-secondary/50 text-blue-400 font-medium text-sm">
              <UserIcon size={20} />
              Sign in
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}

// Helper import for LogOut reused inside component
import { LogOut } from 'lucide-react'; 

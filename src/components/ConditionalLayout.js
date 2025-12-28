'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { LAYOUT_EXCLUDED_ROUTES } from '@/constants';

/**
 * Conditional Layout Wrapper
 * Defines which routes should show/hide the navbar and sidebar
 */
export default function ConditionalLayout({ children }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Check if current route should exclude layout
    const shouldExcludeLayout = LAYOUT_EXCLUDED_ROUTES.includes(pathname);


    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <>
            {/* Conditionally render Navbar */}
            {!shouldExcludeLayout && <Navbar toggleSidebar={toggleSidebar} />}

            <div className={shouldExcludeLayout ? '' : 'flex pt-14'}>
                {/* Conditionally render Sidebar */}
                {!shouldExcludeLayout && (
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                )}

                {/* Main Content Area */}
                <main
                    className={`flex-1 ${!shouldExcludeLayout
                        ? `p-4 transition-all duration-200 ${isSidebarOpen ? 'md:ml-60' : 'md:ml-[4.5rem]'
                        }`
                        : ''
                        }`}
                >
                    {children}
                </main>
            </div>
        </>
    );
}

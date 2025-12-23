'use client';

import { AuthProvider } from "./contexts/Authcontext.js";
import { ToastContainer } from 'react-toastify';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { usePathname } from 'next/navigation';

export default function MainLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <AuthProvider>
            {!isAuthPage && <Navbar toggleSidebar={toggleSidebar} />}

            <div className="flex pt-14">
                {!isAuthPage && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}

                {/* Main Content Area */}
                <main className={`flex-1 p-4 transition-all duration-200 ${!isAuthPage ? (isSidebarOpen ? 'md:ml-60' : 'md:ml-18') : ''}`}>
                    {children}
                </main>
            </div>

            <ToastContainer position="top-right" autoClose={2000} theme="dark" />
        </AuthProvider>
    );
}

'use client';

import { AuthProvider } from "./contexts/Authcontext.js";
import { ToastContainer } from 'react-toastify';
import { QueryProvider } from "@/providers/QueryProvider";
import ConditionalLayout from "@/components/ConditionalLayout";

export default function MainLayout({ children }) {
    return (
        <QueryProvider>
            <AuthProvider>
                <ConditionalLayout>
                    {children}
                </ConditionalLayout>

                <ToastContainer position="top-right" autoClose={2000} theme="dark" />
            </AuthProvider>
        </QueryProvider>
    );
}

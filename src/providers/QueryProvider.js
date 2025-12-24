'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
                        cacheTime: 10 * 60 * 1000, // Cache persists for 10 minutes
                        refetchOnWindowFocus: false, // Don't refetch on window focus
                        retry: 1, // Only retry failed requests once
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

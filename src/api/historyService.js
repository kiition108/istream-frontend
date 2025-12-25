import axiosInstance from '@/utils/axiosInstance';

const historyService = {
    // Get watch history
    getWatchHistory: async (page = 1, limit = 12) => {
        const response = await axiosInstance.get(`/api/v1/users/history?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Clear all watch history
    clearWatchHistory: async () => {
        const response = await axiosInstance.delete('/api/v1/users/history');
        return response.data;
    },

    // Delete specific video from watch history
    deleteVideoFromHistory: async (videoId) => {
        const response = await axiosInstance.delete(`/api/v1/users/history/${videoId}`);
        return response.data;
    }
};

export default historyService;

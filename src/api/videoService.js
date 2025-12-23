import axiosInstance from '@/utils/axiosInstance';

const videoService = {
    // Get all videos (paginated)
    getAllVideos: async (page = 1, limit = 9) => {
        const response = await axiosInstance.get(`/api/v1/video/album?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get single video by ID
    getVideoById: async (videoId) => {
        const response = await axiosInstance.get(`/api/v1/video/${videoId}`);
        return response.data;
    },

    // Upload a new video
    uploadVideo: async (formData, onProgress) => {
        const response = await axiosInstance.post('/api/v1/video/videoUpload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: onProgress,
        });
        return response.data;
    },

    // Get comments for a video
    getComments: async (videoId) => {
        const response = await axiosInstance.get(`/api/v1/video/${videoId}/comments`);
        return response.data;
    },

    // Add a comment to a video
    addComment: async (videoId, content) => {
        const response = await axiosInstance.post(`/api/v1/video/${videoId}/comments`, { text: content });
        return response.data;
    },

    // Admin/Owner view of video
    getVideoAdminOwner: async (videoId) => {
        const response = await axiosInstance.get(`/api/v1/video/adminOwner/${videoId}`);
        return response.data;
    },

    // Update video
    updateVideo: async (videoId, formData) => {
        const response = await axiosInstance.put(`/api/v1/video/${videoId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete video
    deleteVideo: async (videoId) => {
        const response = await axiosInstance.delete(`/api/v1/video/${videoId}`);
        return response.data;
    },

    // Toggle publish status
    togglePublish: async (videoId) => {
        const response = await axiosInstance.patch(`/api/v1/video/toggle/publish/${videoId}`);
        return response.data;
    },

    // Get user specific videos
    getUserVideos: async (page = 1, limit = 9) => {
        const response = await axiosInstance.get(`/api/v1/video/user?page=${page}&limit=${limit}`);
        return response.data;
    }
};

export default videoService;

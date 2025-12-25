import axiosInstance from '@/utils/axiosInstance';

const userService = {
    // Get current user
    getCurrentUser: async () => {
        const response = await axiosInstance.get('/api/v1/users/current-user');
        return response.data;
    },

    // Login
    login: async (credentials) => {
        // usually this might be a regular axios call if it sets cookies, but using instance is fine if configured
        const response = await axiosInstance.post('/api/v1/users/login', credentials);
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await axiosInstance.post('/api/v1/users/logout');
        return response.data;
    },

    // Register
    register: async (userData) => {
        const response = await axiosInstance.post('/api/v1/users/register', userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get Channel Profile
    getChannelProfile: async (username) => {
        const response = await axiosInstance.get(`/api/v1/users/c/${username}`);
        return response.data;
    },

    // Update Account
    updateAccount: async (data) => {
        const response = await axiosInstance.patch('/api/v1/users/update-account', data);
        return response.data;
    },

    // Update Avatar
    updateAvatar: async (formData) => {
        const response = await axiosInstance.patch('/api/v1/users/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Update Cover Image
    updateCoverImage: async (formData) => {
        const response = await axiosInstance.patch('/api/v1/users/cover-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Change Password
    changePassword: async (passwords) => {
        const response = await axiosInstance.post('/api/v1/users/change-password', passwords);
        return response.data;
    },

    // Get liked videos
    getLikedVideos: async (page = 1, limit = 9) => {
        const response = await axiosInstance.get(`/api/v1/users/liked-videos?page=${page}&limit=${limit}`);
        return response.data;
    }
};

export default userService;

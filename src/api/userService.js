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

    // Toggle Subscription
    toggleSubscription: async (channelId) => {
        // This is a toggle endpoint or we check status logic? 
        // Based on previous code, it had separate DELETE and POST logic.
        // We can expose both or a toggle if the backend supports it.
        // I'll expose verify specific actions to be safe.
        // Wait, the previous code had logic to check `isSubscribed` then calling delete or post.
        // I will implement subscribe and unsubscribe.
    },

    subscribe: async (channelId) => {
        const response = await axiosInstance.post(`/api/v1/subscriptions/${channelId}`);
        return response.data;
    },

    unsubscribe: async (channelId) => {
        const response = await axiosInstance.delete(`/api/v1/subscriptions/${channelId}`);
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
    }
};

export default userService;

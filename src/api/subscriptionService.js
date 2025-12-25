import axiosInstance from '@/utils/axiosInstance';

const subscriptionService = {
    // Get user's subscriptions
    getSubscriptions: async (page = 1, limit = 12) => {
        const response = await axiosInstance.get(`/api/v1/subscriptions?page=${page}&limit=${limit}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Subscribe to a channel
    subscribe: async (channelId) => {
        const response = await axiosInstance.post(`/api/v1/subscriptions/${channelId}`, {}, {
            withCredentials: true
        });
        return response.data;
    },

    // Unsubscribe from a channel
    unsubscribe: async (channelId) => {
        const response = await axiosInstance.delete(`/api/v1/subscriptions/${channelId}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Toggle subscription (subscribe if not subscribed, unsubscribe if subscribed)
    toggleSubscription: async (channelId, isCurrentlySubscribed) => {
        if (isCurrentlySubscribed) {
            return subscriptionService.unsubscribe(channelId);
        } else {
            return subscriptionService.subscribe(channelId);
        }
    },

    // Get channel subscription status
    getChannelSubscriptionStatus: async (channelId) => {
        const response = await axiosInstance.get(`/api/v1/subscriptions/status/${channelId}`, {
            withCredentials: true
        });
        return response.data;
    }
};

export default subscriptionService;

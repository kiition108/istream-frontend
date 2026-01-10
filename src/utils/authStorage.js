const isBrowser = typeof window !== 'undefined';

const authStorage = {
    // --- Token Management ---

    setToken: (token) => {
        if (!isBrowser) return;

        // Save to LocalStorage
        try {
            localStorage.setItem('accessToken', token);
        } catch (error) {
            console.error('Failed to save token to localStorage:', error);
        }

        // Save to Cookie (Simple implementation, expires in 7 days)
        const date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();

        // Only use Secure flag in production (HTTPS). Use Lax instead of Strict for better mobile compatibility
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? '; Secure' : '';

        document.cookie = `accessToken=${token || ""}${expires}; path=/${secureFlag}; SameSite=Lax`;
    },

    getToken: () => {
        if (!isBrowser) return null;

        // Try LocalStorage first
        const localToken = localStorage.getItem('accessToken');
        if (localToken) return localToken;

        // Fallback to Cookie
        const nameEQ = "accessToken=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    removeToken: () => {
        if (!isBrowser) return;

        // Remove from LocalStorage
        localStorage.removeItem('accessToken');

        // Remove from Cookie
        document.cookie = "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    },

    // --- User Management ---

    setUser: (user) => {
        if (!isBrowser) return;
        try {
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Failed to save user to localStorage:', error);
        }
    },

    getUser: () => {
        if (!isBrowser) return null;
        const userStr = localStorage.getItem('user');
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    },

    removeUser: () => {
        if (!isBrowser) return;
        localStorage.removeItem('user');
    }
};

export default authStorage;

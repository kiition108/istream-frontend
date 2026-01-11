'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import authStorage from '@/utils/authStorage'
import { userService } from '@/api'
import Loader from '@/components/Loader'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return authStorage.getUser();
  })


  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const isAuthenticated = !!user

  useEffect(() => {
    const fetchUser = async () => {
      // Skip auth check on login/register/callback pages to prevent redirect loops
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        if (pathname === '/login' || pathname === '/register' || pathname === '/auth/callback') {
          setLoading(false);
          return;
        }
      }

      // Optimization: Check if we have a token first
      const token = authStorage.getToken();
      const storedUser = authStorage.getUser();
      
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      // If we have both token and user in storage, use them immediately
      if (token && storedUser) {
        setUser(storedUser);
        setLoading(false);
        // Optionally verify in background, but don't block rendering
        return;
      }

      try {
        const response = await userService.getCurrentUser();

        if (response.success || response.statusCode === 200) {
          setUser(response.data)
          authStorage.setUser(response.data);
        } else {
          setUser(null)
          authStorage.removeUser();
          authStorage.removeToken();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Don't clear token on network errors - keep user logged in
        // Only clear if it's an authentication error (401/403)
        if (error.response?.status === 401 || error.response?.status === 403) {
          setUser(null)
          authStorage.removeUser();
          authStorage.removeToken();
        } else if (storedUser) {
          // Network error but we have stored user - keep them logged in
          setUser(storedUser);
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = async () => {
    try {
      await userService.logout();
      setUser(null)
      authStorage.removeUser();
      authStorage.removeToken();
      router.push('/')
    } catch (err) {
      // Force logout on client even if server fails
      setUser(null)
      authStorage.removeUser();
      authStorage.removeToken();
      router.push('/')
    }
  }

  // Method to set user directly (used by OAuth callback)
  // Wrapped in useCallback to prevent recreation on every render
  const setUserDirectly = useCallback((userData) => {
    setUser(userData);
    authStorage.setUser(userData);
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, setUser: setUserDirectly, logout }}>
      {loading ? <Loader fullScreen /> : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

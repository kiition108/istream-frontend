'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import authStorage from '@/utils/authStorage'
import { userService } from '@/api'
import Loader from '@/components/Loader'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
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

      // Get stored credentials
      const token = authStorage.getToken();
      const storedUser = authStorage.getUser();
      
      // No token = not authenticated
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      // If we have both token and user in storage, use them immediately
      // This is critical for mobile/incognito where re-fetching might fail
      if (token && storedUser) {
        console.log('Loading user from storage:', storedUser.username || storedUser.email);
        setUser(storedUser);
        setLoading(false);
        
        // NO background verification - trust stored credentials completely
        // Only verify when user explicitly refreshes or navigates
        return;
      }

      // Only reach here if we have token but no stored user
      // This shouldn't happen in normal flow, but handle it gracefully
      if (token && !storedUser) {
        console.log('Token exists but no user data - fetching from API');
        try {
          const response = await userService.getCurrentUser();

          if (response.success || response.statusCode === 200) {
            setUser(response.data)
            authStorage.setUser(response.data);
          } else {
            console.log('Failed to fetch user - clearing credentials');
            setUser(null)
            authStorage.removeUser();
            authStorage.removeToken();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          // Only clear on actual auth errors, not network issues
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('Authentication invalid - clearing credentials');
            setUser(null)
            authStorage.removeUser();
            authStorage.removeToken();
          } else {
            console.log('Network error - keeping token for retry');
            // Keep token but set user to null - will retry on next page load
            setUser(null);
          }
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false);
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

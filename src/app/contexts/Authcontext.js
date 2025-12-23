'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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
      // Skip auth check on login/register pages to prevent redirect loops
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        if (pathname === '/login' || pathname === '/register') {
          setLoading(false);
          return;
        }
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
        console.error('Initial auth check failed:', error)
        setUser(null)
        authStorage.removeUser();
        authStorage.removeToken();
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
      console.error('Logout failed:', err)
      // Force logout on client even if server fails?
      setUser(null)
      authStorage.removeUser();
      authStorage.removeToken();
      router.push('/')
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, setUser, logout }}>
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

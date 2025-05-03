'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

// 1. Create the context
const AuthContext = createContext()

// 2. AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user
  const router= useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/current-user`, {
          withCredentials: true,
        })
        setUser(res.data.data) // Set full user object, not just ID
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/logout`, { withCredentials: true })
      setUser(null)
      router.push('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, setUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// 3. useAuth custom hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

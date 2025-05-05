'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/utils/axiosInstance'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      return storedUser ? JSON.parse(storedUser) : null
    }
    return null
  })

  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const isAuthenticated = !!user

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/current-user`,
          {
            withCredentials: true,
            validateStatus: (status) => status < 500,
          }
        )

        if (res.status === 200) {
          setUser(res.data.data)
          localStorage.setItem('user', JSON.stringify(res.data.data))
        } else {
          setUser(null)
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('Initial auth check failed:', error)
        setUser(null)
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = async () => {
    try {
      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/logout`,
        {},
        { withCredentials: true }
      )
      setUser(null)
      localStorage.removeItem('user')
      router.push('/')
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

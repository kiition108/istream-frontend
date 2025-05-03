'use client'

import { useState, useEffect, useRef } from 'react'
import { PencilIcon } from '@heroicons/react/24/outline'
import Navbar from '../../components/Navbar.js'

export default function UserProfile() {
  const [user, setUser] = useState({
    fullName: '',
    username: '',
    avatar: '',
    coverImage: '',
  })

  const [editField, setEditField] = useState(null)
  const [message, setMessage] = useState('')

  const avatarInputRef = useRef(null)
  const coverInputRef = useRef(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/current-user`, {
          method: 'GET',
          credentials: 'include',
        })
        const response = await res.json()
        if (res.ok) {
          setUser({
            fullName: response.data.fullName,
            username: response.data.username,
            avatar: response.data.avatar,
            coverImage: response.data.coverImage,
          })
        }
      } catch (err) {
        console.error('Error fetching user:', err)
      }
    }

    checkAuth()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleAutoImageUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append(field, file)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${field}`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      })

      const response = await res.json()
      if (res.ok) {
        setUser((prev) => ({
          ...prev,
          [field]: response.data[field],
        }))
        setMessage(`${field} updated successfully`)
      } else {
        setMessage(`Failed to update ${field}`)
      }
    } catch (err) {
      console.error(err)
      setMessage(`Error updating ${field}`)
    }
  }

  const saveField = async (field) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/update-account`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [field]: user[field],
        }),
      })

      const response = await res.json()
      if (res.ok) {
        setMessage(`${field} updated successfully`)
      } else {
        setMessage(`Failed to update ${field}`)
      }
      setEditField(null)
    } catch (err) {
      console.error(err)
      setMessage(`Error updating ${field}`)
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cover Image */}
        <div className="relative">
          <img
            src={user.coverImage || '/default-cover.jpg'}
            alt="Cover"
            className="w-full h-48 object-cover"
          />
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            className="hidden"
            onChange={(e) => handleAutoImageUpload(e, 'coverImage')}
          />
          <button
            className="absolute top-2 left-2 bg-white p-1 rounded-full"
            onClick={() => coverInputRef.current?.click()}
          >
            <PencilIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center p-6">
          <div className="relative">
            <img
              src={user.avatar || '/default-avatar.png'}
              alt="Profile"
              className="h-24 w-24 rounded-full border-4 border-white -mt-12 object-cover"
            />
            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              className="hidden"
              onChange={(e) => handleAutoImageUpload(e, 'avatar')}
            />
            <button
              className="absolute top-0 right-0 bg-white p-1 rounded-full"
              onClick={() => avatarInputRef.current?.click()}
            >
              <PencilIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Full Name */}
          <div className="mt-4 text-center">
            {editField === 'fullName' ? (
              <div className="flex flex-col items-center">
                <input
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                  className="text-xl text-gray-600 text-center border-b"
                />
                <button
                  className="mt-1 text-sm text-white bg-green-600 px-2 rounded"
                  onClick={() => saveField('fullName')}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <h2 className="text-xl text-gray-600 font-semibold">{user.fullName}</h2>
                <button onClick={() => setEditField('fullName')}>
                  <PencilIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Username */}
          <div className="mt-2 text-center">
            {editField === 'username' ? (
              <div className="flex flex-col items-center">
                <input
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  className="text-gray-500 text-center border-b"
                />
                <button
                  className="mt-1 text-sm text-white bg-green-600 px-2 rounded"
                  onClick={() => saveField('username')}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <p className="text-gray-500">@{user.username}</p>
                <button onClick={() => setEditField('username')}>
                  <PencilIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Message */}
          {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
        </div>
      </div>
    </>
  )
}

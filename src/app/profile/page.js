'use client'

import { useState, useRef } from 'react'
import { PencilIcon } from '@heroicons/react/24/outline'
import Navbar from '../../components/Navbar'
import { useAuth } from '@/app/contexts/Authcontext.js'
import axiosInstance from '@/utils/axiosInstance'
import { toast, ToastContainer } from 'react-toastify'

export default function UserProfile() {
  const { user, setUser } = useAuth()
  const [editField, setEditField] = useState(null)
  const [message, setMessage] = useState('')

  const avatarInputRef = useRef(null)
  const coverInputRef = useRef(null)

  const [localUser, setLocalUser] = useState({
    email: user?.email|| '',
    fullName: user?.fullName || '',
    username: user?.username || '',
    avatar: user?.avatar || '',
    coverImage: user?.coverImage || '',
    description: user?.description || '',
  })
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  

  

  const handleChange = (e) => {
    const { name, value } = e.target
    setLocalUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleAutoImageUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append(field, file)

    try {
      const res = await axiosInstance.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${field}`,
        formData,
        { withCredentials: true }
      )
      const updatedUser = { ...localUser, [field]: res.data.data[field] }
      setLocalUser(updatedUser)
      setUser(updatedUser)
      toast.success(`${field} updated successfully`)
      setMessage(`${field} updated successfully`)
    } catch (err) {
      console.error(err)
      toast.error(`Failed to update ${field}`)
      setMessage(`Failed to update ${field}`)
    }
  }

  const saveField = async (field) => {
    try {
      const res = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/update-account`,
        { [field]: localUser[field] },
        { withCredentials: true }
      )
      const updatedUser = { ...localUser, [field]: res.data.data[field] }
      setLocalUser(updatedUser)
      setUser(updatedUser)
      toast.success(`${field} updated successfully`)
      setMessage(`${field} updated successfully`)
      setEditField(null)
    } catch (err) {
      console.error(err)
      toast.error(`Failed to update ${field}`)
      setMessage(`Failed to update ${field}`)
    }
  }
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
  
    try {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/change-password`,
        passwords,
        { withCredentials: true }
      );
      toast.success('Password changed successfully');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };
  
  return (
    <>
      <Navbar />
      <ToastContainer/>
      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cover Image */}
        <div className="relative">
          <img
            src={localUser.coverImage || '/default-cover.jpg'}
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
              src={localUser.avatar || '/default-avatar.png'}
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
                  value={localUser.fullName}
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
                <h2 className="text-xl text-gray-600 font-semibold">{localUser.fullName}</h2>
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
                  value={localUser.username}
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
                <p className="text-gray-500">@{localUser.username}</p>
                <button onClick={() => setEditField('username')}>
                  <PencilIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>
          {/*email*/}
          <div className="mt-2 text-center">
            {editField === 'email' ? (
              <div className="flex flex-col items-center">
                <input
                  name="username"
                  value={localUser.email}
                  onChange={handleChange}
                  className="text-gray-500 text-center border-b"
                />
                <input
                  type='number'
                  name='otp'
                  placeholder='Enter Otp'
                  className="text-gray-500 text-center border"
                />
                <button
                  className="mt-1 text-sm text-white bg-green-600 px-2 rounded"
                  onClick={() => saveField('otp')}
                ></button>
                <button
                  className="mt-1 text-sm text-white bg-green-600 px-2 rounded"
                  onClick={() => saveField('email')}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <p className="text-gray-500">@{localUser.email}</p>
                <button onClick={() => setEditField('email')}>
                  <PencilIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>
          {/* Description */}
          <div className="mt-4 text-center">
            {editField === 'description' ? (
              <div className="flex flex-col items-center">
                <input
                  name="description"
                  value={localUser.description}
                  onChange={handleChange}
                  className="text-xl text-gray-600 text-center border-b"
                />
                <button
                  className="mt-1 text-sm text-white bg-green-600 px-2 rounded"
                  onClick={() => saveField('description')}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <h2 className="text-xl text-gray-500">{localUser.description}</h2>
                <button onClick={() => setEditField('description')}>
                  <PencilIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>
            {/* Change Password Section */}
            <div className="mt-6 px-6 w-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Change Password</h3>
              <div className='space-y-2'>
              <div className="relative">
                <input
                  type={showPasswords.old ? 'text' : 'password'}
                  placeholder="Old Password"
                  className="w-full border px-4 py-2 rounded pr-10"
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm"
                  onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                >
                  {showPasswords.old ? '🙈' : '👁️'}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  placeholder="New Password"
                  className="w-full border px-4 py-2 rounded pr-10"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  className="w-full border px-4 py-2 rounded pr-10"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? '🙈' : '👁️'}
                </button>
              </div>
              <button
                  onClick={handleChangePassword}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Update Password
              </button>
              </div>
            </div>

          {/* {message && <p className="mt-4 text-sm text-red-500">{message}</p>} */}
        </div>
      </div>
    </>
  )
}

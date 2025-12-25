'use client'

import { useState, useRef } from 'react'
import { PencilIcon, Camera, Eye, EyeOff, Save, X } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { useAuth } from '@/app/contexts/Authcontext.js'
import { userService } from '@/api'
import { toast } from 'react-toastify'
import Image from 'next/image'

export default function UserProfile() {
  const { user, setUser } = useAuth()
  const [editField, setEditField] = useState(null)

  const avatarInputRef = useRef(null)
  const coverInputRef = useRef(null)

  const [localUser, setLocalUser] = useState({
    email: user?.email || '',
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
      let res;
      if (field === 'avatar') {
        res = await userService.updateAvatar(formData)
      } else if (field === 'coverImage') {
        res = await userService.updateCoverImage(formData)
      }
      const updatedUser = { ...localUser, [field]: res.data[field] }
      setLocalUser(updatedUser)
      setUser(updatedUser)
      toast.success(`${field} updated successfully`)
    } catch (err) {
      toast.error(`Failed to update ${field}`)
    }
  }

  const saveField = async (field) => {
    try {
      const res = await userService.updateAccount({ [field]: localUser[field] })
      const updatedUser = { ...localUser, [field]: res.data[field] }
      setLocalUser(updatedUser)
      setUser(updatedUser)
      toast.success(`${field} updated successfully`)
      setEditField(null)
    } catch (err) {
      toast.error(`Failed to update ${field}`)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      await userService.changePassword(passwords);
      toast.success('Password changed successfully');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 md:p-8 mt-4">
        {/* Cover & Avatar Section */}
        <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="relative h-48 md:h-64 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
            {localUser.coverImage && (
              <Image
                src={localUser.coverImage}
                alt="Cover"
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={coverInputRef}
              className="hidden"
              onChange={(e) => handleAutoImageUpload(e, 'coverImage')}
            />
            <button
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2 rounded-full transition-all"
              onClick={() => coverInputRef.current?.click()}
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Avatar & Basic Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20 md:-mt-24">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-xl bg-gray-800">
                  <Image
                    src={localUser.avatar || '/default-avatar.png'}
                    alt="Profile"
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  className="hidden"
                  onChange={(e) => handleAutoImageUpload(e, 'avatar')}
                />
                <button
                  className="absolute bottom-2 right-2 bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left">
                {/* Full Name */}
                {editField === 'fullName' ? (
                  <div className="flex items-center gap-2">
                    <input
                      name="fullName"
                      value={localUser.fullName}
                      onChange={handleChange}
                      className="text-2xl font-bold text-white bg-secondary border border-border rounded px-3 py-1 flex-1"
                    />
                    <button
                      className="p-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
                      onClick={() => saveField('fullName')}
                    >
                      <Save className="w-4 h-4 text-white" />
                    </button>
                    <button
                      className="p-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                      onClick={() => setEditField(null)}
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <h2 className="text-2xl font-bold text-white">{localUser.fullName}</h2>
                    <button onClick={() => setEditField('fullName')} className="text-gray-400 hover:text-white transition-colors">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Username */}
                <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                  <p className="text-gray-400">@{localUser.username}</p>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                  <p className="text-gray-500 text-sm">{localUser.email}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              {editField === 'description' ? (
                <div className="space-y-2">
                  <textarea
                    name="description"
                    value={localUser.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full text-gray-300 bg-secondary border border-border rounded-lg p-3"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => saveField('description')}
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => setEditField(null)}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <p className="text-gray-300 flex-1">{localUser.description || 'No description yet'}</p>
                  <button onClick={() => setEditField('description')} className="text-gray-400 hover:text-white transition-colors">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
          <div className="space-y-4">
            {/* Old Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.old ? 'text' : 'password'}
                  placeholder="Enter current password"
                  className="w-full pr-12 px-4 py-3 bg-secondary border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                >
                  {showPasswords.old ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className="w-full pr-12 px-4 py-3 bg-secondary border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className="w-full pr-12 px-4 py-3 bg-secondary border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

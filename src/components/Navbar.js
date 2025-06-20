'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/contexts/Authcontext'
import Link from 'next/link'
import Image from 'next/image'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  const baseLinks = [
    { name: 'Dashboard', href: '/home' },
    { name: 'Upload Video', href: '/video' },
  ]

  const linksToShow = isAuthenticated
    ? [...baseLinks, ...(user?.role === 'admin' ? [{ name: 'Approve Videos', href: '/videoApproval' }] : [])]
    : [...baseLinks, { name: 'Login', href: '/login' }, { name: 'Register', href: '/register' }]

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          {/* Mobile toggle */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
              <Bars3Icon className="block h-6 w-6" />
            </DisclosureButton>
          </div>

          {/* Logo + Links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link href="/"><Image src="/android-chrome-512x512.png"        // Path in /public or full URL
                                    alt="Logo" 
                                    width={40} 
                                    height={40} 
                              />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {linksToShow.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-green-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side */}
          {isAuthenticated && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white">
                <BellIcon className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
                      alt="User Avatar"
                    />
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <MenuItem as="a" href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </MenuItem>
                  <MenuItem as="a" href={`/Channel/${user.username}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Channel
                  </MenuItem>
                  <MenuItem
                    as="button"
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Links */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {linksToShow.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              className={classNames(
                pathname === item.href
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

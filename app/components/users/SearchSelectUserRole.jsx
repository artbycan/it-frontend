'use client'
import { useState, useEffect, useRef } from 'react'

export const USER_ROLES = [
  { id: 'admin', name: 'Admin' },
  { id: 'user', name: 'ผู้ใช้งานทั่วไป' },
  { id: 'guest', name: 'Guest' },
  { id: 'superadmin', name: 'Super Admin' },
  { id: 'manager', name: 'ผู้จัดการ' },
  { id: 'new_user', name: 'ผู้ใช้งานใหม่' },
]

export const getRoleColor = (roleId) => {
  switch(roleId) {
    case 'admin': return 'bg-purple-100 text-purple-800'
    case 'user': return 'bg-blue-100 text-blue-800'
    case 'guest': return 'bg-yellow-100 text-yellow-800'
    case 'superadmin': return 'bg-red-100 text-red-800'
    case 'manager': return 'bg-green-100 text-green-800'
    case 'new_user': return 'bg-indigo-100 text-indigo-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function SearchSelectUserRole({ value, onChange, required = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedRole = USER_ROLES.find(role => role.id === value)
  
  const filteredRoles = USER_ROLES.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
          value={selectedRole ? selectedRole.name : ''}
          onClick={() => setIsOpen(!isOpen)}
          placeholder="เลือกบทบาท"
          readOnly
          required={required}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <div className="p-2 border-b">
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="ค้นหาบทบาท..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {filteredRoles.map((role) => (
              <li
                key={role.id}
                onClick={() => {
                  onChange(role.id)
                  setIsOpen(false)
                  setSearchTerm('')
                }}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  value === role.id ? 'bg-blue-50' : ''
                }`}
              >
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(role.id)}`}>
                  {role.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
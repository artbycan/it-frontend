'use client'
import { useState, useEffect, useRef } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'

export default function SearchSelectUser({ value, onChange = () => {}, required = false }) {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.users.getAll, {
          headers: getAuthHeaders()
        })
        const result = await response.json()
        
        if (result.status === 200) {
          // Ensure data exists and is an array before mapping
          const flattenedUsers = Array.isArray(result.data) 
            ? result.data.map(userArray => Array.isArray(userArray) ? userArray[0] : userArray)
            : [];
          setUsers(flattenedUsers);
        } else {
          setError(result.message || 'ไม่สามารถดึงข้อมูลผู้ใช้ได้')
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
        setUsers([]); // Ensure users is an empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Add null check when finding selected user
  const selectedUser = users.length > 0 && value 
    ? users.find(user => user?.user_id == value) || null 
    : null;
  
  // Add null check when filtering users
  const filteredUsers = users.filter(user =>
    user && (
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.f_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.l_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getRoleColor = (role) => {
    switch(role) {
      case 'superadmin': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="relative_user" ref={dropdownRef}>
      <div className="relative_user">
        <input
          type="text"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
          value={selectedUser ? `${selectedUser.f_name} ${selectedUser.l_name} (${selectedUser.username})` : ''}
          onClick={() => setIsOpen(!isOpen)}
          placeholder="เลือกผู้ใช้..."
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
              placeholder="ค้นหาผู้ใช้..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {loading ? (
              <li className="px-4 py-2 text-gray-500">กำลังโหลด...</li>
            ) : error ? (
              <li className="px-4 py-2 text-red-500">{error}</li>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li
                  key={user.user_id}
                  onClick={() => onChange(user.user_id, {
                    f_name: user.f_name,
                    l_name: user.l_name
                  })}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    value == user.user_id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">
                        ชื่อ :{user.f_name} นามสกุล :{user.l_name} e-mail :{user.email}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">ไม่พบข้อมูล</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
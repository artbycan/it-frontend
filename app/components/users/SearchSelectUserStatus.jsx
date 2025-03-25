'use client'
import { useState, useEffect, useRef } from 'react'

const USER_STATUSES = [
  { id: 'active', name: 'Active' },
  { id: 'panding', name: 'Panding' },
  { id: 'rejected', name: 'Rejected' }
]

export default function SearchSelectUserStatus({ value, onChange, required = false }) {
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

  const selectedStatus = USER_STATUSES.find(status => status.id === value)
  
  const filteredStatuses = USER_STATUSES.filter(status =>
    status.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (statusId) => {
    switch(statusId) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'panding': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
          value={selectedStatus ? selectedStatus.name : ''}
          onClick={() => setIsOpen(!isOpen)}
          placeholder="เลือกสถานะ"
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
            <div>{value}</div>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="ค้นหาสถานะ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {filteredStatuses.map((status) => (
              <li
                key={status.id}
                onClick={() => {
                  onChange(status.id)
                  setIsOpen(false)
                  setSearchTerm('')
                }}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  value === status.id ? 'bg-blue-50' : ''
                }`}
              >
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status.id)}`}>
                  {status.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
'use client'
import { useState, useEffect, useRef } from 'react'

export const USER_STATUSES = [
  { id: '0', name: 'Active', description: 'ผู้ใช้งานปกติ' },
  { id: '1', name: 'Pending', description: 'รอการอนุมัติ' },
  { id: '2', name: 'Rejected', description: 'ถูกปฏิเสธ' },
  { id: '3', name: 'Inactive', description: 'ระงับการใช้งาน' },
  { id: '99', name: 'Deleted', description: 'ลบออกจากระบบ' }
]

export const getStatusLabel = (statusId) => {
  const status = USER_STATUSES.find(s => s.id === statusId)
  return status ? status.name : 'ไม่ระบุสถานะ'
}

export const getStatusColor = (statusId) => {
  const styleMap = {
    '0': 'bg-green-100 text-green-800',
    '1': 'bg-yellow-100 text-yellow-800',
    '2': 'bg-red-100 text-red-800',
    '3': 'bg-gray-100 text-gray-800',
    '99': 'bg-red-800 text-gray-100'
  }
  return styleMap[statusId] || 'bg-gray-100 text-gray-800'
}

export default function SearchSelectUserStatus({ value, onChange, required = false, type = 'select' }) {
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
    status.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    status.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (type === 'show') {
    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
        {getStatusLabel(value)}
      </div>
    )
  }

  return (
    <div>
      <label htmlFor="status" className="mb-1 text-sm text-gray-600">สถานะผู้ใช้</label>
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            id="status"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
            value={selectedStatus ? selectedStatus.name : ''}
            onClick={() => setIsOpen(!isOpen)}
            placeholder="เลือกสถานะ..."
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
                  <div className="flex flex-col">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status.id)}`}>
                      {status.name}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      {status.description}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
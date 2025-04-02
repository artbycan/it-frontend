'use client'
import { useState, useEffect, useRef } from 'react'

const GENDER_OPTIONS = [
  { id: '1', name: 'ชาย', description: 'เพศชาย' },
  { id: '2', name: 'หญิง', description: 'เพศหญิง' },
  { id: '3', name: 'ไม่ระบุเพศ', description: 'ไม่ระบุเพศ' }
]

export const getGenderLabel = (genderId) => {
  const gender = GENDER_OPTIONS.find(g => g.id === genderId)
  return gender ? gender.name : 'ไม่ระบุเพศ'
}

export const getGenderColor = (genderId) => {
  const styleMap = {
    '1': 'bg-blue-100 text-blue-800',
    '2': 'bg-pink-100 text-pink-800',
    '3': 'bg-gray-100 text-gray-800'
  }
  return styleMap[genderId] || 'bg-gray-100 text-gray-800'
}

export default function SearchSelectGender({ value, onChange, required = false, type = 'select' }) {
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

  const selectedGender = GENDER_OPTIONS.find(gender => gender.id === value)
  
  const filteredGenders = GENDER_OPTIONS.filter(gender =>
    gender.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (type === 'show') {
    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGenderColor(value)}`}>
        {getGenderLabel(value)}
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
          value={selectedGender ? selectedGender.name : ''}
          onClick={() => setIsOpen(!isOpen)}
          placeholder="เลือกเพศ"
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
              placeholder="ค้นหาเพศ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {filteredGenders.map((gender) => (
              <li
                key={gender.id}
                onClick={() => {
                  onChange(gender.id)
                  setIsOpen(false)
                  setSearchTerm('')
                }}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  value === gender.id ? 'bg-blue-50' : ''
                }`}
              >
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getGenderColor(gender.id)}`}>
                  {gender.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
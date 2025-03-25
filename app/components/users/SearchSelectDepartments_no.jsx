'use client'
import { useState, useEffect, useRef } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'

export default function SearchSelectDepartments({ 
  apiUrl = `${API_ENDPOINTS.main}/departments/get`,
  labelKey = 'departments_name',
  valueKey = 'departments_id',
  placeholder = 'ค้นหาแผนก/หน่วยงาน',
  value,
  onChange,
  required = false 
}) {
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
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

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(apiUrl)
        const result = await response.json()
        if (result.status === 200) {
          setItems(result.data.flat())
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchItems()
  }, [apiUrl])

  const selectedItem = items.find(item => item[valueKey] === value)
  
  const filteredItems = items.filter(item =>
    item[labelKey].toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
          value={selectedItem ? selectedItem[labelKey] : ''}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder}
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
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {isLoading ? (
              <li className="px-4 py-2 text-gray-500">กำลังโหลด...</li>
            ) : error ? (
              <li className="px-4 py-2 text-red-500">{error}</li>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <li
                  key={item[valueKey]}
                  onClick={() => {
                    onChange(item[valueKey])
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    value === item[valueKey] ? 'bg-blue-50' : ''
                  }`}
                >
                  {item[labelKey]}
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
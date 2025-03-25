'use client'
import { useState, useEffect, useRef } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'

export default function SearchSelectDepartments({ value, onChange, required = false }) {
  const [departments, setDepartments] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.departments.getAll, {
          headers: getAuthHeaders()
        })
        const result = await response.json()
        
        if (result.status === 200) {
          // Flatten the nested array structure
          const flattenedDepartments = result.data.map(deptArray => deptArray[0])
          setDepartments(flattenedDepartments)
        } else {
          setError('ไม่สามารถดึงข้อมูลแผนกได้')
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
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

  const selectedDepartment = departments.find(dept => dept.departments_id === value)
  
  const filteredDepartments = departments.filter(dept =>
    dept.departments_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
          value={selectedDepartment ? selectedDepartment.departments_name : ''}
          onClick={() => setIsOpen(!isOpen)}
          placeholder="เลือกแผนก"
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
              placeholder="ค้นหาแผนก..."
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
            ) : filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => (
                <li
                  key={dept.departments_id}
                  onClick={() => {
                    onChange(dept.departments_id)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    value === dept.departments_id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="font-medium">{dept.departments_name}</div>
                  <div className="text-sm text-gray-500">{dept.department_description}</div>
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
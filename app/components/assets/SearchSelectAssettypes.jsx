'use client'
import { useState, useEffect, useRef } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'

export default function SearchSelectAssettypes({ value, onChange = () => {}, required = false }) {
  const [assettypes, setAssettypes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const fetchAssettypes = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.assettypes.getAll, {
          headers: getAuthHeaders()
        })
        const result = await response.json()
        
        if (result.status === 200) {
          // Flatten the nested array structure
          const flattenedAssettypes = result.data.map(assettypesArray => assettypesArray[0])
          setAssettypes(flattenedAssettypes)
        } else {
          setError(result.message || 'ไม่สามารถดึงข้อมูลประเภทครุภัณฑ์ได้')
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
      } finally {
        setLoading(false)
      }
    }

    fetchAssettypes()
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

  const selectedAssettypes = assettypes.find(assettypes => assettypes.assettypes_id === value)
  
  const filteredAssettypes = assettypes.filter(assettypes =>
    assettypes.assettypes_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative_assettypes" ref={dropdownRef}>
      <div className="relative_assettypes">
        <input
          type="text"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
          value={selectedAssettypes ? `${selectedAssettypes.assettypes_name}` : ''}
          onClick={() => setIsOpen(!isOpen)}
          placeholder="เลือกประเภทครุภัณฑ์..."
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
              placeholder="ค้นหาประเภทครุภัณฑ์..."
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
            ) : filteredAssettypes.length > 0 ? (
              filteredAssettypes.map((assettypes) => (
                <li
                  key={assettypes.assettypes_id}
                  onClick={() => onChange(assettypes.assettypes_id,{
                    assettypes_name: assettypes.assettypes_name
                  })}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    value === assettypes.assettypes_id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{assettypes.assettypes_name}</div>
                      <div className="text-sm text-gray-500">
                        รหัสประเภทครุภัณฑ์: {assettypes.assettypes_id}
                      </div>
                      <div className="text-sm text-gray-500">
                        รายละเอียดประเภทครุภัณฑ์: {assettypes.department_description}
                      </div>
                    </div>
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
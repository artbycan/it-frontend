'use client'
import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'

export default function DepartmentDetails({ departmentId }) {
  const [department, setDepartment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!departmentId) {
        setDepartment(null)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_ENDPOINTS.departments.getById}/${departmentId}`, {
          headers: getAuthHeaders()
        })
        const result = await response.json()

        if (result.status === 200) {
          setDepartment(result.data)
        } else {
          setError('ไม่สามารถดึงข้อมูลแผนกได้')
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
      } finally {
        setLoading(false)
      }
    }

    fetchDepartment()
  }, [departmentId])

  if (!departmentId) return <span className="text-gray-500">-</span>
  if (loading) return <span className="text-gray-500">กำลังโหลด...</span>
  if (error) return <span className="text-red-500">{error}</span>
  if (!department) return <span className="text-gray-500">ไม่พบข้อมูล</span>

  return (
    <div className="text-sm">
      <span className="font-medium">{department.departments_name}</span>
      {department.department_description && (
        <p className="text-gray-500 text-xs mt-1">
          {department.department_description}
        </p>
      )}
    </div>
  )
}
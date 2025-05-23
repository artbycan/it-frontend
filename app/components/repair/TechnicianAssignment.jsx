'use client'
import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from "@/app/utils/auth";

export default function TechnicianAssignment({ onTechnicianAssigned }) {
  const [technician, setTechnician] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRandomTechnician = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(API_ENDPOINTS.task.assignTaskRandom, {
        headers: getAuthHeaders(),
      })
      
      const result = await response.json()
      if (result.status === 200) {
        setTechnician(result.data)
        onTechnicianAssigned(result.data)
      } else {
        setError('ไม่สามารถดึงข้อมูลช่างซ่อมได้')
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
    } finally {
      setLoading(false)
    }
  }

  // Add useEffect to fetch technician on mount
  useEffect(() => {
    fetchRandomTechnician()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-gray-700">ช่างซ่อม</label>
        {loading && <span className="text-sm text-gray-500">กำลังค้นหาช่างซ่อม...</span>}
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {technician && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">ช่างซ่อมที่ได้รับมอบหมาย</h4>
          <div className="space-y-1 text-sm">
            <p>รหัสประจำตัวช่างซ่อม: {technician.user_id}</p>
            <p>ชื่อผู้ใช้: {technician.username}</p>
            <p>ชื่อ-สกุล: {technician.f_name} {technician.l_name}</p>
            {/* <p>งานที่กำลังดำเนินการ: {technician.active_tasks} งาน</p> */}
          </div>
        </div>
      )}
    </div>
  )
}
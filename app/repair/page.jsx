'use client'
import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'
import { getAuthHeaders } from '../utils/auth'

export default function RepairDashboard() {
  const [repairs, setRepairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Status mapping
  const getStatusLabel = (status) => {
    const statusMap = {
      0: 'รอดำเนินการ',
      1: 'กำลังดำเนินการ',
      2: 'เสร็จสิ้น',
      3: 'ยกเลิก'
    }
    return statusMap[status] || 'ไม่ระบุสถานะ'
  }

  // Priority mapping
  const getPriorityLabel = (priority) => {
    const priorityMap = {
      1: 'ต่ำ',
      2: 'ปานกลาง',
      3: 'สูง',
      4: 'เร่งด่วน'
    }
    return priorityMap[priority] || 'ไม่ระบุ'
  }

  // Get status color
  const getStatusColor = (status) => {
    const colorMap = {
      0: 'bg-yellow-100 text-yellow-800',
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-green-100 text-green-800',
      3: 'bg-red-100 text-red-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  // Fetch repairs
  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        setLoading(true)
        
        // Get session from API route
        const sessionResponse = await fetch('/api/auth/get-session')
        const sessionData = await sessionResponse.json()
        
        if (sessionData.status !== 200 || !sessionData.user?.id) {
          throw new Error('กรุณาเข้าสู่ระบบใหม่อีกครั้ง')
        }

        const response = await fetch(`${API_ENDPOINTS.maintenance.getByUser}/${sessionData.user.id}`, {
            // const response = await fetch(`${API_ENDPOINTS.maintenance.getByUser}/1`, {
          headers: getAuthHeaders()
        })

        const result = await response.json()
        if (result.status === 200) {
          const validData = result.data
            .flat()
            .filter(item => item !== null)
          setRepairs(validData)
        } else {
          setError(result.message || 'ไม่สามารถดึงข้อมูลการแจ้งซ่อมได้')
        }
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRepairs()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ประวัติการแจ้งซ่อม</h1>

      {loading ? (
        <div className="text-center py-4">กำลังโหลด...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  รหัสแจ้งซ่อม
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  วันที่แจ้ง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  รายละเอียดปัญหา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  ความเร่งด่วน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {repairs.map((repair) => (
                <tr key={repair.request_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {repair.request_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(repair.request_date).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-6 py-4">
                    {repair.problem_detail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getPriorityLabel(repair.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(repair.request_status)}`}>
                      {getStatusLabel(repair.request_status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {repairs.length === 0 && (
            <div className="text-center py-4 text-gray-500">
                {sessionData.user?.id ? 'ไม่พบข้อมูลการแจ้งซ่อม' : 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import RepairStatus from '@/app/components/repair/RepairStatus'
import RepairPriority from '@/app/components/repair/RepairPriority'
import UserLayout from '@/app/components/UserLayout'

export default function TechnicianDashboard() {
  const [repairs, setRepairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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

        const response = await fetch(
          `${API_ENDPOINTS.maintenance.getByTechnician}/${sessionData.user.id}`,
          {
            headers: getAuthHeaders()
          }
        )

        const result = await response.json()
        if (result.status === 200) {
          const validData = result.data.flat().filter(item => item !== null)
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

  // Filter repairs based on search term
  const filteredRepairs = repairs.filter((repair) => {
    if (!repair) return false
    const searchLower = searchTerm.toLowerCase()
    return (
      repair.request_id?.toString().includes(searchLower) ||
      repair.problem_detail?.toLowerCase().includes(searchLower) ||
      repair.assets_name?.toLowerCase().includes(searchLower) ||
      repair.assets_num?.toLowerCase().includes(searchLower)
    )
  })

  // Calculate pagination
  const totalItems = filteredRepairs.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentItems = filteredRepairs.slice(startIndex, endIndex)

  // Calculate number of pending tasks (status = 0)
  const pendingTasks = repairs.filter(repair => repair.request_status === '0').length

  return (
    <div className="container mx-auto p-6">
      <UserLayout>
        <h1 className="text-2xl font-bold mb-6">รายการแจ้งซ่อมที่ได้รับมอบหมาย</h1>

        {pendingTasks > 0 && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
            <p>คุณมี {pendingTasks} รายการที่รอดำเนินการ</p>
          </div>
        )}

        {/* Search and Page Size Controls */}
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2 border rounded-lg"
            >
              <option value={5}>5 รายการ</option>
              <option value={10}>10 รายการ</option>
              <option value={20}>20 รายการ</option>
              <option value={50}>50 รายการ</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">กำลังโหลด...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
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
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((repair) => (
                  <tr key={repair.request_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {repair.request_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(repair.request_date).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4">{repair.problem_detail}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RepairPriority value={repair.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RepairStatus value={repair.request_status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/repair/${repair.request_id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          title="ดูรายละเอียด"
                        >
                          ℹ️
                        </button>
                      </Link>
                      <Link
                        href={`/repair/edit/${repair.request_id}`}
                        className="text-indigo-600 hover:text-indigo-900 ml-2"
                      >
                        <button
                          className="text-yellow-600 hover:text-yellow-800"
                          title="แก้ไข"
                        >
                          ✏️
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 flex justify-end items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            ก่อนหน้า
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            ถัดไป
          </button>
        </div>
      </UserLayout>
    </div>
  )
}
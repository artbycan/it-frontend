'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import FileDetailsModal from '../../components/FileDetailsModal'
import { API_ENDPOINTS } from '../../config/api'
import { getAuthHeaders } from '../../utils/auth'
import Image from 'next/image'

const formatFileId = (id) => {
  return `F${String(id).padStart(5, '0')}`
}

export default function FilesPage() {
  const [files, setFiles] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  // Filter files
  const filteredFiles = files.filter(file => {
    const searchLower = searchTerm.toLowerCase()
    return (
      formatFileId(file.file_id).toLowerCase().includes(searchLower) ||
      file.file_name.toLowerCase().includes(searchLower)
    )
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredFiles.length / pageSize)
  const indexOfLastItem = currentPage * pageSize
  const indexOfFirstItem = indexOfLastItem - pageSize
  const currentItems = filteredFiles.slice(indexOfFirstItem, indexOfLastItem)

  // Fetch files
  useEffect(() => {
    fetchFiles()
  }, [pageSize])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.files.getRange}/0/0`, {
        headers: getAuthHeaders()
      })
      const result = await response.json()
      if (result.status === 200) {
        setFiles(result.data)
      } else {
        setError('Failed to fetch files')
      }
    } catch (error) {
      setError('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleShowDetails = (file) => {
    setSelectedFile(file)
    setShowPreview(true)
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">จัดการไฟล์</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="border rounded px-3 py-1 w-64"
            />
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border rounded px-2 py-1"
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
          <div className="text-center py-4 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    รหัสไฟล์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    ชื่อไฟล์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    วันที่สร้าง
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    วันที่แก้ไข
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                ) : (
                  currentItems.map((file) => (
                    <tr key={file.file_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{formatFileId(file.file_id)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {/* <img //ส่วนแสดงผลรุปภาพตัวอย่างขนาดเล็ก
                            src={`${API_ENDPOINTS.files.get}/${file.file_name}`}
                            alt={file.file_name}
                            width={40}
                            height={40}
                            className="rounded mr-2 object-cover"
                          /> */}
                          {file.file_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(file.created_at).toLocaleString('th-TH')}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(file.updated_at).toLocaleString('th-TH')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleShowDetails(file)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          รายละเอียด
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
              <div>
                แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, files.length)} จาก {files.length} รายการ
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  หน้าแรก
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  ก่อนหน้า
                </button>
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === idx + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  ถัดไป
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  หน้าสุดท้าย
                </button>
              </div>
            </div>
          </div>
        )}

        {showPreview && selectedFile && (
          <FileDetailsModal
            file={selectedFile}
            onClose={() => {
              setShowPreview(false)
              setSelectedFile(null)
            }}
          />
        )}
      </div>
    </AdminLayout>
  )
}
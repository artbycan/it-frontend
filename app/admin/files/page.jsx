'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import FileDetailsModal from '../../components/FileDetailsModal'
import { API_ENDPOINTS } from '../../config/api'
import { getAuthHeaders } from '../../utils/auth'

// Add this helper function at the top of the file, after imports
const formatFileId = (id) => {
  return `F${String(id).padStart(10, '0')}`
}

export default function FilesPage() {
  const [files, setFiles] = useState([])
  const [pageSize] = useState(100)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Filter function for files
  const filteredFiles = files.filter(file => {
    if (!file) return false
    
    const searchLower = searchTerm.toLowerCase()
    return (
      (file.file_name?.toLowerCase() || '').includes(searchLower) ||
      (file.file_id?.toString() || '').includes(searchLower)
    )
  })
  .sort((a, b) => b.file_id - a.file_id) // Sort by file_id in descending order

  // Pagination calculations
  const totalPages = Math.ceil(totalCount / pageSize)
  const indexOfLastItem = currentPage * pageSize
  const indexOfFirstItem = indexOfLastItem - pageSize
  const currentItems = filteredFiles.slice(indexOfFirstItem, indexOfLastItem)

  // Fetch files with min/max parameters
  const fetchFiles = async () => {
    try {
      setLoading(true)
      const min = (currentPage - 1) * pageSize // Calculate starting index
      const max = min + pageSize // Next 100 records
      
      const response = await fetch(`${API_ENDPOINTS.files.getRange}/${min}/${max}`, {
        headers: getAuthHeaders()
      })
      const result = await response.json()
      if (result.status === 200) {
        setFiles(result.data || [])
      } else {
        setError('Failed to fetch files')
      }
    } catch (error) {
      setError('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Add function to fetch total count
  const fetchTotalCount = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.files.count, {
        headers: getAuthHeaders()
      })
      const result = await response.json()
      if (result.status === 200) {
        setTotalCount(result.data)
      }
    } catch (error) {
      console.error('Error fetching total count:', error)
    }
  }

  // Update useEffect to fetch both files and total count
  useEffect(() => {
    fetchFiles()
    fetchTotalCount()
  }, [currentPage, pageSize])

  // Add handler for showing details
  const handleShowDetails = (file) => {
    setSelectedFile(file)
    setIsDetailsModalOpen(true)
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
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((file) => (
                  <tr key={file.file_id}>
                    <td className="px-6 py-4">{formatFileId(file.file_id)}</td>
                    <td className="px-6 py-4">{file.file_name}</td>
                    <td className="px-6 py-4">
                      {new Date(file.created_at).toLocaleString('th-TH')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleShowDetails(file)}
                        className="inline-flex items-center text-gray-600 hover:text-gray-800"
                        title="รายละเอียดเพิ่มเติม"
                      >
                        <span className="mr-1">ℹ️</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span>
                  แสดง {((currentPage - 1) * pageSize) + 1} ถึง {Math.min(currentPage * pageSize, totalCount)} จาก {totalCount} รายการ
                </span>
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
      </div>

      {/* Add FileDetailsModal */}
      {isDetailsModalOpen && (
        <FileDetailsModal
          file={selectedFile}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </AdminLayout>
  )
}
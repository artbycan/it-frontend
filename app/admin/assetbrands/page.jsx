'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { API_ENDPOINTS } from '../../config/api'
import { getAuthHeaders } from '../../utils/auth'

export default function AssetbrandsPage() {
  const [assetbrands, setAssetbrands] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedAssetbrand, setSelectedAssetbrand] = useState(null)
  const [formData, setFormData] = useState({
    assetbrand_name: '',
    assetbrand_description: ''
  })
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Add new state for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = pageSize

  // Add this with other state declarations
  const [searchTerm, setSearchTerm] = useState('')

  // Update the filter function with null checks
  const filteredAssetbrands = assetbrands.filter(assetbrand => {
    // Return false if assetbrand is null or undefined
    if (!assetbrand) return false
    
    const searchLower = searchTerm.toLowerCase()
    return (
      (assetbrand.assetbrand_name?.toLowerCase() || '').includes(searchLower) ||
      (assetbrand.assetbrand_description?.toLowerCase() || '').includes(searchLower) ||
      (assetbrand.assetbrand_id?.toString() || '').includes(searchLower)
    )
  })

  // Update the pagination calculations to use filteredAssetbrands
  const totalPages = Math.ceil(filteredAssetbrands.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAssetbrands.slice(indexOfFirstItem, indexOfLastItem)

  // Fetch assetbrands
  useEffect(() => {
    fetchAssetbrands()
  }, [pageSize])

  // Update the fetchAssetbrands function to handle the data structure properly
  const fetchAssetbrands = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINTS.assetbrands.getAll, {
        headers: getAuthHeaders()
      })
      const result = await response.json()
      if (result.status === 200) {
        // Make sure we're getting valid data and filter out any null/undefined values
        const validData = result.data
          .map(item => Array.isArray(item) ? item[0] : item)
          .filter(item => item !== null && item !== undefined)
        setAssetbrands(validData)
      } else {
        setError('Failed to fetch assetbrands')
      }
    } catch (error) {
      setError('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedAssetbrand(null)
    setFormData({ assetbrand_name: '', assetbrand_description: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (assetbrand) => {
    setSelectedAssetbrand(assetbrand)
    setFormData({
      assetbrand_name: assetbrand.assetbrand_name,
      assetbrand_description: assetbrand.assetbrand_description
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('คุณต้องการลบยี่ห้อครุภัณฑ์นี้ใช่หรือไม่?')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.assetbrands.delete}/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })
        if (response.ok) {
          fetchAssetbrands()
        }
      } catch (error) {
        console.error('Error deleting assetbrand:', error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedAssetbrand) {
        // For editing existing assetbrand
        const updateData = {
          assetbrand_id: selectedAssetbrand.assetbrand_id,
          assetbrand_name: formData.assetbrand_name,
          assetbrand_description: formData.assetbrand_description
        }

        const response = await fetch(`${API_ENDPOINTS.assetbrands.update}/`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(updateData)
        })

        const result = await response.json()

        if (result.status === 200) {
          setIsModalOpen(false)
          fetchAssetbrands()
          // Optional: Add success message
          alert(result.message)
        } else {
          // Handle error
          alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล: ' + result.message)
        }
      } else {
        // For creating new assetbrand
        const response = await fetch(API_ENDPOINTS.assetbrands.create, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            assetbrand_name: formData.assetbrand_name,
            assetbrand_description: formData.assetbrand_description
          })
        })

        const result = await response.json()

        if (result.status === 200) {
          setIsModalOpen(false)
          fetchAssetbrands() // Refresh the assetbrands list
          alert('เพิ่มข้อมูลสำเร็จ: ' + result.message)
        } else {
          alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูล: ' + result.message)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
  }

  const handleShowDetails = (assetbrand) => {
    setSelectedAssetbrand(assetbrand)
    setIsDetailsModalOpen(true)
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">จัดการข้อมูลยี่ห้อครุภัณฑ์</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page when searching
              }}
              className="border rounded px-3 py-1 w-64"
            />
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={5}>5 รายการ</option>
              <option value={10}>10 รายการ</option>
              <option value={20}>20 รายการ</option>
              <option value={50}>50 รายการ</option>
            </select>
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              เพิ่มยี่ห้อครุภัณฑ์
            </button>
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
                    รหัสยี่ห้อครุภัณฑ์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    ชื่อยี่ห้อครุภัณฑ์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    รายละเอียด
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
                {currentItems.map((assetbrand) => (
                  <tr key={assetbrand.assetbrand_id}>
                    <td className="px-6 py-4">{assetbrand.assetbrand_id}</td>
                    <td className="px-6 py-4">{assetbrand.assetbrand_name}</td>
                    <td className="px-6 py-4">{assetbrand.assetbrand_description}</td>
                    <td className="px-6 py-4">{new Date(assetbrand.created_at).toLocaleString('th-TH')}</td>
                    <td className="px-6 py-4">{new Date(assetbrand.updated_at).toLocaleString('th-TH')}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleShowDetails(assetbrand)}
                        className="inline-flex items-center text-gray-600 hover:text-gray-800"
                        title="รายละเอียดเพิ่มเติม"
                      >
                        <span className="mr-1">ℹ️</span>
                      </button>
                      <button
                        onClick={() => handleEdit(assetbrand)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        title="แก้ไขข้อมูล"
                      >
                        <span className="mr-1">✏️</span>
                      </button>
                      <button
                        onClick={() => handleDelete(assetbrand.assetbrand_id)}
                        className="inline-flex items-center text-red-600 hover:text-red-800"
                        title="ลบข้อมูล"
                      >
                        <span className="mr-1">🗑️</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
              <div>
                แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, assetbrands.length)} จาก {assetbrands.length} รายการ
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

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {selectedAssetbrand ? 'แก้ไขยี่ห้อครุภัณฑ์' : 'เพิ่มยี่ห้อครุภัณฑ์'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">ชื่อยี่ห้อครุภัณฑ์</label>
                  <input
                    type="text"
                    value={formData.assetbrand_name}
                    onChange={(e) => setFormData({ ...formData, assetbrand_name: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">รายละเอียด</label>
                  <textarea
                    value={formData.assetbrand_description}
                    onChange={(e) => setFormData({ ...formData, assetbrand_description: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDetailsModalOpen && selectedAssetbrand && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">รายละเอียดยี่ห้อครุภัณฑ์</h2>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">รหัสยี่ห้อครุภัณฑ์</p>
                    <p className="mt-1">{selectedAssetbrand.assetbrand_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">ชื่อยี่ห้อครุภัณฑ์</p>
                    <p className="mt-1">{selectedAssetbrand.assetbrand_name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">รายละเอียด</p>
                    <p className="mt-1">{selectedAssetbrand.assetbrand_description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">วันที่สร้าง</p>
                    <p className="mt-1">
                      {new Date(selectedAssetbrand.created_at).toLocaleString('th-TH')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">วันที่แก้ไข</p>
                    <p className="mt-1">
                      {new Date(selectedAssetbrand.updated_at).toLocaleString('th-TH')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
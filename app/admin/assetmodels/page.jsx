'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { API_ENDPOINTS } from '../../config/api'
import { getAuthHeaders } from '../../utils/auth'

export default function AssetmodelsPage() {
  const [assetmodels, setAssetmodels] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedAssetmodel, setSelectedAssetmodel] = useState(null)
  const [formData, setFormData] = useState({
    assetmodel_name: '',
    assetmodel_description: ''
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
  const filteredAssetmodels = assetmodels.filter(assetmodel => {
    // Return false if assetmodel is null or undefined
    if (!assetmodel) return false
    
    const searchLower = searchTerm.toLowerCase()
    return (
      (assetmodel.assetmodel_name?.toLowerCase() || '').includes(searchLower) ||
      (assetmodel.assetmodel_description?.toLowerCase() || '').includes(searchLower) ||
      (assetmodel.assetmodel_id?.toString() || '').includes(searchLower)
    )
  })

  // Update the pagination calculations to use filteredAssetmodels
  const totalPages = Math.ceil(filteredAssetmodels.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAssetmodels.slice(indexOfFirstItem, indexOfLastItem)

  // Fetch assetmodels
  useEffect(() => {
    fetchAssetmodels()
  }, [pageSize])

  // Update the fetchAssetmodels function to handle the data structure properly
  const fetchAssetmodels = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINTS.assetmodels.getAll, {
        headers: getAuthHeaders()
      })
      const result = await response.json()
      if (result.status === 200) {
        // Make sure we're getting valid data and filter out any null/undefined values
        const validData = result.data
          .map(item => Array.isArray(item) ? item[0] : item)
          .filter(item => item !== null && item !== undefined)
        setAssetmodels(validData)
      } else {
        setError('Failed to fetch assetmodels')
      }
    } catch (error) {
      setError('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedAssetmodel(null)
    setFormData({ assetmodel_name: '', assetmodel_description: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (assetmodel) => {
    setSelectedAssetmodel(assetmodel)
    setFormData({
      assetmodel_name: assetmodel.assetmodel_name,
      assetmodel_description: assetmodel.assetmodel_description
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('คุณต้องการลบรุ่นครุภัณฑ์นี้ใช่หรือไม่?')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.assetmodels.delete}/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })
        if (response.ok) {
          fetchAssetmodels()
        }
      } catch (error) {
        console.error('Error deleting assetmodel:', error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedAssetmodel) {
        // For editing existing assetmodel
        const updateData = {
          assetmodel_id: selectedAssetmodel.assetmodel_id,
          assetmodel_name: formData.assetmodel_name,
          assetmodel_description: formData.assetmodel_description
        }

        const response = await fetch(`${API_ENDPOINTS.assetmodels.update}/`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(updateData)
        })

        const result = await response.json()

        if (result.status === 200) {
          setIsModalOpen(false)
          fetchAssetmodels()
          // Optional: Add success message
          alert(result.message)
        } else {
          // Handle error
          alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล: ' + result.message)
        }
      } else {
        // For creating new assetmodel
        const response = await fetch(API_ENDPOINTS.assetmodels.create, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            assetmodel_name: formData.assetmodel_name,
            assetmodel_description: formData.assetmodel_description
          })
        })

        const result = await response.json()

        if (result.status === 200) {
          setIsModalOpen(false)
          fetchAssetmodels() // Refresh the assetmodels list
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

  const handleShowDetails = (assetmodel) => {
    setSelectedAssetmodel(assetmodel)
    setIsDetailsModalOpen(true)
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">จัดการข้อมูลรุ่นครุภัณฑ์</h1>
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
              เพิ่มรุ่นครุภัณฑ์
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
                    รหัสรุ่นครุภัณฑ์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    ชื่อรุ่นครุภัณฑ์
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
                {currentItems.map((assetmodel) => (
                  <tr key={assetmodel.assetmodel_id}>
                    <td className="px-6 py-4">{assetmodel.assetmodel_id}</td>
                    <td className="px-6 py-4">{assetmodel.assetmodel_name}</td>
                    <td className="px-6 py-4">{assetmodel.assetmodel_description}</td>
                    <td className="px-6 py-4">{new Date(assetmodel.created_at).toLocaleString('th-TH')}</td>
                    <td className="px-6 py-4">{new Date(assetmodel.updated_at).toLocaleString('th-TH')}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleShowDetails(assetmodel)}
                        className="inline-flex items-center text-gray-600 hover:text-gray-800"
                        title="รายละเอียดเพิ่มเติม"
                      >
                        <span className="mr-1">ℹ️</span>
                      </button>
                      <button
                        onClick={() => handleEdit(assetmodel)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        title="แก้ไขข้อมูล"
                      >
                        <span className="mr-1">✏️</span>
                      </button>
                      <button
                        onClick={() => handleDelete(assetmodel.assetmodel_id)}
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
                แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, assetmodels.length)} จาก {assetmodels.length} รายการ
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
                {selectedAssetmodel ? 'แก้ไขรุ่นครุภัณฑ์' : 'เพิ่มรุ่นครุภัณฑ์'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">ชื่อรุ่นครุภัณฑ์</label>
                  <input
                    type="text"
                    value={formData.assetmodel_name}
                    onChange={(e) => setFormData({ ...formData, assetmodel_name: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">รายละเอียด</label>
                  <textarea
                    value={formData.assetmodel_description}
                    onChange={(e) => setFormData({ ...formData, assetmodel_description: e.target.value })}
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

        {isDetailsModalOpen && selectedAssetmodel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">รายละเอียดรุ่นครุภัณฑ์</h2>
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
                    <p className="text-sm font-medium text-gray-500">รหัสรุ่นครุภัณฑ์</p>
                    <p className="mt-1">{selectedAssetmodel.assetmodel_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">ชื่อรุ่นครุภัณฑ์</p>
                    <p className="mt-1">{selectedAssetmodel.assetmodel_name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">รายละเอียด</p>
                    <p className="mt-1">{selectedAssetmodel.assetmodel_description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">วันที่สร้าง</p>
                    <p className="mt-1">
                      {new Date(selectedAssetmodel.created_at).toLocaleString('th-TH')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">วันที่แก้ไข</p>
                    <p className="mt-1">
                      {new Date(selectedAssetmodel.updated_at).toLocaleString('th-TH')}
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
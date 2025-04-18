'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/app/components/AdminLayout'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import ImageDisplay from '@/app/components/ImageDisplay'
import UploadFile from '@/app/components/UploadFile'
import StockForm from '@/app/components/stock/StockForm'
import AddStockModal from '@/app/components/stock/AddStockModal'

export default function StockLevelsDashboard() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false)
  const [selectedStockId, setSelectedStockId] = useState(null)

  const router = useRouter()

  const filteredStocks = stocks.filter((stock) => {
    if (!stock) return false
    const searchLower = searchTerm.toLowerCase()
    return (
      stock.item_no?.toString().toLowerCase().includes(searchLower) ||
      stock.item_name?.toLowerCase().includes(searchLower) ||
      stock.category?.toLowerCase().includes(searchLower)
    )
  })

  const totalItems = filteredStocks.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentItems = filteredStocks.slice(startIndex, endIndex)

  useEffect(() => {
    fetchStocks()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_ENDPOINTS.stock_levels.getAll, {
        headers: getAuthHeaders()
      })
      const result = await response.json()
      if (result.status === 200) {
        setStocks(result.data.flat())
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Failed to fetch stock levels')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const url = API_ENDPOINTS.stock_levels.create
      const method = 'POST'
      const submitData = formData

      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()
      if (result.status === 200) {
        fetchStocks()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Failed to save stock level')
    }
  }

  const handleDelete = async (stockId) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      const response = await fetch(`${API_ENDPOINTS.stock_levels.delete}/${stockId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      const result = await response.json()
      if (result.status === 200) {
        fetchStocks()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Failed to delete stock level')
    }
  }

  const handleViewDetail = (stockId) => {
    router.push(`/admin/stock_levels/${stockId}`)
  }

  const handleAddStock = (stockId) => {
    setSelectedStockId(stockId)
    setIsAddStockModalOpen(true)
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">จัดการสต๊อกอะไหล่</h1>
          <Link
            href="/admin/stock_levels/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            เพิ่มรายการใหม่
          </Link>
        </div>

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
          <div className="text-sm text-gray-600">
            แสดง {startIndex + 1} ถึง {Math.min(endIndex, totalItems)} จาก {totalItems} รายการ
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left">รหัสอะไหล่</th>
                    <th className="px-6 py-3 text-left">ชื่ออะไหล่</th>
                    <th className="px-6 py-3 text-left">หมวดหมู่</th>
                    <th className="px-6 py-3 text-left">คงเหลือ</th>
                    <th className="px-6 py-3 text-left">หน่วย</th>
                    <th className="px-6 py-3 text-left">ราคา</th>
                    <th className="px-6 py-3 text-left">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((stock) => (
                    <tr key={stock.stock_id} className="border-t">
                      <td className="px-6 py-4">{stock.item_no}</td>
                      <td className="px-6 py-4">{stock.item_name}</td>
                      <td className="px-6 py-4">{stock.category}</td>
                      <td className="px-6 py-4">{stock.quantity}</td>
                      <td className="px-6 py-4">{stock.unit}</td>
                      <td className="px-6 py-4">{stock.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(stock.stock_id)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          title="ดูรายละเอียด"
                        >
                          ℹ️
                        </button>
                        <button
                          onClick={() => router.push(`/admin/stock_levels/edit/${stock.stock_id}`)}
                          className="text-yellow-600 hover:text-yellow-800 mr-2"
                          title="แก้ไข"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(stock.stock_id)}
                          className="text-red-600 hover:text-red-800 mr-2"
                          title="ลบ"
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => handleAddStock(stock.stock_id)}
                          className="text-green-600 hover:text-green-800 mr-2"
                          title="เพิ่มสต็อก"
                        >
                          ➕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end items-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-blue-500 text-white hover:bg-blue-600"
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
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                ถัดไป
              </button>
            </div>
          </>
        )}
      </div>
      {isAddStockModalOpen && (
        <AddStockModal
          isOpen={isAddStockModalOpen}
          onClose={() => setIsAddStockModalOpen(false)}
          stockId={selectedStockId}
          onSuccess={fetchStocks}
        />
      )}
    </AdminLayout>
  )
}
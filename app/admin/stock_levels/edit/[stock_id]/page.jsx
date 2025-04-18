'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/app/components/AdminLayout'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import StockForm from '@/app/components/stock/StockForm'

export default function EditStockPage() {
  const router = useRouter()
  const params = useParams()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stockData, setStockData] = useState(null)

  useEffect(() => {
    const fetchStockDetail = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.stock_levels.getById}/${params.stock_id}`,
          {
            headers: getAuthHeaders(),
          }
        )
        const result = await response.json()
        if (result.status === 200) {
          setStockData(result.data)
        } else {
          setError(result.message)
        }
      } catch (error) {
        setError('ไม่สามารถดึงข้อมูลได้')
      } finally {
        setLoading(false)
      }
    }

    if (params.stock_id) {
      fetchStockDetail()
    }
  }, [params.stock_id])

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(API_ENDPOINTS.stock_levels.update, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          stock_id: params.stock_id
        })
      })

      const result = await response.json()
      if (result.status === 200) {
        router.push('/admin/stock_levels')
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการแก้ไขข้อมูล')
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">แก้ไขข้อมูลอะไหล่</h1>
            <button
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              ยกเลิก
            </button>
          </div>

          {error && (
            <div className="mb-4 text-red-500 bg-red-100 p-4 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div>กำลังโหลด...</div>
          ) : stockData ? (
            <StockForm
              onSubmit={handleSubmit}
              onCancel={() => router.back()}
              initialData={stockData}
              isEditing={true}
            />
          ) : (
            <div>ไม่พบข้อมูล</div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/app/components/AdminLayout'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import StockForm from '@/app/components/stock/StockForm'

export default function AddStockPage() {
  const router = useRouter()
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(API_ENDPOINTS.stock_levels.create, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      if (result.status === 200) {
        router.push('/admin/stock_levels')
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเพิ่มข้อมูล')
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">เพิ่มรายการอะไหล่ใหม่</h1>
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

          <StockForm
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isEditing={false}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
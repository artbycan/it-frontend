import { useState } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'

export default function StockUseModal({ isOpen, onClose, stock, onSuccess, userId, logId }) {
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(stock?.price || 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!userId || !logId) {
      setError('ข้อมูลไม่ครบถ้วน กรุณาระบุ user_id และ log_id')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.stock_levels.stockUse}`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: Number(quantity),
          price: Number(price),
          stock_id: stock.stock_id,
          user_id: userId,
          log_id: logId
        })
      })

      const result = await response.json()
      
      if (result.status === 200) {
        onSuccess()
        onClose()
      } else {
        setError(result.message || 'เกิดข้อผิดพลาดในการบันทึกการใช้สต็อก')
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">บันทึกการใช้สต็อก</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">จำนวนที่ใช้</label>
            <input
              type="number"
              min="1"
              max={stock?.quantity || 1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">ราคาต่อหน่วย</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
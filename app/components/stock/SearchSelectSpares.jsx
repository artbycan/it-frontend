'use client'
import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'

export default function SearchSelectSpares({ value, onChange }) {
  const [spares, setSpares] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    if (value) {
      try {
        const parsedValue = JSON.parse(value)
        setSelectedItem(parsedValue)
      } catch (e) {
        // Handle invalid JSON
      }
    }
  }, [value])

  useEffect(() => {
    fetchSpares()
  }, [])

  const fetchSpares = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.stock_levels.getAll, {
        headers: getAuthHeaders()
      })
      const result = await response.json()
      if (result.status === 200) {
        setSpares(result.data.flat())
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Failed to fetch spares')
    } finally {
      setLoading(false)
    }
  }

  const handleSpareSelect = (spare) => {
    const spareData = {
      stock_id: spare.stock_id,
      item_no: spare.item_no,
      item_name: spare.item_name,
      category: spare.category,
      quantity: spare.quantity,
      unit: spare.unit,
      price: spare.price,
      description: spare.description
    }
    setSelectedItem(spareData)
    onChange(JSON.stringify(spareData))
    setSearchTerm('')
  }

  const getQuantityBackgroundColor = (quantity) => {
    if (quantity < 1) return 'bg-red-100'
    if (quantity < 5) return 'bg-yellow-100'
    if (quantity < 10) return 'bg-orange-100'
    if (quantity < 20) return 'bg-green-100'
    if (quantity < 50) return 'bg-blue-100'
    if (quantity < 100) return 'bg-purple-100'
    if (quantity >= 100) return 'bg-gray-100'
    return ''
  }

  const filteredSpares = spares.filter(spare => 
    spare.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spare.item_no?.toString().includes(searchTerm) ||
    spare.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ค้นหาอะไหล่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <button
            onClick={() => setSearchTerm(' ')} // Space triggers display but doesn't filter
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ค้นหา
          </button>
        </div>
        
        {searchTerm && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-2 text-gray-500">กำลังโหลด...</div>
            ) : error ? (
              <div className="p-2 text-red-500">{error}</div>
            ) : filteredSpares.length === 0 ? (
              <div className="p-2 text-gray-500">ไม่พบรายการที่ค้นหา</div>
            ) : (
              filteredSpares.map((spare) => (
                <div
                  key={spare.stock_id}
                  onClick={() => handleSpareSelect(spare)}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${getQuantityBackgroundColor(spare.quantity)}`}
                >
                  <div className="font-medium">{spare.item_name}</div>
                  <div className="text-sm text-gray-600">
                    รหัส: {spare.item_no} | คงเหลือ: {spare.quantity} {spare.unit} ราคา: {spare.price} บาท
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {selectedItem && (
        <div className={`p-2 border rounded-lg ${getQuantityBackgroundColor(selectedItem.quantity)}`}>
          <div className="font-medium">{selectedItem.item_name}</div>
          <div className="text-sm text-gray-600">
            รหัส: {selectedItem.item_no} |
            รายละเอียด : {selectedItem.description} |
            หมวดหมู่: {selectedItem.category} |
            ราคา: {selectedItem.price} บาท
          </div>
        </div>
      )}
    </div>
  )
}
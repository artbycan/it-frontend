'use client'
import { useState, useEffect } from 'react'

export default function SearchSelectAssetmodel({ 
  apiUrl = 'http://localhost:8087/assetmodels/get',
  labelKey = 'assetmodel_name',
  valueKey = 'assetmodel_id',
  placeholder = 'ค้นหารุ่น/โมเดล',
  onSelect,
  required = false 
}) {
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(apiUrl)
        const result = await response.json()
        if (result.status === 200) {
          setItems(result.data.flat())
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchItems()
  }, [apiUrl])

  const filteredItems = items.filter(item =>
    item[labelKey].toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => {
          setSearchTerm('')
          setIsOpen(true)
        }}
        className="border rounded px-3 py-2 w-full"
        required={required}
      />
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded-b mt-1 max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-3 py-2">Loading...</div>
          ) : error ? (
            <div className="px-3 py-2 text-red-500">{error}</div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item[valueKey]}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelect(item[valueKey])
                  setSearchTerm(item[labelKey])
                  setIsOpen(false)
                }}
              >
                {item[labelKey]}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">ไม่พบข้อมูล</div>
          )}
        </div>
      )}
    </div>
  )
}

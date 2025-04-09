'use client'
import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'

export default function SearchSelectAssets({ onAssetSelected }) {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAsset, setSelectedAsset] = useState(null)

  // Fetch assets on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true)
        //ดึงข้อมูลครุภัณฑ์ที่มีสถานะ 0 (ใช้งานอยู่)
        const response = await fetch(`${API_ENDPOINTS.assets.getByStatus}/0`, {
          headers: {
            'Accept': 'application/json'
          }
        })

        const result = await response.json()
        if (result.status === 200) {
          setAssets(result.data)
        } else {
          setError('ไม่สามารถดึงข้อมูลครุภัณฑ์ได้')
        }
      } catch (error) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  // Filter assets based on search term
  const filteredAssets = assets.filter(asset => {
    const searchLower = searchTerm.toLowerCase()
    return (
      asset.assets_name.toLowerCase().includes(searchLower) ||
      asset.assets_num.toLowerCase().includes(searchLower) ||
      asset.serial_number.toLowerCase().includes(searchLower)
    )
  })

  // Handle asset selection
  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset)
    onAssetSelected(asset)
    setSearchTerm('')
  }

  return (
    <div className="relative">
      <label className="block text-gray-700 mb-2">ครุภัณฑ์</label>
      
      {selectedAsset ? (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{selectedAsset.assets_name}</h4>
              <p className="text-sm text-gray-600">รหัสครุภัณฑ์: {selectedAsset.assets_num}</p>
              <p className="text-sm text-gray-600">Serial Number: {selectedAsset.serial_number}</p>
              <p className="text-sm text-gray-600">ประเภท: {selectedAsset.assetstypes_name}</p>
              <p className="text-sm text-gray-600">แผนก: {selectedAsset.departments_name}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedAsset(null)
                onAssetSelected(null)
              }}
              className="text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </div>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="ค้นหาครุภัณฑ์..."
            className="w-full px-3 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {loading && (
            <div className="text-center py-4">กำลังโหลด...</div>
          )}

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          {searchTerm && !loading && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <button
                    key={asset.asset_id}
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b last:border-b-0"
                    onClick={() => handleAssetSelect(asset)}
                  >
                    <div className="font-medium">{asset.assets_name}</div>
                    <div className="text-sm text-gray-600">
                      รหัสครุภัณฑ์: {asset.assets_num}
                    </div>
                    <div className="text-sm text-gray-600">
                      แผนก: {asset.departments_name}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">ไม่พบครุภัณฑ์</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
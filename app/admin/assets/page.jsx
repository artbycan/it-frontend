'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/app/components/AdminLayout'
import AssetsDetailsModal from '@/app/components/assets/AssetsDetailsModal'
import AddAssetForm from '@/app/components/assets/AddAssetForm'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app//utils/auth'

const formatAssetId = (id) => {
  return `A${String(id).padStart(10, '0')}`
}

export default function AssetsPage() {
  const [assets, setAssets] = useState([])
  const [pageSize] = useState(100)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const totalPages = Math.ceil(totalCount / pageSize)

  const fetchAssets = async () => {
    try {
      setLoading(true)
      //const min = (currentPage - 1) * pageSize
      //const max = min + pageSize
      const max = 0
      const min = 0
      const response = await fetch(`${API_ENDPOINTS.assets.getRange}/${min}/${max}`, {
        headers: getAuthHeaders()
      })
      const result = await response.json()
      if (result.status === 200) {
        setAssets(result.data || [])
      } else {
        setError('Failed to fetch assets')
      }
    } catch (error) {
      setError('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleShowDetails = (asset) => {
    setSelectedAsset(asset)
    setIsDetailsModalOpen(true)
  }

  const handleAssetCreated = () => {
    fetchAssets()
  }

  useEffect(() => {
    fetchAssets()
  }, [currentPage])

  const filteredAssets = assets
    .filter(asset => {
      if (!asset) return false
      const searchLower = searchTerm.toLowerCase()
      return (
        asset.assets_name.toLowerCase().includes(searchLower) ||
        asset.assets_num.toLowerCase().includes(searchLower) ||
        asset.departments_name.toLowerCase().includes(searchLower) ||
        `${asset.f_name} ${asset.l_name}`.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => b.asset_id - a.asset_id)

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">จัดการครุภัณฑ์</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              เพิ่มครุภัณฑ์
            </button>
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                    รหัสครุภัณฑ์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    ชื่อครุภัณฑ์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    หมายเลขครุภัณฑ์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    แผนก
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    ผู้รับผิดชอบ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssets.map((asset) => (
                  <tr key={asset.asset_id}>
                    <td className="px-6 py-4">{formatAssetId(asset.asset_id)}</td>
                    <td className="px-6 py-4">{asset.assets_name}</td>
                    <td className="px-6 py-4">{asset.assets_num}</td>
                    <td className="px-6 py-4">{asset.departments_name}</td>
                    <td className="px-6 py-4">{`${asset.f_name} ${asset.l_name}`}</td>
                    <td className="px-6 py-4">{asset.status}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleShowDetails(asset)}
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
            
            {/* Pagination controls */}
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
              {/* ...existing pagination code... */}
            </div>
          </div>
        )}

        {isDetailsModalOpen && (
          <AssetsDetailsModal
            asset={selectedAsset}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        )}

        {isAddModalOpen && (
          <AddAssetForm
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={fetchAssets}
          />
        )}
      </div>
    </AdminLayout>
  )
}
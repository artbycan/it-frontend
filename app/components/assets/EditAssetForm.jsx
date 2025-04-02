'use client'
import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import SearchSelectUser from '@/app/components/users/SearchSelectUser'
//import SearchSelectDepartments from '@/app/components/SearchSelectDepartments'

export default function EditAssetForm({ asset, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    asset_id: asset.asset_id,
    assets_name: asset.assets_name,
    assets_num: asset.assets_num,
    user_id: asset.user_id,
    departments_id: asset.departments_id,
    status: asset.status,
    description: asset.description || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_ENDPOINTS.assets.update}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.status === 200) {
        onSuccess(result.data)
        onClose()
      } else {
        setError(result.message || 'ไม่สามารถแก้ไขข้อมูลได้')
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">แก้ไขครุภัณฑ์</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ชื่อครุภัณฑ์</label>
              <input
                type="text"
                value={formData.assets_name}
                onChange={(e) => setFormData({...formData, assets_name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">หมายเลขครุภัณฑ์</label>
              <input
                type="text"
                value={formData.assets_num}
                onChange={(e) => setFormData({...formData, assets_num: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">รหัสผู้รับผิดชอบ : { formData.user_id }</label>
              <SearchSelectUser
                value={formData.user_id}
                onChange={(userId) => setFormData({...formData, user_id: userId})}
                required
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">แผนก</label>
              <SearchSelectDepartments
                value={formData.departments_id}
                onChange={(deptId) => setFormData({...formData, departments_id: deptId})}
                required
              />
            </div> */}

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">รายละเอียด</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
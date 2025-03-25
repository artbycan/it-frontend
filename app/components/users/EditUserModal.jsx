'use client'
import { useState } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import SearchSelectDepartments from '@/app/components/users/SearchSelectDepartments'
import SearchSelectUserStatus from '@/app/components/users/SearchSelectUserStatus'
import SearchSelectGender from './SearchSelectGender'

export default function EditUserModal({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    user_id: user.user_id,
    username: user.username,
    f_name: user.f_name,
    l_name: user.l_name,
    email: user.email,
    departments_id: user.department_id,
    gender: user.gender || '',
    date_of_birth: user.date_of_birth || '',
    phone_number: user.phone_number || '',
    address: user.address || '',
    role: user.role || '',
    status: user.status || '',
    line_id: user.line_id || '',
    line_token: user.line_token || '',
    created_at: user.created_at,
    password: '' // Only include if changing password
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_ENDPOINTS.users.update}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.status === 200) {
        onSuccess(result.data)
        onClose()
      } else {
        setError(result.message || 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล')
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">แก้ไขข้อมูลผู้ใช้</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        <div>{formData.gender}{formData.departments_id}{formData.status}</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ชื่อผู้ใช้</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ชื่อ</label>
              <input
                type="text"
                value={formData.f_name}
                onChange={(e) => setFormData({...formData, f_name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">นามสกุล</label>
              <input
                type="text"
                value={formData.l_name}
                onChange={(e) => setFormData({...formData, l_name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">อีเมล</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">สถานะ</label>
                <SearchSelectUserStatus
                value={formData.status}
                onChange={(statusId) => setFormData({...formData, status: statusId})}
                required
                />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">แผนก</label>
              <SearchSelectDepartments
                value={formData.departments_id}
                onChange={(departmentId) => setFormData({...formData, departments_id: departmentId})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">เพศ</label>
              <SearchSelectGender
                value={formData.gender}
                onChange={(genderId) => setFormData({...formData, gender: genderId})}
                required
              />
            </div>

            {/* Add more form fields as needed */}
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
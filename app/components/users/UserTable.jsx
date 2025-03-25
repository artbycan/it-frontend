'use client'
import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import UserDetailsModal from './UserDetailsModal'
import EditUserModal from './EditUserModal'

export default function UserTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null)

  const pageSizeOptions = [5, 10, 20, 50, 100]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.users.getAll, {
        headers: getAuthHeaders()
      })
      const result = await response.json()
      
      if (result.status === 200) {
        // Flatten the nested array structure
        const flattenedUsers = result.data.map(userArray => userArray[0])
        setUsers(flattenedUsers)
      } else {
        setError('ไม่สามารถดึงข้อมูลได้')
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setLoading(false)
    }
  }

  // Get current users for pagination
  const indexOfLastUser = currentPage * pageSize
  const indexOfFirstUser = indexOfLastUser - pageSize
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.f_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.l_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const getStatusColor = (status) => {
    switch(status) {
      case '': return 'bg-red-100 text-red-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const getRoleColor = (role) => {
    switch(role) {
      case '': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const handleShowDetails = (user) => {
    setSelectedUser(user)
    setIsDetailsModalOpen(true)
  }

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize))
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const handleEditSuccess = (updatedUser) => {
    setUsers(users.map(u => 
      u.user_id === updatedUser.user_id ? updatedUser : u
    ))
  }

  if (loading) return <div className="text-center py-4">กำลังโหลด...</div>
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="ค้นหาผู้ใช้งาน..."
          className="px-4 py-2 border rounded-lg w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">แสดง:</label>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size} รายการ
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                userID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ชื่อผู้ใช้
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ชื่อ-นามสกุล
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                อีเมล
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                เบอร์โทรศัพท์
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                สถานะ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                บทบาท
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.user_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {`${user.f_name} ${user.l_name}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.phone_number || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                    {user.status || 'ไม่ระบุ'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {user.role || 'ไม่ระบุ'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShowDetails(user)}
                      className="text-blue-600 hover:text-blue-800"
                      title="ดูรายละเอียด"
                    >
                      ℹ️
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUserForEdit(user)
                        setIsEditModalOpen(true)
                      }}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="แก้ไข"
                    >
                      ✏️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex items-center">
          <p className="text-sm text-gray-700">
            แสดง{' '}
            <span className="font-medium">{indexOfFirstUser + 1}</span>
            {' '}ถึง{' '}
            <span className="font-medium">
              {Math.min(indexOfLastUser, filteredUsers.length)}
            </span>
            {' '}จาก{' '}
            <span className="font-medium">{filteredUsers.length}</span>
            {' '}รายการ ({pageSize} รายการต่อหน้า)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            หน้าแรก
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            ก่อนหน้า
          </button>

          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => paginate(idx + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            ถัดไป
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            หน้าสุดท้าย
          </button>
        </div>
      </div>

      {isDetailsModalOpen && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedUser(null)
          }}
        />
      )}

      {isEditModalOpen && selectedUserForEdit && (
        <EditUserModal
          user={selectedUserForEdit}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedUserForEdit(null)
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}
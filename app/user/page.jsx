'use client'
import { useState, useEffect } from 'react'
import UserLayout from '@/app/components/UserLayout'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import EditUserModal from '@/app/components/users/EditUserModalOneuser'

export default function UsersPage() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user_id from localStorage
        const userId = localStorage.getItem('user_id')
        if (!userId) {
          setError('ไม่พบข้อมูลผู้ใช้')
          return
        }

        const response = await fetch(`${API_ENDPOINTS.users.getById}/${userId}`, {
          headers: getAuthHeaders()
        })

        const result = await response.json()
        if (result.status === 200) {
          setUserData(result.data)
        } else {
          setError(result.message || 'ไม่สามารถดึงข้อมูลผู้ใช้ได้')
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleEditSuccess = (updatedUser) => {
    setUserData(updatedUser)
    setIsEditModalOpen(false)
  }

  if (loading) return (
    <UserLayout>
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </UserLayout>
  )

  if (error) return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    </UserLayout>
  )

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">ข้อมูลผู้ใช้</h1>
            {userData && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                แก้ไขข้อมูล
              </button>
            )}
          </div>
          
          {userData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium mb-4">ข้อมูลส่วนตัว</h2>
                <div className="space-y-3">
                  <p><span className="font-medium">ชื่อผู้ใช้:</span> {userData.username}</p>
                  <p><span className="font-medium">ชื่อ-นามสกุล:</span> {userData.f_name} {userData.l_name}</p>
                  <p><span className="font-medium">อีเมล:</span> {userData.email}</p>
                  <p><span className="font-medium">เบอร์โทร:</span> {userData.phone_number}</p>
                  <p><span className="font-medium">วันเกิด:</span> {userData.date_of_birth}</p>
                  <p><span className="font-medium">เพศ:</span> {
                    userData.gender === '1' ? 'ชาย' : 
                    userData.gender === '2' ? 'หญิง' : 'ไม่ระบุ'
                  }</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-4">ข้อมูลการใช้งาน</h2>
                <div className="space-y-3">
                  <p><span className="font-medium">สถานะ:</span> {
                    userData.status === '0' ? 'ใช้งาน' : 'ระงับการใช้งาน'
                  }</p>
                  <p><span className="font-medium">บทบาท:</span> {
                    {
                      '1': 'ช่างซ่อม',
                      '2': 'ผู้ใช้งานทั่วไป',
                      '5': 'ผู้ดูแลระบบ',
                      '6': 'หัวหน้าช่าง'
                    }[userData.role] || 'ไม่ระบุ'
                  }</p>
                  <p><span className="font-medium">ที่อยู่:</span> {userData.address}</p>
                  <p><span className="font-medium">Line ID:</span> {userData.line_id}</p>
                  <p><span className="font-medium">สร้างเมื่อ:</span> {new Date(userData.created_at).toLocaleDateString('th-TH')}</p>
                  <p><span className="font-medium">อัปเดตล่าสุด:</span> {new Date(userData.updated_at).toLocaleDateString('th-TH')}</p>
                </div>
              </div>
            </div>
          )}

          {isEditModalOpen && userData && (
            <EditUserModal
              user={userData}
              open={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSuccess={handleEditSuccess}
            />
          )}
        </div>
      </div>
    </UserLayout>
  )
}
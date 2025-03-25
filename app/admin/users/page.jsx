'use client'
import AdminLayout from '@/app/components/AdminLayout'
import UserTable from '@/app/components/users/UserTable'

export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">จัดการผู้ใช้งาน</h1>
        </div>
        <UserTable />
      </div>
    </AdminLayout>
  )
}
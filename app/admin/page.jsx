import AdminLayout from '../components/AdminLayout'

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">ยินดีต้อนรับสู่ระบบจัดการ</h1>
        <p className="text-gray-600">
          กรุณาเลือกเมนูด้านซ้ายเพื่อจัดการระบบ
        </p>
      </div>
    </AdminLayout>
  )
}
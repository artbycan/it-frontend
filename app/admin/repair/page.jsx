import AdminLayout from '@/app/components/AdminLayout'

export default function RepairPage() {
  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">ยินดีต้อนรับสู่ระบบจัดการการแจ้งซ่อมสำหรับช่าง</h1>
        <p className="text-gray-600">
          ข้อมูลการแจ้งซ่อมทั้งหมดจะถูกจัดเก็บและแสดงผลในระบบนี้ คุณสามารถเพิ่ม แก้ไข หรือลบข้อมูลการแจ้งซ่อมได้ตามต้องการ
        </p>
      </div>
    </AdminLayout>
  )
}
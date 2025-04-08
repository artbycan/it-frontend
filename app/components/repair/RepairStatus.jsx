'use client'

export const REPAIR_STATUS = [
  { id: '0', name: 'รอดำเนินการ', description: 'รอเจ้าหน้าที่รับเรื่อง' },
  { id: '1', name: 'กำลังดำเนินการ', description: 'อยู่ระหว่างการซ่อม' },
  { id: '2', name: 'เสร็จสิ้น', description: 'ดำเนินการเสร็จสิ้น' },
  { id: '3', name: 'ยกเลิก', description: 'ยกเลิกการแจ้งซ่อม' }
]

export const getStatusLabel = (statusId) => {
  const status = REPAIR_STATUS.find(s => s.id === statusId?.toString())
  return status ? status.name : 'ไม่ระบุสถานะ'
}

export const getStatusColor = (statusId) => {
  const colorMap = {
    '0': 'bg-yellow-100 text-yellow-800',
    '1': 'bg-blue-100 text-blue-800',
    '2': 'bg-green-100 text-green-800',
    '3': 'bg-red-100 text-red-800'
  }
  return colorMap[statusId] || 'bg-gray-100 text-gray-800'
}

export default function RepairStatus({ value, label = 'สถานะ' }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
      {getStatusLabel(value)}
    </span>
  )
}
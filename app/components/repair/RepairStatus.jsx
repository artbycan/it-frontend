'use client'

export const REPAIR_STATUS = [
  { id: '0', name: 'รอดำเนินการ(รอเจ้าหน้าที่รับเรื่อง)', description: 'รอเจ้าหน้าที่รับเรื่อง' },
  { id: '1', name: 'กำลังดำเนินการ(อยู่ระหว่างการซ่อม)', description: 'อยู่ระหว่างการซ่อม' },
  { id: '2', name: 'เสร็จสิ้น', description: 'ดำเนินการเสร็จสิ้น' },
  { id: '3', name: 'ส่งซ่อมร้าน', description: 'ส่งซ่อมต่อที่ร้าน' },
  { id: '4', name: 'รออะไหล่', description: 'รอสั่งอะไหล่' },
  { id: '5', name: 'ยกเลิก', description: 'ยกเลิกการแจ้งซ่อม' },
  { id: '6', name: 'ไม่สามารถซ่อมได้', description: 'ไม่สามารถซ่อมได้' },
  { id: '7', name: 'ส่งคืน', description: 'ส่งคืนให้ผู้แจ้งซ่อม' },
  { id: '8', name: 'รอการอนุมัติ', description: 'รอการอนุมัติจากผู้บังคับบัญชา' }

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
    '3': 'bg-red-100 text-red-800',
    '4': 'bg-orange-100 text-orange-800',
    '5': 'bg-gray-100 text-gray-800',
    '6': 'bg-purple-100 text-purple-800',
    '7': 'bg-teal-100 text-teal-800',
    '8': 'bg-pink-100 text-pink-800'
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
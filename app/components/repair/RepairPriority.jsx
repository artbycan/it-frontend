'use client'

export const REPAIR_PRIORITY = [
  { id: '1', name: 'ต่ำ', description: 'สามารถรอดำเนินการได้' },
  { id: '2', name: 'ปานกลาง', description: 'ควรดำเนินการเร็วที่สุด' },
  { id: '3', name: 'สูง', description: 'ต้องดำเนินการด่วน' },
  { id: '4', name: 'เร่งด่วน', description: 'ต้องดำเนินการทันที' }
]

export const getPriorityLabel = (priorityId) => {
  const priority = REPAIR_PRIORITY.find(p => p.id === priorityId?.toString())
  return priority ? priority.name : 'ไม่ระบุ'
}

export const getPriorityColor = (priorityId) => {
  const colorMap = {
    '1': 'bg-green-100 text-green-800',
    '2': 'bg-blue-100 text-blue-800',
    '3': 'bg-orange-100 text-orange-800',
    '4': 'bg-red-100 text-red-800'
  }
  return colorMap[priorityId] || 'bg-gray-100 text-gray-800'
}

export default function RepairPriority({ value, label = 'ความเร่งด่วน' }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(value)}`}>
      {getPriorityLabel(value)}
    </span>
  )
}
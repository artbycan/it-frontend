export const MAINTENANCE_TYPES = [
  { id: 0, name: 'รับงานใหม่', color: 'text-blue-600' ,bg: 'bg-blue-50'},
  { id: 1, name: 'ซ่อมโดยไม่ใช้อะไหล่', color: 'text-green-600' },
  { id: 2, name: 'ดำเนินการซ่อมแซมโดยเบิกจ่ายอะไหล่', color: 'text-yellow-600' },
  { id: 5, name: 'เสร็จสิ้นรอการส่งมอบ', color: 'text-purple-600' },
  { id: 3, name: 'ส่งซ่อมภายนอก', color: 'text-orange-600' },
  { id: 4, name: 'ประเมินว่าไม่สามารถซ่อมได้แทงจำหน่าย', color: 'text-red-600' },
  { id: 6, name: 'ส่งคืน', color: 'text-gray-600' },
  { id: 7, name: 'ส่งคืนอะไหล่', color: 'text-gray-600' },
  { id: 8, name: 'ส่งคืนอะไหล่ที่ไม่ใช้', color: 'text-gray-600' },
]

export const getTypeColor = (typeId) => {
  const type = MAINTENANCE_TYPES.find(t => t.id === parseInt(typeId))
  return type ? type.color : 'text-gray-600'
}
export const MAINTENANCE_TYPES = [
  { id: 0, name: 'รับงานใหม่', color: 'text-blue-600' },
  { id: 1, name: 'ซ่อมโดยไม่ใช้อะไหล่', color: 'text-green-600' },
  { id: 2, name: 'ดำเนินการซ่อมแซมโดยเบิกจ่ายอะไหล่', color: 'text-yellow-600' },
  { id: 3, name: 'ส่งซ่อมภายนอก', color: 'text-orange-600' },
  { id: 4, name: 'ประเมินว่าไม่สามารถซ่อมได้แทงจำหน่าย', color: 'text-red-600' },
]

export const getTypeColor = (typeId) => {
  const type = MAINTENANCE_TYPES.find(t => t.id === parseInt(typeId))
  return type ? type.color : 'text-gray-600'
}
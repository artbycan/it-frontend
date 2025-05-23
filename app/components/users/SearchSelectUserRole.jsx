'use client'
import { useState, useEffect, useRef } from 'react'

export const USER_ROLES = [
  { id: '5', name: 'Super Admin', description: 'ผู้ดูแลระบบระดับสูงสุด' },
  { id: '6', name: 'Admin(ไม่รับงานซ่อม)', description: 'ผู้ดูแลระบบ' },
  { id: '2', name: 'Manager', description: 'ผู้จัดการระบบ' },
  { id: '3', name: 'User', description: 'ผู้ใช้งานทั่วไป' },
  { id: '4', name: 'Guest', description: 'ผู้เยี่ยมชมระบบ' },
  { id: '0', name: 'New User', description: 'ผู้ใช้งานใหม่' },
  { id: '1', name: 'Technician', description: 'ช่างซ่อมบำรุง' },
]

export const getRoleLabel = (roleId) => {
  const role = USER_ROLES.find(r => r.id === roleId)
  return role ? role.name : 'ไม่ระบุบทบาท'
}

export const getRoleColor = (roleId) => {
  const styleMap = {
    '5': 'bg-red-100 text-red-800',
    '1': 'bg-purple-100 text-purple-800',
    '2': 'bg-green-100 text-green-800',
    '3': 'bg-blue-100 text-blue-800',
    '4': 'bg-yellow-100 text-yellow-800',
    '0': 'bg-indigo-100 text-indigo-800',
    '6': 'bg-orange-100 text-orange-800',
  }
  return styleMap[roleId] || 'bg-gray-100 text-gray-800'
}

export default function SearchSelectUserRole({ value, onChange, required = false, type = 'select' }) {
  if (type === 'show') {
    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(value)}`}>
        {getRoleLabel(value)}
      </div>
    )
  }

  return (
    <div>
      <label htmlFor="role" className="block text-sm font-medium text-gray-700">บทบาทผู้ใช้</label>
      <select
        id="role"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required={required}
      >
        <option value="">เลือกบทบาท</option>
        {USER_ROLES.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name} - {role.description}
          </option>
        ))}
      </select>
    </div>
  )
}
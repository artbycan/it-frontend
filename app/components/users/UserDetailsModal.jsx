'use client'
import { use, useState } from 'react'

export default function UserDetailsModal({ user, onClose }) {
  if (!user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">รายละเอียดผู้ใช้งาน</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">รหัสผู้ใช้</p>
            <p className="mt-1">{user.user_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ชื่อผู้ใช้</p>
            <p className="mt-1">{user.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ชื่อ-นามสกุล</p>
            <p className="mt-1">{`${user.f_name} ${user.l_name}`}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">อีเมล</p>
            <p className="mt-1">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">เพศ</p>
            <p className="mt-1">{user.gender || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">วันเกิด</p>
            <p className="mt-1">{user.date_of_birth || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</p>
            <p className="mt-1">{user.phone_number || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">LINE ID</p>
            <p className="mt-1">{user.line_id || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">สถานะ</p>
            <p className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                user.status !== '' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.status || 'ไม่ระบุ'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">บทบาท</p>
            <p className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                user.role !== '' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.role || 'ไม่ระบุ'}
              </span>
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">ที่อยู่</p>
            <p className="mt-1">{user.address || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">วันที่สร้าง</p>
            <p className="mt-1">{user.created_at ? new Date(user.created_at).toLocaleString('th-TH') : '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">วันที่แก้ไข</p>
            <p className="mt-1">{user.updated_at ? new Date(user.updated_at).toLocaleString('th-TH') : '-'}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  )
}
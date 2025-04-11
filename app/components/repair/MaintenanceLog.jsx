'use client'
import { useState } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import ImageDisplay from '@/app/components/ImageDisplay'
import UploadFile from '@/app/components/UploadFile'
import { MAINTENANCE_TYPES, getTypeColor } from './MaintenanceTypes'

export default function MaintenanceLog({ 
  requestId, 
  technicianId, 
  onLogCreated,
  onError 
}) {
  const [formData, setFormData] = useState({
    request_id: requestId,
    technician_id: technicianId,
    action_taken: '-',
    cost: 0.00,
    end_date: new Date().toISOString().slice(0, 16),
    img_url: 'noimg.jpg',
    log_no: 1,
    note: '-',
    spare_parts: '-',
    start_date: new Date().toISOString().slice(0, 16),
    type_action: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })

  const handleSubmit = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.maintenance_log.add, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      if (result.status === 200) {
        onLogCreated(result.data.id)
      } else {
        onError('ไม่สามารถบันทึกข้อมูลได้')
      }
    } catch (error) {
      onError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          ประเภทการดำเนินการ
        </label>
        <select
          value={formData.type_action}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            type_action: parseInt(e.target.value) 
          }))}
          className="w-full px-3 py-2 border rounded-lg"
          required
        >
          <option value="" disabled>เลือกประเภทการดำเนินการ</option>
          {MAINTENANCE_TYPES.map((type) => (
            <option
              key={type.id}
              value={type.id}
              className={type.color}
            >
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            วันที่เริ่มดำเนินการ
          </label>
          <input
            type="datetime-local"
            value={formData.start_date}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              start_date: e.target.value 
            }))}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            วันที่แล้วเสร็จ
          </label>
          <input
            type="datetime-local"
            value={formData.end_date}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              end_date: e.target.value 
            }))}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          การดำเนินการ
        </label>
        <textarea
          value={formData.action_taken}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            action_taken: e.target.value 
          }))}
          rows="3"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          อะไหล่ที่ใช้
        </label>
        <textarea
          value={formData.spare_parts}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            spare_parts: e.target.value 
          }))}
          rows="2"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          ค่าใช้จ่าย (บาท)
        </label>
        <input
          type="number"
          value={formData.cost}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            cost: Number(e.target.value) 
          }))}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          หมายเหตุ
        </label>
        <textarea
          value={formData.note}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            note: e.target.value 
          }))}
          rows="2"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          รูปภาพประกอบ (ถ้ามี)
        </label>
        <ImageDisplay
          urls={formData.img_url}
          showDelete={true}
          onDelete={(newUrls) => setFormData(prev => ({ 
            ...prev, 
            img_url: newUrls 
          }))}
        />
        <UploadFile
          apiUrl={API_ENDPOINTS.files.upLoad}
          onUploadSuccess={(urls) => {
            setFormData(prev => ({
              ...prev,
              img_url: prev.img_url ? `${prev.img_url},${urls}` : urls
            }))
          }}
          maxFiles={5}
          acceptedFileTypes="image/*"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        บันทึกข้อมูล
      </button>
    </div>
  )
}
'use client'
import { useState } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import ImageDisplay from '@/app/components/ImageDisplay'
import UploadFile from '@/app/components/UploadFile'
import SearchSelectSpares from '@/app/components/stock/SearchSelectSpares'
//import { MAINTENANCE_TYPES, getTypeColor } from './MaintenanceTypes'
import RepairStatusSelect from '@/app/components/repair/RepairStatusSelect'
import { getUserLineId, sendRepairStatusNotification } from '@/app/components/line/LineNotification'

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
    type_action: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })

  // Add new state for parsed spare parts data
  const [newSpare_parts, setNewSpare_parts] = useState(null)

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
        // Get user LINE ID
        const userData = await getUserLineId(requestId);
        // Send LINE notification ส่งการเปลี่ยนสถานะการซ่อมผ่าน line
        //console.log(requestId, userData, formData.type_action)
        await sendRepairStatusNotification(requestId, userData, formData.type_action);
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
        <RepairStatusSelect
          requestId={requestId}
          value={formData.type_action}
          onUpdate={(data) => setFormData(prev => ({ 
            ...prev, 
            type_action: data.request_status 
          }))}
          disabled={false}
        />
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
        </label>
        <SearchSelectSpares
          value={formData.spare_parts}
          onChange={(spareData) => {
            try {
              const parsedSpare = JSON.parse(spareData)
              setNewSpare_parts(parsedSpare)
              
              // Create formatted action text
              const actionText = `ดำเนินการเปลี่ยนอะไหล่: ${parsedSpare.item_name} ` +
                `(รหัส: ${parsedSpare.item_no}) ` +
                `หมวดหมู่: ${parsedSpare.category} ` +
                `จำนวน: 1 ${parsedSpare.unit} ` +
                `ราคา: ${parsedSpare.price} บาท ` +
                `รายละเอียด: ${parsedSpare.description || '-'}`

              setFormData(prev => ({ 
                ...prev, 
                spare_parts: spareData,
                action_taken: actionText,
                cost: parsedSpare.price
              }))
            } catch (error) {
              console.error('Error parsing spare parts data:', error)
              onError('ข้อมูลอะไหล่ไม่ถูกต้อง')
            }
          }}
        />
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
        //onMouseOver={console.log(formData)}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        บันทึกข้อมูล
      </button>
    </div>
  )
}
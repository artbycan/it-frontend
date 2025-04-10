'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { API_ENDPOINTS } from '@/app/config/api'
import { getAuthHeaders } from '@/app/utils/auth'
import UserLayout from '@/app/components/UserLayout'
import ImageDisplay from '@/app/components/ImageDisplay'
import UploadFile from '@/app/components/UploadFile'
//import SearchSelectAssets from '@/app/components/repair/SearchSelectAssets'
import TechnicianAssignment from '@/app/components/repair/TechnicianAssignment'
import { REPAIR_PRIORITY, getPriorityColor } from '@/app/components/repair/RepairPriority'

export default function EditRepair() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState({
    request_id: '',
    asset_id: '',
    img_url: '',
    priority: '',
    problem_detail: '',
    request_date: '',
    request_status: '',
    technician_id: '',
    user_id: '',
    updated_at: new Date().toISOString()
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showTechnicianAssignment, setShowTechnicianAssignment] = useState(false)

  // Fetch repair data
  useEffect(() => {
    const fetchRepairData = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.maintenance.getById}/${params.request_id}`,
          {
            headers: getAuthHeaders(),
          }
        )
        const result = await response.json()
        
        if (result.status === 200) {
          setFormData(result.data)
        } else {
          setError('ไม่สามารถดึงข้อมูลการแจ้งซ่อมได้')
        }
      } catch (error) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
      } finally {
        setLoading(false)
      }
    }

    if (params.request_id) {
      fetchRepairData()
    }
  }, [params.request_id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(
        `${API_ENDPOINTS.maintenance.update}`, 
        {
          method: 'PUT',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      const result = await response.json()
      
      if (result.status === 200) {
        setSuccess('บันทึกการแก้ไขสำเร็จ')
        setTimeout(() => {
          router.push('/repair')
        }, 1500)
      } else {
        setError(result.message || 'ไม่สามารถบันทึกข้อมูลได้')
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  if (loading) return <div className="text-center py-4">กำลังโหลด...</div>
  if (error && !formData.request_id) return <div className="text-center py-4 text-red-500">{error}</div>

  return (
    <UserLayout title="แก้ไขการแจ้งซ่อม" backLink="/repair">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">แก้ไขการแจ้งซ่อม #{formData.request_id}</h1>
        <div className="grid grid-cols-2 gap-1">
          <p className="text-gray-700">วันที่แจ้งซ่อม: {new Date(formData.request_date).toLocaleDateString('th-TH')}</p>
            <p className="text-gray-700">รหัสผู้แจ้งซ่อม: {formData.user_id}</p>
            <p className="text-gray-700">รหัสครุภัณฑ์: {formData.assets_num}</p>
            <p className="text-gray-700">ชื่อครุภัณฑ์: {formData.assets_name}</p>
            <p className="text-gray-700">รหัสประจำตัวช่างซ่อม: {formData.technician_id}</p>
            <p className="text-gray-700">ชื่อช่างซ่อม: {formData.technician_fname+" "+formData.technician_lname}</p>
            <p className="text-gray-700">technician_username: {formData.technician_username}</p>
            <p className="text-gray-700">เบอร์โทรศัพท์ช่าง: {formData.technician_phone}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                รูปภาพครุภัณฑ์/ปัญหา
              </label>
              <ImageDisplay
                urls={formData.img_url}
                showDelete={true}
                onDelete={(newUrls) => setFormData(prev => ({ ...prev, img_url: newUrls }))}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Asset Selection
            <div>
              <SearchSelectAssets
                onAssetSelected={(asset) => {
                  if (asset) {
                    setFormData(prev => ({
                      ...prev,
                      asset_id: asset.asset_id
                    }))
                    setShowTechnicianAssignment(true)
                  }
                }}
                defaultValue={formData.asset_id}
              />
            </div> */}

            {/* Priority Selection */}
            <div>
              <label className="block text-gray-700">ความเร่งด่วน</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">เลือกความเร่งด่วน</option>
                {REPAIR_PRIORITY.map((priority) => (
                  <option
                    key={priority.id}
                    value={priority.id}
                    className={getPriorityColor(priority.id)}
                  >
                    {priority.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Technician Assignment */}
            {showTechnicianAssignment && (
              <div className="col-span-2">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">ช่างซ่อมที่ได้รับมอบหมาย</h3>
                  </div>
                  <TechnicianAssignment
                    onTechnicianAssigned={(tech) => {
                      setFormData(prev => ({
                        ...prev,
                        technician_id: tech.user_id
                      }))
                    }}
                    value={formData.technician_id}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Problem Detail */}
          <div className="grid grid-cols-1 gap-4">
            <label className="block text-gray-700">รายละเอียดปัญหา</label>
            <textarea
              name="problem_detail"
              value={formData.problem_detail}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
            // onMouseOutCapture={console.log(formData)}
          >
            {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </form>
      </div>
    </UserLayout>
  )
}
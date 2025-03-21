import { useState } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import SearchSelectBrand from '@/app/components/SearchSelectBrand'
import SearchSelectType from '@/app/components/SearchSelectType'
import SearchSelectAssetmodel from '@/app/components/SearchSelectAssetmodel'

export default function AddAssetForm({ onSuccess, onClose }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    assetbrand_id: '',
    assetmodel_id: '',
    assets_in: '',
    assets_name: '',
    assets_num: '',
    assets_num2: '',
    assetstypes_id: '',
    departments_id: '',
    img_url: '',
    note: '',
    price: '',
    purchase_date: '',
    serial_number: '',
    status: '',
    user_id: '',
    warranty: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeSearch, setActiveSearch] = useState('brand')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      //console.log('FormData updated:', newData)
      return newData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    console.log('Submitting formData:', formData)

    try {
      const response = await fetch(`${API_ENDPOINTS.assets.add}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const result = await response.json()

      if (result.status === 200) {
        onSuccess()
        onClose()
      } else {
        setError(result.message || 'Failed to add asset')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    setCurrentStep(prev => prev + 1)
  }

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Step 1: เลือกยี่ห้อ</h3>
            <SearchSelectBrand
              apiUrl={API_ENDPOINTS.assetbrands.getAll}
              labelKey="assetbrand_name"
              valueKey="assetbrand_id"
              placeholder="ค้นหายี่ห้อ"
              onSelect={(value) => setFormData(prev => ({ ...prev, assetbrand_id: value }))}
              required
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Step 2: เลือกรุ่น</h3>
            <SearchSelectAssetmodel
              apiUrl={API_ENDPOINTS.assetmodels.getAll}
              labelKey="assetmodel_name"
              valueKey="assetmodel_id"
              placeholder="ค้นหารุ่น"
              onSelect={(value) => setFormData(prev => ({ ...prev, assetmodel_id: value }))}
              required
            />
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Step 3: เลือกประเภท</h3>
            <SearchSelectType
              apiUrl={API_ENDPOINTS.assettypes.getAll}
              labelKey="assettypes_name"
              valueKey="assettypes_id"
              placeholder="ค้นหาประเภท"
              onSelect={(value) => setFormData(prev => ({ ...prev, assetstypes_id: value }))}
              required
            />
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Step 4: กรอกข้อมูลครุภัณฑ์</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'assets_name', label: 'ชื่อครุภัณฑ์' },
                { name: 'assets_num2', label: 'เลขครุภัณฑ์ 2' },
                { name: 'assets_num', label: 'เลขครุภัณฑ์' },
                { name: 'price', label: 'ราคา', type: 'number' },
                { name: 'assets_in', label: 'วันที่รับเข้า', type: 'date' },
                { name: 'warranty', label: 'วันเวลาสิ้นสุดรับประกัน',type: 'date' },
                { name: 'serial_number', label: 'Serial Number' },
                { name: 'purchase_date', label: 'วันที่ซื้อ/รับเข้า', type: 'date' },
                //{ name: 'status', label: 'สถานะ' },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label htmlFor={field.name} className="mb-1 text-sm text-gray-600">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    type={field.type || 'text'}
                    name={field.name}
                    placeholder={field.label}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                    required
                  />
                </div>
              ))}
              <div>
                <label htmlFor="note" className="mb-1 text-sm text-gray-600">
                    หมายเหตุ
                    </label>
                <textarea 
                    id="note" 
                    name="note" 
                    placeholder="หมายเหตุ" 
                    value={formData.note} 
                    onChange={handleChange} 
                    className="border rounded px-3 py-2" 
                />
                </div>
              <div>
                <label htmlFor="status" className="mb-1 text-sm text-gray-600">สถานะ</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                  required
                >
                    <option selected>โปรดเลือกสถานะ</option>
                    <option value="0">ใช้งานอยู่</option>
                    <option value="1">ชำรุด</option>
                    <option value="2">เสื่อมสภาพ</option>
                    <option value="3">เสื่อมสภาพอย่างร้ายแรง</option>
                    <option value="4">ประกัน</option>
                    <option value="5">ส่งซ่อม</option>
                    <option value="6">ส่งเคลม</option>
                    <option value="7">ส่งขาย</option>
                    <option value="8">ส่งบริจาค</option>  
                    <option value="9">ส่งทำลาย</option>
                    <option value="9">จำหน่าย</option>
                </select>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          type="button"
        >
          ยกเลิก
        </button>
        <h2 className="text-xl font-bold mb-4">เพิ่มครุภัณฑ์</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          {renderStepContent()}
          <div className="mt-4 flex justify-between space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {loading ? 'กำลังบันทึก...' : 'ตกลง'}
            </button>
            <div className="flex space-x-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  ย้อนกลับ
                </button>
              )}
              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  ถัดไป
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { API_ENDPOINTS } from '@/app/config/api'
import SearchSelectBrand from '@/app/components/SearchSelectBrand'
import SearchSelectType from '@/app/components/SearchSelectType'
import SearchSelectAssetmodel from '@/app/components/SearchSelectAssetmodel'
import SearchSelectDepartments from '@/app/components/SearchSelectDepartments'
import UploadFile from '@/app/components/UploadFile'
import AddAssetForm2 from '@/app/components/assets/AddAssetForm2' 


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
            <h3 className="font-semibold">Step 2: เลือกหน่วยงาน</h3>
            <SearchSelectDepartments
              apiUrl={API_ENDPOINTS.departments.getAll}
              labelKey="departments_name"
              valueKey="departments_id"
              placeholder="ค้นหาหน่วยงาน"
              onSelect={(value) => setFormData(prev => ({ ...prev, departments_id: value }))}
              required
            />
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Step 3: เลือกรุ่น</h3>
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
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Step 4: เลือกประเภท</h3>
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
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Step 5: อัพโหลดรูปภาพ</h3>
            <UploadFile 
              apiUrl={`${API_ENDPOINTS.files.upLoad}`}
              onUploadSuccess={(uploadedFiles) => {
                // Handle uploadedFiles as a string since it's already comma-separated
                setFormData(prev => ({ 
                  ...prev, 
                  img_url: uploadedFiles // Remove .join(',') since uploadedFiles is already a string
                }))
              }}
              maxFiles={5}
              acceptedFileTypes="image/*"
              required={true}
            />
          </div>
        )
      case 6:
        return (
          <AddAssetForm2
            formData={formData}
            handleChange={handleChange}
          />
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
              {currentStep < 6 && (
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

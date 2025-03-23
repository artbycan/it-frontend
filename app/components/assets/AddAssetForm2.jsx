import AssetStatus from '@/app/components/assets/AssetStatus'

export default function AddAssetForm2({ formData, handleChange }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Step 6: กรอกข้อมูลครุภัณฑ์</h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: 'assets_name', label: 'ชื่อครุภัณฑ์' },
          { name: 'assets_num2', label: 'เลขครุภัณฑ์ 2' },
          { name: 'assets_num', label: 'เลขครุภัณฑ์' },
          { name: 'price', label: 'ราคา', type: 'number' },
          { name: 'assets_in', label: 'วันที่รับเข้า', type: 'date' },
          { name: 'warranty', label: 'วันเวลาสิ้นสุดรับประกัน', type: 'date' },
          { name: 'serial_number', label: 'Serial Number' },
          { name: 'purchase_date', label: 'วันที่ซื้อ/รับเข้า', type: 'date' },
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
        <AssetStatus 
          value={formData.status}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}
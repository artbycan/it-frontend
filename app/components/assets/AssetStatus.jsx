export default function AssetStatus({ value, onChange }) {
  return (
    <div>
      <label htmlFor="status" className="mb-1 text-sm text-gray-600">สถานะ</label>
      <select
        id="status"
        name="status"
        value={value}
        onChange={onChange}
        className="border rounded px-3 py-2"
        required
      >
        <option value="">โปรดเลือกสถานะ</option>
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
        <option value="10">จำหน่าย</option>
      </select>
    </div>
  )
}
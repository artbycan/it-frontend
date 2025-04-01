export default function AssetStatus({ value, onChange, disAbled, Type }) {
  const getStatusLabel = (statusValue) => {
    const statusMap = {
      '0': 'ใช้งานอยู่',
      '1': 'ชำรุด',
      '2': 'เสื่อมสภาพ',
      '3': 'เสื่อมสภาพอย่างร้ายแรง',
      '4': 'ประกัน',
      '5': 'ส่งซ่อม',
      '6': 'ส่งเคลม',
      '7': 'ส่งขาย',
      '8': 'ส่งบริจาค',
      '9': 'ส่งทำลาย',
      '10': 'จำหน่าย',
      '99': 'ลบออกจากระบบ',
    };
    return statusMap[statusValue] || 'ไม่ระบุสถานะ';
  };

  const getStatusStyle = (statusValue) => {
    const styleMap = {
      '0': 'bg-green-100 text-green-800',
      '1': 'bg-red-100 text-red-800',
      '2': 'bg-yellow-100 text-yellow-800',
      '3': 'bg-red-200 text-red-900',
      '4': 'bg-blue-100 text-blue-800',
      '5': 'bg-orange-100 text-orange-800',
      '6': 'bg-purple-100 text-purple-800',
      '7': 'bg-gray-100 text-gray-800',
      '8': 'bg-indigo-100 text-indigo-800',
      '9': 'bg-red-100 text-red-800',
      '10': 'bg-gray-100 text-gray-800',
      '99': 'bg-red-800 text-gray-100',

    };
    return styleMap[statusValue] || 'bg-gray-100 text-gray-800';
  };

  if (Type === 'show') {
    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(value)}`}>
        {getStatusLabel(value)}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="status" className="mb-1 text-sm text-gray-600">สถานะ</label>
      <select
        id="status"
        name="status"
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
        disabled={disAbled}
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
  );
}
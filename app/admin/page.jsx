'use client'
import { useState } from 'react'
import AdminLayout from '@/app/components/AdminLayout'
import Link from 'next/link'

const menuItems = [
  { name: 'แดชบอร์ด', path: '/admin/dashboard', icon: '📊' },
  { name: 'การแจ้งซ่อม', path: '/admin/repair', icon: '🔧' },
  { name: 'สต๊อคอะไหล่', path: '/admin/stock_levels', icon: '📦' },    
  { name: 'ครุภัณฑ์', path: '/admin/assets', icon: '💻' },
  { name: 'ผู้ใช้งาน', path: '/admin/users', icon: '👥' },
  { name: 'ไฟล์อัพโหลด', path: '/admin/files', icon: '📤' },
  { name: 'แผนก', path: '/admin/departments', icon: '🏢' },
  { name: 'ประเภทครุภัณฑ์', path: '/admin/assettypes', icon: '📁' },
  { name: 'ยี่ห้อครุภัณฑ์', path: '/admin/assetbrands', icon: '🏷️' },
  { name: 'รุ่นครุภัณฑ์', path: '/admin/assetmodels', icon: '🔖' },
]

export default function AdminPage() {
  const [hoveredCard, setHoveredCard] = useState(null)

  const getIconColor = (index) => {
    const colors = [
      'text-blue-500',
      'text-green-500',
      'text-purple-500',
      'text-orange-500',
      'text-red-500'
    ]
    return colors[index % colors.length]
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold mb-4">ยินดีต้อนรับสู่ระบบจัดการ</h1>
          <p className="text-gray-600 mb-8">
            เลือกเมนูด้านล่างเพื่อจัดการระบบ
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Link 
                href={item.path} 
                key={item.path}
                className="block"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`
                  relative overflow-hidden rounded-lg p-6 transition-all duration-300
                  ${hoveredCard === index 
                    ? 'bg-blue-50 transform scale-105 shadow-lg' 
                    : 'bg-white shadow hover:shadow-md'
                  }
                `}>
                  <div className="flex items-start space-x-4">
                    <span className={`
                      text-4xl ${getIconColor(index)}
                      transition-transform duration-300
                      ${hoveredCard === index ? 'transform rotate-12' : ''}
                    `}>
                      {item.icon}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        จัดการข้อมูล{item.name.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`
                    absolute bottom-0 left-0 w-full h-1 transition-all duration-300
                    ${hoveredCard === index ? 'bg-blue-500' : 'bg-gray-200'}
                  `}/>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Dashboard Stats Section
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">รายการครุภัณฑ์</p>
                <h4 className="mt-2 text-xl font-semibold text-gray-900">128</h4>
              </div>
              <span className="material-icons text-3xl text-blue-500">inventory_2</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">ผู้ใช้งานทั้งหมด</p>
                <h4 className="mt-2 text-xl font-semibold text-gray-900">45</h4>
              </div>
              <span className="material-icons text-3xl text-green-500">group</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">แจ้งซ่อมรอดำเนินการ</p>
                <h4 className="mt-2 text-xl font-semibold text-gray-900">12</h4>
              </div>
              <span className="material-icons text-3xl text-orange-500">build</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">ดำเนินการแล้วเสร็จ</p>
                <h4 className="mt-2 text-xl font-semibold text-gray-900">89</h4>
              </div>
              <span className="material-icons text-3xl text-purple-500">done_all</span>
            </div>
          </div>
        </div> */}
      </div>
    </AdminLayout>
  )
}
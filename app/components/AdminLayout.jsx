'use client'
import { useState } from 'react'
import Link from 'next/link'

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const menuItems = [
    { name: 'หน้าแรก', path: '/', icon: '🏠' },
    { name: 'แดชบอร์ด', path: '/admin/dashboard', icon: '📊' },
    { name: 'ครุภัณฑ์', path: '/admin/assets', icon: '💻' },
    { name: 'ผู้ใช้งาน', path: '/admin/users', icon: '👥' },
    { name: 'อัพโหลด', path: '/admin/upload', icon: '📤' },
    { name: 'แผนก', path: '/admin/departments', icon: '🏢' },
    { name: 'ประเภทครุภัณฑ์', path: '/admin/assettypes', icon: '📁' },
    { name: 'ยี่ห้อ', path: '/admin/assetbrands', icon: '🏷️' },
    { name: 'รุ่น', path: '/admin/assetmodels', icon: '🔖' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white w-64 min-h-screen ${isSidebarOpen ? '' : 'hidden'}`}>
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          <div className="border-t border-gray-700 my-4"></div>
          <Link
            href="/logout"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <span className="mr-3">🚪</span>
            ออกจากระบบ
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-2xl">☰</span>
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin User</span>
              <img
                src="/avatar-placeholder.png"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
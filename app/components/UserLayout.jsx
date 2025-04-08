'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from '../utils/auth'

const UserLayout = ({ children }) => {
  const [username, setUsername] = useState('Guest')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const router = useRouter()

  const menuItems = [
    { name: 'หน้าแรก', path: '/', icon: '🏠' },
    { name: 'แจ้งซ่อม', path: '/repair', icon: '🔧' },
    { name: 'ข้อมูลผู้ใช้', path: '/user', icon: '👤' },
    { name: 'เกี่ยวกับ', path: '/about', icon: 'ℹ️' },
  ]

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  const handleLogout = async () => {
    try {
      const success = await logout()
      if (success) {
        router.push('/login?message=ออกจากระบบสำเร็จ')
      } else {
        console.error('Logout failed')
        router.push('/login?message=เกิดข้อผิดพลาดในการออกจากระบบ')
      }
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login?message=เกิดข้อผิดพลาดในการออกจากระบบ')
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg w-64 min-h-screen ${isSidebarOpen ? '' : 'hidden'}`}>
        <div className="p-4">
          <Link href="/" className="text-xl font-bold text-gray-800 block mb-6">
            ระบบแจ้งซ่อมครุภัณฑ์
          </Link>
          <div className="mb-6">
            <span className="text-sm text-gray-600">ยินดีต้อนรับ:</span>
            <span className="font-medium text-gray-800 ml-2">{username}</span>
          </div>
        </div>
        <nav className="mt-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600"
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50"
          >
            <span className="mr-3">🚪</span>
            ออกจากระบบ
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-2xl">☰</span>
            </button>
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

export default UserLayout
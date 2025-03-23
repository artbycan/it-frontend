//'use client'
import Link from 'next/link'

const NavMenu = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            {/* Logo */}
            <div className="flex items-center py-4">
              <Link href="/" className="font-bold text-lg text-gray-800">
                ระบบจัดการข้อมูลการแจ้งซ่อมครุภัณฑ์ สคร.1
              </Link>
            </div>
            {/* Primary Nav */}
            <div className="hidden md:flex items-center space-x-4 ml-8">
              <Link href="/" className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300">
                Home
              </Link>
              <Link href="/assets" className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300">
                ครุภัณฑ์
              </Link>
              <Link href="/about" className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300">
                About
              </Link>
              <Link href="/admin" className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300">
                Admin
              </Link>
            </div>
          </div>
          {/* Secondary Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="py-2 px-4 text-gray-500 hover:text-blue-500 transition duration-300">
              Login
            </Link>
            <Link href="/signup" className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavMenu
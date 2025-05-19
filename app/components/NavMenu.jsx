'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { logout } from "../utils/auth"

const NavMenu = () => {
  const router = useRouter()


  return (
    <nav className="bg-white shadow-lg" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="max-w-6xl mx-auto px-1">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            {/* Logo */}
            <div className="flex items-center py-4">
              <Link href="/" className="font-bold text-lg text-gray-800">
                ระบบจัดการข้อมูลการแจ้งซ่อมครุภัณฑ์ สคร.1
              </Link>
            </div>
            {/* Primary Nav */}
            <div className="hidden md:flex items-center space-x-1 ml-8">
              <Link
                href="/"
                className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300"
              >
                หน้าแรก
              </Link>
              <Link
                href="/repair"
                className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300"
              >
                ระบบแจ้งซ่อม
              </Link>
              <Link
                href="/about"
                className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300"
              >
                เกียวกับเรา
              </Link>
              <Link
                href="/admin"
                className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300"
              >
                Admin-Panel
              </Link>
            </div>
          </div>
          
          
        </div>
      </div>
    </nav>
  )
}

export default NavMenu

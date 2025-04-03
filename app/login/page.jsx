'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS } from '../config/api.js'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Add useEffect to handle logout message
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const message = params.get('message')
    if (message) {
      setError(message)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.status === 200) {
        // Store the JWT token in both localStorage and cookies
        const token = result.data.jwt_token.access_token
        localStorage.setItem('jwt_token', token)
        localStorage.setItem('user_id', result.data.user_id)
        localStorage.setItem('username', result.data.username)
        localStorage.setItem('user_role', result.data.role)
        localStorage.setItem('user_fullname', result.data.f_name+' '+result.data.l_name)
        localStorage.setItem('user_departments_id', result.data.departments_id)
        localStorage.setItem('user_email', result.data.email)
        localStorage.setItem('user_phone_number', result.data.phone_number)
        localStorage.setItem('user_grnder', result.data.gender)
        localStorage.setItem('user_line_id', result.data.line_id)
        localStorage.setItem('user_date_of_birth', result.data.date_of_birth)
        localStorage.setItem('user_status', result.data.status)
        localStorage.setItem('user_created_at', result.data.created_at)
        localStorage.setItem('user_updated_at', result.data.updated_at)
        localStorage.setItem('user_line_token', result.data.line_token)
        localStorage.setItem('user_address', result.data.address)
        // Set cookie with token
        document.cookie = `token=${token}; path=/; max-age=86400` // Expires in 24 hours

        // Redirect to admin dashboard
        router.push('/admin')
      } else {
        setError(result.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            เข้าสู่ระบบผู้ดูแล
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="ชื่อผู้ใช้"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="รหัสผ่าน"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
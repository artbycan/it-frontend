'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS } from '../config/api.js'
import { getLineLoginUrl } from '../config/line'
import { LINE_CONFIG } from '../config/line'

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
        // Create session
        const sessionResponse = await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: result.data.jwt_token.access_token,
            user: {
              id: result.data.user_id,
              username: result.data.username,
              role: result.data.role,
              status: result.data.status,
              fullName: `${result.data.f_name} ${result.data.l_name}`
            }
          })
        })

        if (sessionResponse.ok) {
          // Store minimal data in localStorage for UI purposes only
          localStorage.setItem('username', result.data.username)
          localStorage.setItem('user_fullname', `${result.data.f_name} ${result.data.l_name}`)
          localStorage.setItem('user_id', result.data.user_id)
          localStorage.setItem('jwt_token', result.data.jwt_token.access_token)

          // Redirect to admin dashboard
          router.push('/')
        } else {
          setError('เกิดข้อผิดพลาดในการสร้างเซสชัน')
        }
      } else {
        setError(result.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkLineConnection = async (token) => {
    try {
      const response = await fetch(LINE_CONFIG.friendshipStatusUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      return data.friendFlag
    } catch (error) {
      console.error('Error checking LINE connection:', error)
      return false
    }
  }

  const handleLineLogin = async () => {
    try {
      setLoading(true)
      const lineLoginUrl = getLineLoginUrl()
      window.location.href = lineLoginUrl
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับ LINE')
      console.error('LINE login error:', error)
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

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                หรือเข้าสู่ระบบด้วย
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleLineLogin}
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#00B900] hover:bg-[#00a000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B900] disabled:bg-[#80d980]"
            >
              <img 
                src="https://cdn-icons-png.freepik.com/256/2335/2335324.png" 
                alt="Line" 
                className="w-5 h-5"
              />
              {loading ? 'กำลังดำเนินการ...' : 'เข้าสู่ระบบด้วย LINE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
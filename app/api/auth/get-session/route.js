import { getIronSession } from 'iron-session'
import { sessionOptions } from '@/lib/session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = await getIronSession(cookieStore, sessionOptions)
    
    if (!session?.user) {
      return NextResponse.json({ 
        status: 401, 
        message: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง' 
      })
    }

    return NextResponse.json({ 
      status: 200, 
      user: session.user 
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ 
      status: 500, 
      message: 'เกิดข้อผิดพลาดในการตรวจสอบเซสชัน' 
    })
  }
}
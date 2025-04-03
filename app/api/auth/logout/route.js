import { getIronSession } from 'iron-session'
import { sessionOptions } from '@/lib/session'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()
    //const session = await getIronSession(cookieStore, sessionOptions)
    
    // Destroy session
    //session.destroy()

    // Clear all cookies by setting them to expire
    const response = NextResponse.json({ 
      status: 200, 
      message: 'Logged out successfully' 
    })

    // List of cookies to clear
    const cookiesToClear = [
      'auth_session',
      'token',
      'user_role',
      'user_status'
    ]

    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/'
      })
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { status: 500, message: 'Error during logout' },
      { status: 500 }
    )
  }
}
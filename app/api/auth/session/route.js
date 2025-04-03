import { getIronSession } from 'iron-session'
import { sessionOptions } from '@/lib/session'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req) {
  try {
    const cookieStore = cookies()
    const session = await getIronSession(cookieStore, sessionOptions)
    const { token, user } = await req.json()
    
    session.token = token
    session.user = user
    await session.save()

    return NextResponse.json({ status: 200, message: 'Session created' })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { status: 500, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
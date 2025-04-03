import { getIronSession } from 'iron-session'
import { sessionOptions } from '@/lib/session'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req) {
  try {
    const cookieStore = await cookies()
    const response = new NextResponse()
    const session = await getIronSession(req, response, sessionOptions)
    const { token, user } = await req.json()
    
    session.token = token
    session.user = user
    await session.save()

    // Copy headers from response to a new response with JSON
    const finalResponse = NextResponse.json(
      { status: 200, message: 'Session created' },
      { headers: response.headers }
    )

    return finalResponse
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { status: 500, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
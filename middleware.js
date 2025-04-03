import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions } from './lib/session'

export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await getIronSession(request, Response, sessionOptions)

    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { role, status } = session.user
    const allowedRoles = ['5', '1']

    if (status !== '0' || !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions } from './lib/session'

export async function middleware(request) {
  // Define public paths that don't require authentication
  const publicPaths = ['/', '/about', '/login','/singup']
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(path + '/')
  )

  // Allow access to public paths
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Get session for authenticated routes
  const session = await getIronSession(request, Response, sessionOptions)

  // Redirect to login if not authenticated
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Special handling for admin paths
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { role, status } = session.user
    const allowedRoles = ['5', '1', '6'] // Super Admin, Technician, Admin

    if (status !== '0' || !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all request paths except for the ones you want to exclude
    '/((?!api|_next|_static|_vercel|images|favicon|manifest|sw|workbox|worker|[\\w-]+\\.\\w+).*)',
  ],
}
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/gallery',
  '/api/auth/login',
  '/api/auth/register'
]

// Function to verify JWT token
async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'your-secret-key'
    )
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for API routes that need authentication
  if (pathname.startsWith('/api/')) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Geçersiz veya süresi dolmuş token' },
        { status: 401 }
      )
    }

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('user', JSON.stringify(payload))

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Check for protected pages
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Special routes that require specific roles
  if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (pathname.startsWith('/artist') && payload.role !== 'artist') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

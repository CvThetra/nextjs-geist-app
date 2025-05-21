import { jwtVerify, SignJWT, JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'

export interface UserPayload extends JWTPayload {
  id: number
  email: string
  role: string
  username: string
}

export async function getJwtSecretKey(): Promise<Uint8Array> {
  const secret = process.env.NEXTAUTH_SECRET || 'your-secret-key'
  return new TextEncoder().encode(secret)
}

export async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) return null

  try {
    const verified = await jwtVerify(
      token,
      await getJwtSecretKey()
    )
    return verified.payload as unknown as UserPayload
  } catch (err) {
    return null
  }
}

export async function signToken(payload: Partial<UserPayload>) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(await getJwtSecretKey())

    return token
  } catch (error) {
    console.error('Error signing token:', error)
    return null
  }
}

export async function getUser(): Promise<UserPayload | null> {
  try {
    // Get the token from the cookie store
    const cookiesList = await cookies()
    const tokenCookie = cookiesList.get('token')

    if (!tokenCookie?.value) return null

    const verified = await jwtVerify(
      tokenCookie.value,
      await getJwtSecretKey()
    )
    return verified.payload as unknown as UserPayload
  } catch {
    return null
  }
}

export async function getUserFromRequest(request: NextRequest): Promise<UserPayload | null> {
  const userHeader = request.headers.get('user')
  if (!userHeader) return null

  try {
    return JSON.parse(userHeader) as UserPayload
  } catch {
    return null
  }
}

export function isAdmin(user: UserPayload | null): boolean {
  return user?.role === 'admin'
}

export function isArtist(user: UserPayload | null): boolean {
  return user?.role === 'artist'
}

export function canModifyArtwork(user: UserPayload | null, artworkUserId: number): boolean {
  return isAdmin(user) || user?.id === artworkUserId
}

export function canModifyComment(user: UserPayload | null, commentUserId: number): boolean {
  return isAdmin(user) || user?.id === commentUserId
}

// Helper function to get token from request
export function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get('token')?.value || null
}

// Helper function to validate token format
export function isValidTokenFormat(token: string): boolean {
  const parts = token.split('.')
  return parts.length === 3 && parts.every(part => part.length > 0)
}

// Helper function to create a safe user object without sensitive data
export function createSafeUser(user: UserPayload): Omit<UserPayload, 'iat' | 'exp'> {
  const { iat, exp, ...safeUser } = user
  return safeUser
}

// Helper function to create response with auth cookie
export function createResponseWithAuthCookie(
  data: any,
  token: string,
  status: number = 200
): NextResponse {
  const response = NextResponse.json(data, { status })
  
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400 // 1 day
  })

  return response
}

// Helper function to create response with removed auth cookie
export function createResponseWithRemovedAuthCookie(
  data: any,
  status: number = 200
): NextResponse {
  const response = NextResponse.json(data, { status })
  response.cookies.delete('token')
  return response
}

// Helper function to get cookies from request
export function getCookies(request: NextRequest): RequestCookies {
  return request.cookies
}

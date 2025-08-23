import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const secretKey = 'secret'
const key = new TextEncoder().encode(secretKey)

export async function middleware(request: NextRequest) {
  const currentUser = await getSession()

  if (!request.nextUrl.pathname.startsWith('/dashboard')) {
    return
  }

  if (!currentUser && request.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', request.url))
  }

  if (!currentUser && !request.nextUrl.pathname.startsWith('/login')) {
    return Response.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  return await decrypt(session)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token has expired. Please generate a new one.')
    } else {
      console.log('Token verification failed:', error.message)
    }
    return null
  }
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getExpectedToken, SESSION_COOKIE } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ces chemins sont toujours accessibles
  if (pathname === '/' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value

  try {
    const expectedToken = await getExpectedToken()
    if (sessionToken === expectedToken) {
      return NextResponse.next()
    }
  } catch {
    // Variables d'environnement manquantes
  }

  return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons).*)',
  ],
}

import { NextRequest, NextResponse } from 'next/server'
import { getExpectedToken, SESSION_COOKIE, COOKIE_MAX_AGE } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { pin } = await request.json()

  if (!pin || typeof pin !== 'string') {
    return NextResponse.json({ error: 'PIN manquant' }, { status: 400 })
  }

  const expectedPin = process.env.NEXT_PUBLIC_APP_PIN
  if (pin !== expectedPin) {
    return NextResponse.json({ error: 'PIN incorrect' }, { status: 401 })
  }

  const token = await getExpectedToken()
  const response = NextResponse.json({ ok: true })

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })

  return response
}

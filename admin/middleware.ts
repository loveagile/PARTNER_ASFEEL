import { NextRequest, NextResponse } from 'next/server'
import PATH from './constants/path'
import { API_ROUTES } from './constants/common'
import { ErrorValidation } from './constants/error'

const AUTH_START_PATH = '/auth'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  try {
    const session = req.cookies.get('session')

    const pathName = req.nextUrl.pathname

    if (pathName === PATH.auth.login && session) {
      const data = await validateSession(req.nextUrl.origin, session.value)
      if (data.isLogin) {
        url.pathname = PATH.root
        return NextResponse.redirect(url)
      }
    }

    if (
      pathName.startsWith(AUTH_START_PATH) ||
      Object.values(API_ROUTES.AUTH).includes(pathName)
    ) {
      return NextResponse.next()
    } else {
      if (!session) {
        throw ErrorValidation.UNAUTHORIZED
      } else {
        const data = await validateSession(req.nextUrl.origin, session.value)

        if (!data.isLogin) {
          throw ErrorValidation.UNAUTHORIZED
        }

        return NextResponse.next()
      }
    }
  } catch (error: any) {
    if (error?.code === ErrorValidation.UNAUTHORIZED.code) {
      if (url.pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: ErrorValidation.UNAUTHORIZED.message },
          { status: ErrorValidation.UNAUTHORIZED.code },
        )
      } else {
        url.pathname = PATH.auth.login
        return NextResponse.redirect(url)
      }
    }
  }
}

const validateSession = async (origin: string, session: string) => {
  const response = await fetch(`${origin}/api/auth/validateSession`, {
    headers: {
      Cookie: `session=${session}`,
    },
  })

  const data = await response.json()
  return data
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

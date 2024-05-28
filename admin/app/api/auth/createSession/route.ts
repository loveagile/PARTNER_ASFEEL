import { ROLE_NAME, SESSION_EXPIRES_IN } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { handleError } from '@/utils/common'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const idToken = body?.idToken

    if (!idToken) {
      throw ErrorValidation.FORBIDDEN
    }

    const decodedToken = await appAdmin.auth().verifyIdToken(idToken)

    if (decodedToken?.role !== ROLE_NAME.ADMIN || !decodedToken?.isPublish) {
      throw ErrorValidation.FORBIDDEN
    }

    const cookieValue = await appAdmin.auth().createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN,
    })

    return NextResponse.json(
      {},
      {
        status: 200,
        headers: {
          'Set-Cookie': `session=${cookieValue}; Max-Age=${SESSION_EXPIRES_IN}; Path=/; HttpOnly; SameSite=Lax`,
        },
      },
    )
  } catch (error) {
    return handleError(error)
  }
}

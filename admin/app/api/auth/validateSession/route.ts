import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { handleError } from '@/utils/common'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ROLE_NAME } from '@/constants/common'

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = cookies().get('session')

    let isLogin = false

    let res
    if (sessionCookie?.value) {
      res = await appAdmin.auth().verifySessionCookie(sessionCookie.value, true)
      isLogin = res?.role === ROLE_NAME.ADMIN && res?.isPublish
    }

    return NextResponse.json(
      {
        isLogin,
        currentUser: res,
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    return handleError(error)
  }
}

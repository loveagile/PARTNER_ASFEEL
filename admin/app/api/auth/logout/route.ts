import { ErrorValidation } from '@/constants/error'
import { handleError } from '@/utils/common'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = cookies().get('session')

    if (!sessionCookie?.value) {
      throw ErrorValidation.FORBIDDEN.message
    }

    return NextResponse.json(
      {},
      {
        status: 200,
        headers: {
          'Set-Cookie':
            'session=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
        },
      },
    )
  } catch (error) {
    return handleError(error)
  }
}

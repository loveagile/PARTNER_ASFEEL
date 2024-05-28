import { ErrorValidation } from '@/constants/error'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { handleError } from '@/utils/common'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id || typeof id !== 'string') {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const user = await appAdmin.auth().getUser(id)

    if (!user) {
      throw ErrorValidation.UNKNOWN_ERROR.message
    }

    await appAdmin.auth().deleteUser(id)

    return NextResponse.json({ id })
  } catch (error) {
    return handleError(error)
  }
}

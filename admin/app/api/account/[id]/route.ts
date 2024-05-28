import { ErrorValidation } from '@/constants/error'
import { UserCustomClaims } from '@/constants/model'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { handleError } from '@/utils/common'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    if (!id) {
      throw new Error(ErrorValidation.VALIDATE_ERROR.message)
    }

    const user = await appAdmin.auth().getUser(id)
    const customClaims = user.customClaims as UserCustomClaims

    const data = {
      id: user.uid,
      name: {
        sei: customClaims?.nameSei,
        mei: customClaims?.nameMei,
        seiKana: customClaims?.nameSeiKana,
        meiKana: customClaims?.nameMeiKana,
      },
      email: user.email,
      confirmEmail: user.email,
      role: customClaims?.role,
      isPublish: customClaims?.isPublish,
    }

    return NextResponse.json(data)
  } catch (error) {
    return handleError(error)
  }
}

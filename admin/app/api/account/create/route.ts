import { ErrorValidation } from '@/constants/error'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { handleError } from '@/utils/common'
import { NextRequest, NextResponse } from 'next/server'
import { createAccountRequestSchema } from '../common'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const data = await createAccountRequestSchema.validate(body)

    if (
      data.email !== data.confirmEmail ||
      data.newPassword !== data.confirmNewPassword
    ) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const createUser = await appAdmin.auth().createUser({
      email: data.email,
      password: data.newPassword,
    })

    await appAdmin.auth().setCustomUserClaims(createUser.uid, {
      nameSei: data.name.sei,
      nameMei: data.name.mei,
      nameSeiKana: data.name.seiKana,
      nameMeiKana: data.name.meiKana,
      role: data.role,
      isPublish: true,
      updatedAt: new Date().getTime(),
      createdAt: new Date(createUser.metadata.creationTime).getTime(),
    })

    return NextResponse.json({
      id: createUser.uid,
    })
  } catch (error) {
    return handleError(error)
  }
}

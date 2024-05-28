import { ErrorValidation } from '@/constants/error'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { handleError } from '@/utils/common'
import { NextRequest, NextResponse } from 'next/server'
import { createAccountRequestSchema } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      id,
      email,
      confirmEmail,
      currentEmail,
      newPassword,
      confirmNewPassword,
      ...data
    } = await createAccountRequestSchema.validate(body)

    if (email !== confirmEmail || !id) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const isChangePassword = newPassword && confirmNewPassword && currentEmail
    const isChangeEmail = email !== currentEmail

    const updatedUser = await appAdmin.auth().updateUser(id, {
      email,
      password: isChangePassword ? newPassword : undefined,
    })

    await appAdmin.auth().setCustomUserClaims(id, {
      nameSei: data.name.sei,
      nameMei: data.name.mei,
      nameSeiKana: data.name.seiKana,
      nameMeiKana: data.name.meiKana,
      role: data.role,
      isPublish: data.isPublish,
      updatedAt: new Date().getTime(),
    })

    if (
      !!isChangePassword ||
      isChangeEmail ||
      !data.isPublish ||
      updatedUser?.customClaims?.role !== data.role
    ) {
      await appAdmin.auth().revokeRefreshTokens(id)
    }

    return NextResponse.json({
      id,
    })
  } catch (error) {
    return handleError(error)
  }
}

import { COMMON_STATUS } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { DocRef } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getDoc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { updateRecruitmentSchema } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      id: recruitmentDocId,
      confirmEmail,
      ...data
    } = await updateRecruitmentSchema.validate(body)

    if (
      data.email !== confirmEmail ||
      data.status !== COMMON_STATUS.IN_PREPARATION
    ) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const queryCurrentRecruitment = await getDoc(
      DocRef.leadersWantedProject(recruitmentDocId),
    )

    if (!queryCurrentRecruitment.exists()) {
      throw ErrorValidation.FORBIDDEN.message
    }

    updateDoc(DocRef.leadersWantedProject(recruitmentDocId), data)

    return NextResponse.json(data)
  } catch (error) {
    return handleError(error)
  }
}

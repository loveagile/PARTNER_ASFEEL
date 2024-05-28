import { ErrorValidation } from '@/constants/error'
import { DocRef } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getDoc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { checkRecruitmentSchema } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const { id, isChecked } = await checkRecruitmentSchema.validateSync(body)

    const queryCurrentRecruitment = await getDoc(
      DocRef.leadersWantedProject(id),
    )

    if (!queryCurrentRecruitment.exists()) {
      throw ErrorValidation.FORBIDDEN.message
    }

    await Promise.all([
      updateDoc(DocRef.leadersWantedProject(id), {
        isChecked,
      }),
    ])

    return NextResponse.json({ id, isChecked })
  } catch (error) {
    return handleError(error)
  }
}

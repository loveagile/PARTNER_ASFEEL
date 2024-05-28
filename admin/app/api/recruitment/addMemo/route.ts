import { DocRef } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { addMemoSchema, checkExistsId } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const { id, memo } = addMemoSchema.validateSync(body)

    const recruitmentData = await checkExistsId(id)

    if (recruitmentData.memo === memo) {
      return NextResponse.json({})
    }

    await Promise.all([
      updateDoc(DocRef.leadersWantedProject(id), {
        memo,
      }),
    ])

    return NextResponse.json({ id, memo })
  } catch (error) {
    return handleError(error)
  }
}

import { updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { DocRef } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'

import { addMemoSchema, checkEventExistsId } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const { id, memo } = await addMemoSchema.validateSync(body)

    const eventData = await checkEventExistsId(id)

    if (eventData.memo === memo) {
      return NextResponse.json({})
    }

    await Promise.all([
      updateDoc(DocRef.eventProject(id), {
        memo,
      }),
    ])

    return NextResponse.json({ id, memo })
  } catch (error) {
    return handleError(error)
  }
}

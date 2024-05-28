import { updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { DocRef } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'

import { checkEventExistsId, modifyStatusSchema } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const { id, status: modifyStatus } = await modifyStatusSchema.validateSync(
      body,
    )

    const eventData = await checkEventExistsId(id)

    if (eventData.status === modifyStatus) {
      return NextResponse.json({})
    }

    await updateDoc(DocRef.eventProject(id), {
      status: modifyStatus as string,
    })

    return NextResponse.json({})
  } catch (error) {
    return handleError(error)
  }
}

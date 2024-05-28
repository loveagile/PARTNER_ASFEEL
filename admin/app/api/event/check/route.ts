import { updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { DocRef } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'

import { checkEventSchema } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const { id, isChecked } = await checkEventSchema.validateSync(body)

    await updateDoc(DocRef.eventProject(id), {
      isChecked,
    })

    return NextResponse.json({ id, isChecked })
  } catch (error) {
    return handleError(error)
  }
}

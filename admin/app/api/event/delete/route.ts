import { deleteDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { ErrorValidation } from '@/constants/error'
import { DocRef } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { checkEventExistsId } from '../common'

export async function DELETE(request: NextRequest) {
  try {
    const [{ id }] = await Promise.all([request.json()])

    if (!id || typeof id !== 'string') {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    await checkEventExistsId(id)

    await deleteDoc(DocRef.eventProject(id))

    return NextResponse.json({ id })
  } catch (error) {
    return handleError(error)
  }
}

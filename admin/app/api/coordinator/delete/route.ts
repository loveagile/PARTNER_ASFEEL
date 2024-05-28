import { ELASTIC_INDEX } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { DocRef } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { deleteDoc, getDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const [{ id }, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    if (!id || typeof id !== 'string') {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const currentCoordinatorSnap = await getDoc(DocRef.coordinator(id))

    if (!currentCoordinatorSnap.exists()) {
      throw ErrorValidation.UNKNOWN_ERROR.message
    }

    await Promise.all([
      deleteDoc(DocRef.coordinator(id)),
      elastic.delete({
        index: ELASTIC_INDEX.coordinators,
        id,
      }),
      appAdmin.auth().deleteUser(id),
    ])

    return NextResponse.json({ id })
  } catch (error) {
    return handleError(error)
  }
}

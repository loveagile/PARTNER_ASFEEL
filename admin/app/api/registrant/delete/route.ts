import { NextRequest, NextResponse } from 'next/server'
import { updateDoc, getDoc } from 'firebase/firestore'

import { ErrorValidation } from '@/constants/error'
import { DocRef } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
// import { getElasticClient } from '@/utils/elastic'
// import { ELASTIC_INDEX } from '@/constants/common'

export async function DELETE(request: NextRequest) {
  try {
    const [
      { id },
      // elastic
    ] = await Promise.all([
      request.json(),
      // getElasticClient(),
    ])

    if (!id || typeof id !== 'string') {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const snap = await getDoc(DocRef.privateUser(id))

    if (!snap.exists()) {
      throw ErrorValidation.UNKNOWN_ERROR.message
    }

    await Promise.all([
      updateDoc(DocRef.privateUser(id), {isDeletedAccount: true}),
      // elastic.delete({
      //   index: ELASTIC_INDEX.privateUsers,
      //   id,
      // }),
    ])

    return NextResponse.json({ id })
  } catch (error) {
    return handleError(error)
  }
}

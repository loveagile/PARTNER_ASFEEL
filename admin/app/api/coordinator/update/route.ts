import { ELASTIC_INDEX } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { auth } from '@/libs/firebase/firebase'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { addFieldsUpdate } from '@/utils/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { getDoc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import {
  createCoordinatorRequestSchema,
  createIndexIfNotExists,
} from '../common'

export async function PUT(request: NextRequest) {
  try {
    const [body, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    await createIndexIfNotExists(elastic)

    const {
      id,
      currentEmail,
      email,
      confirmEmail,
      currentPassword,
      newPassword,
      confirmNewPassword,
      ...data
    } = await createCoordinatorRequestSchema.validate(body)

    if (email !== confirmEmail || !id) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const isChangePassword =
      newPassword && confirmNewPassword && currentPassword

    if (isChangePassword) {
      if (!currentEmail) {
        throw ErrorValidation.VALIDATE_ERROR.message
      }

      await signInWithEmailAndPassword(auth, currentEmail, currentPassword)
    }

    const updateCoordinatorSnapshot = await getDoc(DocRef.coordinator(id!))
    if (!updateCoordinatorSnapshot.exists()) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const updateCoordinator = getDocIdWithData(updateCoordinatorSnapshot)

    const updateData = {
      ...data,
      notificationEmails: [email],
      parentId: data.parentId || null,
    }

    await appAdmin.auth().updateUser(id, {
      email: email,
      password: isChangePassword ? newPassword : undefined,
    })

    await Promise.all([
      updateDoc(DocRef.coordinator(id!), addFieldsUpdate(updateData)),

      elastic.update({
        index: ELASTIC_INDEX.coordinators,
        id,
        doc: addFieldsUpdate(updateData, true),
      }),
    ])

    return NextResponse.json({ id })
  } catch (error) {
    return handleError(error)
  }
}

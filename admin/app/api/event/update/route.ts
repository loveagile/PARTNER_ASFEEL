import { NextRequest, NextResponse } from 'next/server'
import { updateDoc, Timestamp } from 'firebase/firestore'
import * as lodash from 'lodash'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import { handleError } from '@/utils/common'
import { ErrorValidation } from '@/constants/error'
import { DocRef } from '@/libs/firebase/firestore'

import { checkEventExistsId, updateEventSchema } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const [body] = await Promise.all([request.json()])

    const { id, ...data } = await updateEventSchema.validate(body)

    if (!id) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    await checkEventExistsId(id)

    const officeHours = data.officeHours?.map((office) => {
      return {
        date: Timestamp.fromDate(new Date(office.date)),
        ...lodash.pick(office, 'start', 'end'),
      }
    })

    const firebaseUpdated = {
      ...data,
      officeHours,
    }

    await updateDoc(DocRef.eventProject(id), firebaseUpdated)
    console.log(
      '🚀 ~ file: route.ts:43 ~ PUT ~ firebaseUpdated:',
      id,
      firebaseUpdated,
    )

    return NextResponse.json({})
  } catch (error) {
    return handleError(error)
  }
}

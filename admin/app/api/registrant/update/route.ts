import { NextRequest, NextResponse } from 'next/server'
import { getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
import * as lodash from 'lodash'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'

import { handleError } from '@/utils/common'
// import { getElasticClient } from '@/utils/elastic'
import { ErrorValidation } from '@/constants/error'
import { DocRef, getDocIdWithData } from '@/libs/firebase/firestore'

import { updateRegistrantSchema } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const [
      body,
      // elastic
    ] = await Promise.all([
      request.json(),
      // getElasticClient(),
    ])

    // await createIndexIfNotExists(elastic)

    Object.keys(body).forEach((key) => {
      switch (key) {
        case 'teacherLicenseStatus':
        case 'otherLicense':
        case 'hasDriverLicense':
        case 'isExpeditionPossible':
        case 'experience':
          if (typeof body[key] === 'string' && !body[key]) body[key] = undefined
          break
      }
    })

    const { id, ...data } = await updateRegistrantSchema.validate(body)

    if (!id) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const queryCurrentRegistrant = await getDoc(DocRef.privateUser(id))

    if (!queryCurrentRegistrant.exists()) {
      throw ErrorValidation.FORBIDDEN.message
    }

    const currentRegistrant = getDocIdWithData(queryCurrentRegistrant)
    const emailUpdated = lodash.get(data, 'email', undefined)
    const isChangeEmail =
      emailUpdated && emailUpdated !== currentRegistrant.email

    if (isChangeEmail) {
      const emailExists = await checkEmailExists(emailUpdated)

      if (emailExists) {
        throw ErrorValidation.EMAIL_ALREADY_EXISTS.message
      }
    }

    // const elasticData = {
    //   id,
    //   club,
    //   age: data.birthday
    //     ? dayjs().diff(dayjs(data.birthday), 'year')
    //     : undefined,
    //   gender:
    //     data.gender === '男性'
    //       ? '男'
    //       : data.gender === '女性'
    //         ? '女'
    //         : '無回答',
    //   type: data.occupation.type,
    //   organization: data.occupation.organization,
    //   updatedAt: Timestamp.now(),

    //   teacherLicenseState: data.teacherLicenseStatus === 'having', // != so với file cũ
    //   teacherLicenseNote: data.teacherLicenseNote ? true : false,
    //   otherLicense: !!data.otherLicense,
    //   hasDriverLicense: !!data.hasDriverLicense,
    //   experience: !!data.experience,

    //   isExpeditionPossible: data.isExpeditionPossible === 'possible', // != so với file cũ

    //   userName: data.name.sei + data.name.mei,
    //   email: data.email,
    //   prefecture: data.address.prefecture,
    //   city: data.address.city,
    //   isExpeditionPossibleEnum: data.isExpeditionPossible, // != so với file cũ
    //   phoneNumber: data.phoneNumber,
    //   teacherLicenseStatus: data.teacherLicenseStatus,
    //   clubs: data.clubs,
    //   isSuspended: !!data.isSuspended,
    // }

    const dataFirebase = {
      ...data,
      updatedAt: Timestamp.now(),
      birthday: data.birthday
        ? Timestamp.fromDate(new Date(data.birthday))
        : undefined,
      career: data.career?.map((career) => {
        return {
          organizationName: career?.organizationName,
          termOfStart: career?.termOfStart
            ? Timestamp.fromDate(new Date(career?.termOfStart))
            : undefined,
          termOfEnd: career?.termOfEnd
            ? Timestamp.fromDate(new Date(career?.termOfEnd))
            : undefined,
        }
      }),
    }

    await Promise.all([
      updateDoc(DocRef.privateUser(id), dataFirebase),
      appAdmin.auth().updateUser(id, {
        email: emailUpdated,
      }),
    ])

    return NextResponse.json({})
  } catch (error) {
    return handleError(error)
  }
}

const checkEmailExists = async (email: string) => {
  try {
    const emailExists = await appAdmin.auth().getUserByEmail(email)
    return !!emailExists
  } catch (error) {
    return false
  }
}

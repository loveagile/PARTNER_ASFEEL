import { Addresses } from '@/features/address/addess.model'
import { handleError } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { NextRequest, NextResponse } from 'next/server'
import { createAddressRequestSchema, createIndexIfNotExists } from '../common'
import { addFieldsUpdate } from '@/utils/firestore'
import { updateDoc } from 'firebase/firestore'
import { DocRef } from '@/libs/firebase/firestore'
import { ELASTIC_INDEX } from '@/constants/common'

export async function PUT(request: NextRequest) {
  try {
    const [body, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    await createIndexIfNotExists(elastic)

    const requestData = await createAddressRequestSchema.validate(body)
    const id = requestData.id!

    const updateData = {
      zip: requestData.zip,
      address1: requestData.address1,
      address1Full: requestData.address1,
      address2: requestData.address2 || '',
      area: requestData.area.value,
      areaText: requestData.area.label,
      areaTextFull: requestData.area.label,
      prefecture: requestData.prefecture.value,
      prefectureCode: requestData.prefecture.prefectureCode || '',
      prefectureText: requestData.prefecture.label,
      cityCode: requestData.city?.cityCode || '',
      cityText: requestData.city?.label,
      city: requestData.city.value,
    } as Addresses

    await Promise.all([
      updateDoc(DocRef.address(id), addFieldsUpdate(updateData)),
      elastic.update({
        index: ELASTIC_INDEX.addresses,
        id,
        doc: addFieldsUpdate(updateData, true),
      }),
    ])

    return NextResponse.json({ id })
  } catch (error) {
    return handleError(error)
  }
}

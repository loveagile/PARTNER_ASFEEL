import { ELASTIC_INDEX } from '@/constants/common'
import { Addresses } from '@/features/address/addess.model'
import { ColRef, DocRef, generateDocId } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { addFieldsCreate } from '@/utils/firestore'
import { getCountFromServer, setDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { createAddressRequestSchema, createIndexIfNotExists } from '../common'

export async function POST(request: NextRequest) {
  try {
    const [body, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    await createIndexIfNotExists(elastic)

    const [requestData, id] = await Promise.all([
      createAddressRequestSchema.validate(body),
      generateDocId(),
    ])

    const countSnap = await getCountFromServer(ColRef.addresses)
    const order = countSnap.data().count + 1

    const createData = {
      id,
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
      order,
    } as Addresses

    await Promise.all([
      setDoc(DocRef.address(id), addFieldsCreate(createData)),
      elastic.index({
        index: ELASTIC_INDEX.addresses,
        id,
        document: addFieldsCreate(createData, true),
      }),
    ])

    return NextResponse.json({ id })
  } catch (error) {
    return handleError(error)
  }
}

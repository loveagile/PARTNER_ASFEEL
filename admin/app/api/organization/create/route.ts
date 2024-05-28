import { ELASTIC_INDEX } from '@/constants/common'
import { DocRef } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { addFieldsCreate } from '@/utils/firestore'
import { setDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { checkExistsOrganization, createIndexIfNotExists } from '../common'
import { createOrganizationRequestSchema } from '../schema'

export async function POST(request: NextRequest) {
  try {
    const [body, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    await createIndexIfNotExists(elastic)

    const { address: addressInput, ...organizationData } =
      await createOrganizationRequestSchema.validate(body)

    await checkExistsOrganization(organizationData.organizationId)

    const createData = {
      ...organizationData,
      address: addressInput,
      isSuspended: false,
    }

    const createOrganizationId = organizationData.organizationId

    await Promise.all([
      setDoc(
        DocRef.organization(createOrganizationId),
        addFieldsCreate(createData),
      ),
      elastic.index({
        index: ELASTIC_INDEX.organizations,
        id: createOrganizationId,
        document: addFieldsCreate(createData, true),
      }),
    ])

    return NextResponse.json(organizationData)
  } catch (error: any) {
    return handleError(error)
  }
}

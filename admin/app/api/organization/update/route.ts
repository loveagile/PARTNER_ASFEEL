import { ELASTIC_INDEX } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { addFieldsUpdate } from '@/utils/firestore'
import {
  documentId,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { createOrganizationRequestSchema } from '../schema'
import { checkExistsOrganization } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const [body, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    const { id: organizationDocId, ...organizationData } =
      await createOrganizationRequestSchema.validate(body)

    if (!organizationDocId) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    await checkExistsOrganization(
      organizationData.organizationId,
      organizationDocId,
    )

    const queryCurrentOrganization = query(
      ColRef.organizations,
      where(documentId(), '==', organizationDocId),
    )

    const currentOrganizationSnap = await getDocs(queryCurrentOrganization)

    if (currentOrganizationSnap.docs.length === 0) {
      throw ErrorValidation.FORBIDDEN.message
    }

    const currentOrganization = getDocIdWithData(
      currentOrganizationSnap.docs[0],
    )

    await Promise.all([
      updateDoc(
        DocRef.organization(currentOrganization.id),
        addFieldsUpdate(organizationData),
      ),
      elastic.update({
        index: ELASTIC_INDEX.organizations,
        id: currentOrganization.id,
        doc: addFieldsUpdate(organizationData, true),
      }),
    ])

    return NextResponse.json({ id: currentOrganization.id })
  } catch (error) {
    return handleError(error)
  }
}

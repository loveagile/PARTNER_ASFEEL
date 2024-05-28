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
import { createCategoryRequestSchema } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const [body, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    const { id: categoryDocId, ...categoryData } =
      await createCategoryRequestSchema.validate(body)

    if (!categoryDocId) {
      throw ErrorValidation.VALIDATE_ERROR.message
    }

    const queryCurrentCategory = query(
      ColRef.categories,
      where(documentId(), '==', categoryDocId),
    )

    const currentCategorySnap = await getDocs(queryCurrentCategory)

    if (currentCategorySnap.docs.length === 0) {
      throw ErrorValidation.FORBIDDEN.message
    }

    const currentCategory = getDocIdWithData(currentCategorySnap.docs[0])

    await Promise.all([
      updateDoc(
        DocRef.category(currentCategory.id),
        addFieldsUpdate(categoryData),
      ),
      elastic.update({
        index: ELASTIC_INDEX.categories,
        id: currentCategory.id,
        doc: addFieldsUpdate(categoryData, true),
      }),
    ])

    return NextResponse.json({ id: currentCategory.id })
  } catch (error) {
    return handleError(error)
  }
}

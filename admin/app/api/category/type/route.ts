import { ErrorValidation } from '@/constants/error'
import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError, parseQueryParam } from '@/utils/common'
import { getDocs } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    let type = params.get('type')
    type = parseQueryParam(type)

    if (type === 'large') {
      const largeCategoriesSnapshot = await getDocs(ColRef.largeCategories)
      return NextResponse.json(
        largeCategoriesSnapshot.docs.map((doc) => getDocIdWithData(doc)),
      )
    }

    if (type === 'medium') {
      const mediumCategoriesSnapshot = await getDocs(ColRef.mediumCategories)
      return NextResponse.json(
        mediumCategoriesSnapshot.docs.map((doc) => getDocIdWithData(doc)),
      )
    }

    if (!type) {
      const categoriesSnapshot = await getDocs(ColRef.categories)
      return NextResponse.json(
        categoriesSnapshot.docs.map((doc) => getDocIdWithData(doc)),
      )
    }

    throw ErrorValidation.FORBIDDEN.message
  } catch (error) {
    return handleError(error)
  }
}

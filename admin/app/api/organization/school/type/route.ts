import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError, parseQueryParam } from '@/utils/common'
import { getDocs, query, where } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const type = parseQueryParam(params.get('type'))
    const prefecture = parseQueryParam(params.get('prefecture'))

    let data = []
    if (type) {
      let whereClause = [where('organizationType', '==', type)]
      if (prefecture) {
        whereClause.push(where('prefecture', '==', prefecture))
      }
      const schoolSnapshot = await getDocs(
        query(ColRef.organizations, ...whereClause),
      )

      data = schoolSnapshot.docs.map((doc) => getDocIdWithData(doc))
    } else {
      const schoolTypeSnapshot = await getDocs(ColRef.organizationTypes)
      data = schoolTypeSnapshot.docs.map((doc) => getDocIdWithData(doc))
    }

    return NextResponse.json(data)
  } catch (error) {
    return handleError(error)
  }
}

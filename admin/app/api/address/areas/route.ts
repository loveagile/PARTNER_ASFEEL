import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError, parseQueryParam } from '@/utils/common'
import { getDocs, query, where } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    let prefecture = []
    for (const [key, value] of params.entries()) {
      const parsedValue = parseQueryParam(value)
      if (key === 'prefecture') {
        prefecture.push(parsedValue)
      }
    }

    const clause = []
    if (prefecture.length) {
      clause.push(where('prefecture', 'in', prefecture))
    }

    const dataSnapshots = await getDocs(query(ColRef.areas, ...clause))

    const data = dataSnapshots.docs.map((doc) => getDocIdWithData(doc))

    return NextResponse.json(data)
  } catch (error) {
    return handleError(error)
  }
}

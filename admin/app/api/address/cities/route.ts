import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError, parseQueryParam } from '@/utils/common'
import { getDocs, query, where } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    let prefectures = []
    let areas = []
    for (const [key, value] of params.entries()) {
      const parsedValue = parseQueryParam(value)
      if (key === 'prefectures') {
        prefectures.push(parsedValue)
      }
      if (key === 'areas') {
        areas.push(parsedValue)
      }
    }

    const clause = []
    if (prefectures.length) {
      clause.push(where('prefecture', 'in', prefectures))
    }

    if (areas.length) {
      clause.push(where('area', 'in', areas))
    }

    const dataSnapshots = await getDocs(query(ColRef.cities, ...clause))

    const data = dataSnapshots.docs.map((doc) => getDocIdWithData(doc))

    return NextResponse.json(data)
  } catch (error) {
    return handleError(error)
  }
}

import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getDocs, orderBy, query, where } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const prefecture = params.get('prefecture')
    const area = params.get('area')

    if (prefecture && area) {
      const cities = await getDocs(
        query(
          ColRef.cities,
          where('prefecture', '==', prefecture),
          where('area', '==', area),
        ),
      )

      return NextResponse.json(cities.docs.map((doc) => getDocIdWithData(doc)))
    }

    if (prefecture) {
      const areas = await getDocs(
        query(ColRef.areas, where('prefecture', '==', prefecture)),
      )

      return NextResponse.json(areas.docs.map((doc) => getDocIdWithData(doc)))
    }

    const prefectures = await getDocs(
      query(ColRef.prefectures, orderBy('index')),
    )

    return NextResponse.json(
      prefectures.docs.map((doc) => getDocIdWithData(doc)),
    )
  } catch (error) {
    return handleError(error)
  }
}
